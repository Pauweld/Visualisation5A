function Graph(id,width,height,values,binH,regression)
{
	this.margin={top:5,bottom:30+5,left:10,right:10};
	this.width=width-this.margin.left+this.margin.right;
	this.height=height-this.margin.top+this.margin.bottom;
	this.values=values;
	var that=this;

	this.x = d3.scale.linear().domain([0,20]).range([0,this.width]);
	this.y = d3.scale.linear().domain([0,100]).range([0,this.height]);
	
	this.regression = regression;

	this.map = this.values.map(function(i){
		return parseInt(i);
	})

	this.xAxis=d3.svg.axis()
		.scale(this.x)
		.ticks(20)
		.orient("bottom");

	this.svg=d3.select("#"+id).append("svg")
		.attr("class","graph")
		.attr("width",this.width+this.margin.left+this.margin.right)
		.attr("height",this.height+this.margin.top+this.margin.bottom)
		.append("g")
			.attr("transform","translate("+this.margin.left+","+this.margin.top+")");

	this.d3line=d3.svg.line()
		.x(function(d){return this.x(d.x);})
		.y(function(d){return this.y(d.y);})
		.interpolate("basis"); 

	//ajoute l'abcisse au graphe
	this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + this.height + ")")
		.call(this.xAxis);

	//définit le nombre de bins et la fonction qui mappe chaque valeur de données de l'histogramme
	this.histogram = d3.layout.histogram()
		.bins(binH)(this.map);

	//définit les bars
	this.bars = this.svg.selectAll(".bar")
		.data(this.histogram)
		.enter()
		.append("g")

	this.bars.append("rect")
		.attr("x", function(d){return that.x(d.x);})
		.attr("y", function(d){return 129.5 - that.y(d.y)*10;})
		.attr("width", function(d){return that.x(d.dx) - 0.25;})
		.attr("height", function(d){return that.y(d.y)*10;})
		.attr("fill", "steelblue")

	
	var lineData = function(valeurs, regression){
		var a = [];
		var h = regression;
		var constant;
		var max = 0;
		var min = 999999999999999;
		for (var i=0; i<20; i+=0.5){
			constant = 0;
			for (var j=0; j<valeurs.length; j++){
				constant += Math.exp((-1/2.0) * (i-parseInt(valeurs[j])) * (i-parseInt(valeurs[j])) / h);
			}
			if (constant > max){
				max = constant;
			}
			if (constant < min){
				min = constant;
			}
			a.push({x:i, y:constant});
		}
		for (var i=0; i<a.length; i++){
			a[i].y = 100 - (a[i].y / (max-min) * 100);
		}
		return a;
	};
	
	//var lineData = [{x: 10, y:20},{x: 15, y:25},{x: 20, y:30}];
		
	this.lineGraph = this.svg.append("path")
		.attr("d", this.d3line(lineData(that.values, that.regression)))
		.attr("stroke", "red")
		.attr("stroke-width", 2)
		.attr("fill", "none");
		
		
	this.setValues=function(values){
		this.values=values;
		return(this);};
}

function updateRangeBar(g, values, val, regression){
	d3.select("#graph").selectAll("svg").remove();
	g = new Graph('graph', 300, 100, values, parseInt(val), parseInt(regression));
	return g;
}
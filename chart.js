function Graph(id,width,height,values,binH)
{
	this.margin={top:5,bottom:30+5,left:10,right:10};
	this.width=width-this.margin.left+this.margin.right;
	this.height=height-this.margin.top+this.margin.bottom;
	this.values=values;
	var that=this;

	this.x = d3.scale.linear().domain([0,20]).range([0,this.width]);
	this.y = d3.scale.linear().domain([0,100]).range([0,this.height]);

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

	this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + this.height + ")")
		.call(this.xAxis);

	this.histogram = d3.layout.histogram()
		.bins(binH)
		(this.map);

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

	this.setValues=function(values){
		this.values=values;
		return(this);};
}

function updateRangeBar(g, values, val){
	d3.select("#graph").selectAll("svg").remove();
	g = new Graph('graph', 300, 100, values, parseInt(val));
	return g;
}
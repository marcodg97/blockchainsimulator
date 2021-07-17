class Graph {

	constructor(values = [], x = function(d) {return d}, y = function(d) {return d}, color = 'steelblue') {
		this.values = values;
		
		this.x = x;
		this.y = y;

		this.color = color;
	}

	render(svgID, x, y, margin = {top:20, left:20, right:20, bottom:50}) {

		const svgDOM = document.getElementById(svgID);
		const width = svgDOM.clientWidth;
		const height = svgDOM.clientHeight;

		console.log(width, height);

		let svg = d3.select('#'+svgID);

		let scaleX = d3.scaleLinear().domain(x).range([margin.left, width-margin.right]);
		svg.append('g')
			.attr('transform','translate(0,'+(height-margin.top)+')')
			.call(d3.axisBottom(scaleX));

		let scaleY = d3.scaleLinear().domain(y).range([height-margin.top, margin.top]);
		svg.append('g')
			.attr('transform','translate('+margin.left+',0)')
			.call(d3.axisLeft(scaleY));

		svg.append('path')
			.datum(this.values)
			.attr('fill', 'none')
			.attr('stroke', this.color)
			.attr('stroke-width', 1.5)
			.attr('d', d3.line()
				.x( (d) => {return scaleX(this.x(d))})
				.y( (d) => {return scaleY(this.y(d))})
			)
	}

}
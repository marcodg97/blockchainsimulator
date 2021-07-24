class Graph {

	constructor(elementId, type = 'line') {
		this.chart = c3.generate({
			bindto: elementId, 
			data: {
				x: 'x',
				type: type,
				columns: [
					['x']
				]
			},
			point: {show: false},
			zoom: {enabled: true},
			legend: {position: 'inset'}
		});
	}

	addLine(name, color, values = []) {
		let x = ['x'];
		let y = [name];

		values.forEach((value) => {
			x.push(value.x);
			y.push(value.y);
		});

		this.chart.load({
			columns: [x,y]
		});

		let colorObj = {};
		colorObj[name] = color;
		this.chart.data.colors(colorObj);
	}

	removeLine(name) {
		this.chart.unload({ids: [name]});
	}

}
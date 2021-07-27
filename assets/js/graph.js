class Graph {

	constructor(elementId) {
		this.chart = c3.generate({
			bindto: elementId,
			data: {
				x: 'x',
				type: 'line',
				columns: [
					['x']
				],
				axes: {
					'Difficulty':'y',
					'Concurrent chains':'y2'
				}
			},
			axis : {
				x : {
					label : {
						text: 'Height',
						position: 'outer-center'
					}
				},
				y : {
					label : {
						text: 'Difficulty',
						position: 'outer-middle'
					},
					tick: {
						format: function (d) { return Math.floor(d)},
						count: 5
					}
				},
				y2 : {
					label : {
						text: 'Concurrent chains',
						position: 'outer-middle'
					},
					tick: {
						fit: true,
						format: function (d) { return Number.isInteger(d) ? d : ''}
					},
					show: true
				}
			},
			point: {show: false},
			zoom: {enabled: true},
			legend: {position: 'inset'}
		});

		this.chart.data.colors({
			'Difficulty' : 'rgb(255, 127, 14)',
			'Concurrent chain' : 'blue'
		});
	}

	addLine(name, values = []) {
		let x = ['x'];
		let y = [name];

		values.forEach((value) => {
			x.push(value.x+1);
			y.push(value.y);
		});

		this.chart.load({
			columns: [x,y]
		});
	}

	removeLine(name) {
		this.chart.unload({ids: [name]});
	}

}
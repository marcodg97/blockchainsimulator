const blockchain = {
	"heights": [
		["a"],
		["b"],
		["c"],
		["d","e"],
		["f","g","e2"]
	], "blocks": {
		"a": {
			"id":"a",
			"altezza":0,
			"padre":null,
			"figlio1":"b",
			"figlio2":null,
			"valore":1000
		},
		"b": {
			"id":"b",
			"altezza":1,
			"padre":"a",
			"figlio1":"c",
			"figlio2":null,
			"valore":1100
		},
		"c": {
			"id":"c",
			"altezza":2,
			"padre":"b",
			"figlio1":"d",
			"figlio2":"e",
			"valore":1200
		},
		"d": {
			"id":"d",
			"altezza":3,
			"padre":"c",
			"figlio1":"f",
			"figlio2":"g",
			"valore":1300
		},
		"e": {
			"id":"e",
			"altezza":3,
			"padre":"c",
			"figlio1":"e2",
			"figlio2":null,
			"valore":1300
		},
		"f": {
			"id":"f",
			"altezza":4,
			"padre":"d",
			"figlio1":null,
			"figlio2":null,
			"valore":1400
		},
		"g": {
			"id":"g",
			"altezza":4,
			"padre":"d",
			"figlio1":null,
			"figlio2":null,
			"valore":1400
		},
		"e2":  {
			"id":"e2",
			"altezza":4,
			"padre":"e",
			"figlio1":null,
			"figlio2":null,
			"valore":1400
		}
	}
}

/***********************************************************************************************************/
const NODE_WIDTH = 100;

const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = d3.select('svg');
const g = svg.append('g');

svg.call(d3.zoom().extent([[0, 0], [720, 512]]).scaleExtent([0.1, 5]).on("zoom", zoomed));

let lastTranslate = undefined;
function zoomed({transform}) {
	let actualModule = transform.x % 100;
	if(actualModule === 0) {
		console.log('renderizza livello verso '+(lastTranslate < transform.x ? 'sinistra':'destra'));
	} else {
		lastTranslate = transform.x;
	}

	g.attr("transform", transform);
}


blockchain['blocks'][blockchain.heights[0][0]]['render_altezza'] = 0;

for(i=0; i<blockchain.heights.length; i++) {
	for(j=0; j<blockchain.heights[i].length; j++) {
		block = blockchain['blocks'][blockchain.heights[i][j]];

		if(block.figlio1 != null) {
			blockchain['blocks'][block['figlio1']]['render_altezza'] = block.render_altezza;

			g.append('line')
				.attr('x1', i*NODE_WIDTH)
				.attr('y1', block.render_altezza)
				.attr('x2', (i+1)*NODE_WIDTH)
				.attr('y2', block.render_altezza)
				.attr('style','stroke:rgb(0,0,0)')
		}

		if(block.figlio2 != null) {
			blockchain['blocks'][block['figlio2']]['render_altezza'] = (blockchain.heights[i].length % 2 ? 1:-1)*NODE_WIDTH;

			g.append('path')
				.attr('d', 'M'+(i*NODE_WIDTH)+','+block.render_altezza+' C'+((i+1)*NODE_WIDTH)+','+block.render_altezza+' '+(i*NODE_WIDTH)+','+blockchain['blocks'][block['figlio2']]['render_altezza']+' '+((i+1)*NODE_WIDTH)+','+blockchain['blocks'][block['figlio2']]['render_altezza'])
				.attr('stroke','black')
				.attr('fill', 'transparent')
		}

		g.append('circle')
			.attr('cx', i*NODE_WIDTH)
			.attr('cy', block.render_altezza)
			.attr('r', NODE_WIDTH/5)
			.style('fill', '#68b2a1')
			.on('mouseover', (event) => {
				event.srcElement.style.fill = "red";
			})
			.on('mouseout', (event) => {
				event.srcElement.style.fill = "#68b2a1";
			})

		g.append('text')
			.attr('x', i*NODE_WIDTH)
			.attr('y', block.render_altezza)
			.html(block.id)

	}
}

/*for(let i=0; i<210; i++) {
	g.append('line')
		.attr('x1', i*NODE_WIDTH)
		.attr('y1', 200)
		.attr('x2', (i+1)*NODE_WIDTH)
		.attr('y2', 200)
		.attr('style','stroke:rgb(0,0,0)')
	g.append('path')
		.attr('d', 'M'+(i*NODE_WIDTH)+',200 C'+((i+1)*NODE_WIDTH)+',200 '+(i*NODE_WIDTH)+',0 '+((i+1)*NODE_WIDTH)+',0')
		.attr('stroke','black')
		.attr('fill', 'transparent')
		
	g.append('circle')
		.attr('cx', i*NODE_WIDTH)
		.attr('cy', 200)
		.attr('r', NODE_WIDTH/5)
		.style('fill', '#68b2a1')
		.on('mouseover', (event) => {
			event.srcElement.style.fill = "red";
		})
		.on('mouseout', (event) => {
			event.srcElement.style.fill = "#68b2a1";
		})

	g.append('circle')
		.attr('cx', i*NODE_WIDTH)
		.attr('cy', 0)
		.attr('r', NODE_WIDTH/5)
		.style('fill', '#68b2a1')
		.on('mouseover', (event) => {console.log(event);})

}*/
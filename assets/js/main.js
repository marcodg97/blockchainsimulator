const NODE_WIDTH = 200;

const width = document.body.clientWidth;
const height = document.body.clientHeight;

console.log(width, height);

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

for(let i=0; i<210; i++) {
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

}
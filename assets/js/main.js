const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = d3.select('svg');
const g = d3.select('g');
const RENDERING_WINDOW = 50;

const viewBound = {
	'up': document.getElementById('main-view').clientHeight/4,
	'down': document.getElementById('main-view').clientHeight
}

const blockchain = new Blockchain();

const graph = new Graph();

/*********************************************************************************************************/

var forkProbability = 50000;
var blockNumber = 100;

svg.call(d3.zoom().extent([[0, 0], [720, 512]]).scaleExtent([0.5, 1.5]).on("zoom", zoomed));

d3.select('#fork-prob-range').on('change', (event) => {
	d3.select('#fork-prob-text').html('Fork probability (1 of '+event.srcElement.value+')');
	forkProbability = event.srcElement.value;
});

d3.select('#block-numbers').on('change', (event) => {
	blockNumber = event.srcElement.value;
});

d3.select('#goto-height').on('change', (event) => {
	console.log('a')

	if(event.srcElement.value < RENDERING_WINDOW)
		blockchain.render(g, 0, RENDERING_WINDOW);
	else
		blockchain.render(g, parseInt(event.srcElement.value,10)-RENDERING_WINDOW, parseInt(event.srcElement.value,10)+RENDERING_WINDOW);
});

graph.values = [
	{x: 0, y: 0},
	{x: 1, y: 1},
	{x: 2, y: 2},
	{x: 3, y: 3},
	{x: 4, y: 4},
	{x: 5, y: 5},
	{x: 6, y: 6},
	{x: 7, y: 7},
	{x: 8, y: 8},
];

graph.x = function(d) {
	return d.x;
}

graph.y = function(d) {
	return d.y;
}

graph.color = 'orange';

graph.render('graph-view', [0,9], [0,9]);

/*********************************************************************************************************/

let lastTranslate = 0;
function zoomed({transform}) {
	let x = -1*transform.x;

	if(transform.y < 0)
		transform.y = 0;
	else if(transform.y > viewBound.down)
		transform.y = viewBound.down;

	if(x > lastTranslate+blockchain.dimensions) {

		lastTranslate = x+blockchain.dimensions;

		blockchain.render(g, blockchain.renderized_to, blockchain.renderized_to+10, false);
		blockchain.removeFirst(2);

	} else if(x < lastTranslate-blockchain.dimensions) {

		lastTranslate = x-blockchain.dimensions;

		if(blockchain.renderized_from > 0) {
			blockchain.render(g, blockchain.renderized_from-10, blockchain.renderized_from, false);
			blockchain.removeLast(2);
		}

	}

	g.attr("transform", transform);
}

async function computeAndRender() {
	d3.select('#generate_icon').attr('class', 'text-danger nav-icon fas fa-circle-notch fa-spin');
	let height = blockNumber/2;

	await blockchain.compute(forkProbability, blockNumber);

	console.log(blockchain.forks);

	if(height < RENDERING_WINDOW)
		blockchain.render(g, 0, RENDERING_WINDOW);
	else
		blockchain.render(g, height-RENDERING_WINDOW, height+RENDERING_WINDOW);

	d3.select('#goto-height').attr('placeholder', height)

	d3.select('#generate_icon').attr('class', 'text-danger nav-icon far fa-play-circle');
}
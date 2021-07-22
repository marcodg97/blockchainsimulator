const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = d3v7.select('svg');
const g = d3v7.select('g');

const RENDERING_WINDOW = 100;
const MAX_GRAPH_TICK = 100;

const viewBound = {
	'up': document.getElementById('main-view').clientHeight/4,
	'down': document.getElementById('main-view').clientHeight
}

const blockchain = new Blockchain(width);

console.log(d3v7.version);

/************************************************************************************************************************************************/

var forkProbability = 50000;
var forkFertility = 50000;
var blockNumber = 100;

svg.call(d3v7.zoom().extent([[0, 0], [720, 512]]).scaleExtent([0.25, 1.5]).on('zoom', zoomed));

d3v7.select('#fork-prob-range').on('change', (event) => {forkProbability = event.srcElement.value;});
d3v7.select('#fork-fertility').on('change', (event) => {forkFertility = event.srcElement.value;});
d3v7.select('#block-numbers').on('change', (event) => {blockNumber = event.srcElement.value;});

d3v7.select('#goto-height').on('change', (event) => {
	if(event.srcElement.value < RENDERING_WINDOW)
		blockchain.render(g, 0, RENDERING_WINDOW);
	else
		blockchain.render(g, parseInt(event.srcElement.value,10)-RENDERING_WINDOW, parseInt(event.srcElement.value,10)+RENDERING_WINDOW);
});

/************************************************************************************************************************************************/

const difficultyGraph = new Graph('#difficulty-graph', 'line', {Difficulty: '#000'});
const forksGraph = new Graph('#forks-graph');

/************************************************************************************************************************************************/

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

	g.attr('transform', transform);
}

async function computeAndRender() {
	d3v7.select('#generate_icon').attr('class', 'text-danger nav-icon fas fa-circle-notch fa-spin');
	let height = (blockNumber/2) | 0;

	await blockchain.compute(forkProbability, forkFertility, blockNumber);

	//Graphs draw
	let difficultyValues = [];
	let forkValues = [{
		x: 0,
		y: 1
	}];

	let tick = blockchain.chain.heights.length > MAX_GRAPH_TICK ? ((blockchain.chain.heights.length/MAX_GRAPH_TICK) | 0) : 1;

	for(let i=0; i<blockchain.chain.heights.length; i+=tick) {
		difficultyValues.push({
			x: i,
			y: blockchain['chain']['blocks'][blockchain.chain.heights[i][0]]['value']
		});
	}

	for(let i=1; i<blockchain.chain.heights.length-1; i++) {
		if(blockchain.chain.heights[i].length != blockchain.chain.heights[i-1].length) {

			forkValues.push({
				x: i-1,
				y: blockchain.chain.heights[i-1].length
			});

			forkValues.push({
				x: i,
				y: blockchain.chain.heights[i].length
			});
		}
	}

	forkValues.push({
		x: blockchain.chain.heights.length,
		y: blockchain.chain.heights[blockchain.chain.heights.length-1].length
	});

	difficultyGraph.addLine('Difficulty', difficultyValues);
	forksGraph.addLine('Concurrent chains', forkValues);

	blockchain.compactRender(g);

	d3v7.select('#goto-height').attr('placeholder', height)
	d3v7.select('#generate_icon').attr('class', 'text-danger nav-icon far fa-play-circle');
}
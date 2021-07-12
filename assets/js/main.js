const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = d3.select('svg');
const g = svg.append('g');
const RENDERING_WINDOW = 100;

const blockchain = new Blockchain();

/*********************************************************************************************************/

var forkProbability = 50000;

svg.call(d3.zoom().extent([[0, 0], [720, 512]]).scaleExtent([0.1, 5]).on("zoom", zoomed));

d3.select('#fork-prob-range').on('change', (event) => {
	d3.select('#fork-prob-text').html('Fork probability (1 of '+event.srcElement.value+')');
	forkProbability = event.srcElement.value;
});

let lastTranslate = 0;
function zoomed({transform}) {
	let x = -1*transform.x;

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

async function computeAndRender(length, height = 0) {
	d3.select('#generate_icon').attr('class', 'text-danger nav-icon fas fa-circle-notch fa-spin');

	await blockchain.compute(forkProbability, length);

	console.log(blockchain.forks);

	if(height < RENDERING_WINDOW)
		blockchain.render(g, 0, RENDERING_WINDOW);
	else
		blockchain.render(g, height-RENDERING_WINDOW, height+RENDERING_WINDOW);

	d3.select('#generate_icon').attr('class', 'text-danger nav-icon far fa-play-circle');
}
const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = d3.select('svg');
const g = svg.append('g');

const blockchain = new Blockchain();

/*********************************************************************************************************/

svg.call(d3.zoom().extent([[0, 0], [720, 512]]).scaleExtent([0.1, 5]).on("zoom", zoomed));

let lastTranslate = 0;
function zoomed({transform}) {
	if(-1*transform.x > lastTranslate+blockchain.dimensions) {

		console.log('renderizza livello verso destra');
		lastTranslate = (-1*transform.x)+blockchain.dimensions;

		blockchain.render(g, blockchain.renderized_to, blockchain.renderized_to+10, false);

		console.log(blockchain.renderized_from, blockchain.renderized_to);

	} else if(-1*transform.x < lastTranslate-blockchain.dimensions) {

		console.log('renderizza livello verso sinistra');
		lastTranslate = (-1*transform.x)-blockchain.dimensions;

	}

	g.attr("transform", transform);
}

async function computeAndRender(length, height = 0, rendering_window = 100) {
	d3.select('#generate_icon').attr('class', 'text-danger nav-icon fas fa-circle-notch fa-spin');

	await blockchain.compute(10, length);

	/*if(height < rendering_window)
		blockchain.render(g, 0, rendering_window);
	else
		blockchain.render(g, height-rendering_window, height+rendering_window);*/

	blockchain.render(g, 100, 200);
	blockchain.render(g, 0, 100, false);

	d3.select('#generate_icon').attr('class', 'text-danger nav-icon far fa-play-circle');
}
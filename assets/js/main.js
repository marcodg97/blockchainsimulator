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

const blockchain = new Blockchain();

async function computeAndRender(length, height = 0, rendering_window = 100) {
	d3.select('#generate_icon').attr('class', 'text-danger nav-icon fas fa-circle-notch fa-spin');

	await blockchain.compute(10, length);

	blockchain.render(g, 0, 100);
	blockchain.render(g, 100, 200, false);
	blockchain.render(g, 200, 300, false);
	blockchain.render(g, 300, 500, false);

	d3.select('#generate_icon').attr('class', 'text-danger nav-icon far fa-play-circle');
}
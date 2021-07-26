const width = document.body.clientWidth;
const height = document.body.clientHeight;
const viewBound = document.getElementById('main-view').clientHeight;

const svg = d3v7.select('svg');
const g = d3v7.select('g');

const RENDERING_WINDOW = 100;
const MAX_GRAPH_TICK = 100;

const blockchain = new Blockchain(width);

var lastTransform = {x:0,y:0,k:1};
var position = {x:0,y:0,k:1};

/************************************************************************************************************************************************/

var forkProbability = 5000;
var forkFertility = 5;
var blockNumber = 500000;

svg.call(d3v7.zoom().extent([[0, 0], [720, 512]]).scaleExtent([0.15, 1.5]).on('zoom', zoomed));
svg
	.on('mousedown', () => svg.attr('style', 'cursor: grabbing; cursor: -webkit-grabbing;'))
	.on('mouseup', () => svg.attr('style', 'cursor: grab; cursor: -webkit-grab;'));

d3v7.select('#fork-prob-range').on('change', (event) => {forkProbability = event.srcElement.value;});
d3v7.select('#fork-fertility').on('change', (event) => {forkFertility = event.srcElement.value;});
d3v7.select('#block-numbers').on('change', (event) => {blockNumber = event.srcElement.value;});

d3v7.select('#searchBtnHeight').on('click', () => {
	if(blockchain.foundHeights){
		// metti in grigio quella/e prima
		d3.select("#line"+blockchain.foundHeights[0]).attr('style',  'stroke:#aaa; stroke-dasharray:5,5');

		if(blockchain.foundHeights[1]){
			d3.select("#line"+blockchain.foundHeights[1]).attr('style',  'stroke:#aaa; stroke-dasharray:5,5');
		}
	}
	// metti in evidenza la nuova o le nuove
	goToView(blockchain.heightPosition($('#goto-height').val()), height/3);

	if(d3.select("#line"+blockchain.foundHeights[0])){
		d3.select("#line"+blockchain.foundHeights[0]).attr('style',  'stroke:red; stroke-dasharray:5,5');
	}
	
	if(d3.select("#line"+blockchain.foundHeights[1])){
		d3.select("#line"+blockchain.foundHeights[1]).attr('style',  'stroke:red; stroke-dasharray:5,5');
	}
});

d3v7.select('#searchBtnBlock').on('click', () => {
	if(blockchain.foundBlock){
		
		//d3.selectAll("#circle"+blockchain.foundBlock).attr('style',  'stroke:transparent;');
	};
	console.log("Vecchio blocco: ",blockchain.foundBlock);
	

	// prendi correttamente la posizione del nodo
	if(blockchain.chain.blocks[$('#goto-block').val()]){
		var xBlock=blockchain.heightPosition(blockchain.chain.blocks[$('#goto-block').val()].height, false);
		var yBlock= height/2 - blockchain.chain.blocks[$('#goto-block').val()].render_height;
		goToView(xBlock, yBlock);

		blockchain.foundBlock = blockchain.chain.blocks[$('#goto-block').val()].id
		//console.log(d3.selectAll("#circle"+blockchain.foundBlock));
		d3.selectAll("#circle"+blockchain.foundBlock).attr('style',  'stroke:red; fill:red; stroke-dasharray:10');
		//blockchain.colorSelectedBlock(xBlock, yBlock);
	}else if($('#goto-block').val()<1){
		
		goToView(blockchain.heightPosition(blockchain.chain.positions[0].height, false), height/3);
		blockchain.foundBlock = 1;
		
			
	}else{
		
		goToView(blockchain.heightPosition(blockchain.chain.positions[blockchain.chain.positions.length -1].height, false), height/3);
		blockchain.foundBlock = Object.keys(blockchain.chain.blocks).length;
	}

	// metti in evidenza il nuovo
	//d3.select("#circle"+blockchain.foundHeights[1]).attr('style',  'stroke:#aaa; stroke-dasharray:5,5');

	
	console.log("Nuovo blocco: ",blockchain.foundBlock);
})

/************************************************************************************************************************************************/

const graph = new Graph('#graph');

/************************************************************************************************************************************************/

let lastTranslate = 0;
let lastPositionK = 0;
let lastPositionX = 0;
let lastPositionY = 0;
function zoomed({transform}) {
	position.x += (transform.x - lastTransform.x);
	position.y += (transform.y - lastTransform.y);	
	position.k += (transform.k - lastTransform.k);
	lastTransform = transform; 	

	if(position.y < 0)
		position.y = 0;
	else if(position.y > viewBound)
		position.y = viewBound;

	g.attr('transform', 'translate('+position.x+','+position.y+') scale('+position.k+')');
}

function goToView(x,y) {
	position.x = x;
	position.y = y;
	position.k = 1;

	g.attr('transform','translate('+x+','+y+') scale(1)');
}

async function computeAndRender() {

	//visibili i pulsanti di indirizzamento
	d3.selectAll('#GoToHeight').style("visibility","visible");
	d3.selectAll('#GoToBlock').style("visibility","visible");


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

	graph.addLine('Difficulty', difficultyValues);
	graph.addLine('Concurrent chains', forkValues);

	blockchain.compactRender(g);
	goToView((width/2)-250, 240);
	//blockchain.render(g);
}

goToView((width/2)-250, height/3 -40);
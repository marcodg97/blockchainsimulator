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
	goToView(blockchain.heightPosition($('#goto-height').val()), height/2);

	d3.select("#line"+blockchain.foundHeights[0]).attr('style',  'stroke:red; stroke-dasharray:5,5');
	if(d3.select("#line"+blockchain.foundHeights[1])){
		d3.select("#line"+blockchain.foundHeights[1]).attr('style',  'stroke:red; stroke-dasharray:5,5');
	}
});

d3v7.select('#searchBtnBlock').on('click', () => {
	if(blockchain.foundBlock){
		//d3.select("#line"+blockchain.foundHeights[1]).attr('style',  'stroke:#aaa; stroke-dasharray:5,5');
	};
	console.log("Vecchio blocco: ",blockchain.foundBlock);


	// metti in rosso il nuovo


	goToView(blockchain.heightPosition(blockchain.chain.blocks[$('#goto-block').val()].height, false), height/2);
	blockchain.foundBlock = blockchain.chain.blocks[$('#goto-block').val()].id;
	console.log("Nuovo blocco: ",blockchain.foundBlock);
})

/************************************************************************************************************************************************/

const graph = new Graph('#graph');

/************************************************************************************************************************************************/

let lastTranslate = 0;
let lastPositionK = 0;
let lastPositionX = 0;
let lastPositionY = 0;

//----------qui ho aggiunto maxX e maxY per capire quale punto massimo/minimo di x e y servisse avere come limite
let maxX = blockchain.maxRenderX;
let maxY = blockchain.maxRenderY;
let oldPk = 1
let oldPx = 0
let oldPy = 0
//------------------------------qui sotto è come prima-----------------------------

function zoomed({transform}) {

//---------------------------------------------------------------------
	oldPk = position.k	
	oldPx = position.x
	oldPy = position.y
//---------------------------------------------------------------------

	position.x += (transform.x - lastTransform.x);
	position.y += (transform.y - lastTransform.y);
	position.k += (transform.k - lastTransform.k);
	lastTransform = transform; 	

// qui la vera schifezza: con il fatto che all'inizio è zero e che si deve aggiornare ad ogni computazione dell'algoritmo lo riassegno continuamente
	maxY = blockchain.maxRenderY;
	if(position.y < -maxY+50)
		position.y = -maxY+50;
	else if(position.y > viewBound+maxY-50)
		position.y = viewBound+maxY-50;

	maxX = blockchain.maxRenderX
	if(position.x < -maxX+120){
		position.x = -maxX+120;
	}

//----------questo è innocente, perché il primo blocco è sempre in (0,0) 
	if(position.x > width-360)
		position.x = width-360;

//---------qui risolvo lo zoom, se k cambia, non cambiano x e y --------
	if (position.k != oldPk){
		position.x = oldPx;
		position.y = oldPy;
	}
//----------------------------------------------------------------------

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
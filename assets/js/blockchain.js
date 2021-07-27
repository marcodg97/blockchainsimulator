class Blockchain {

	constructor(width, dimensions = 120) {
		this.chain = {
			'heights':[],
			'blocks':{},
			'positions':[]
		};

		this.forks = [];
		this.dimensions = dimensions;
		this.offset = 0;
		this.clickedBlock = null;
		this.width = width;
		this.foundBlock = null;
		this.foundHeights = [];

//------------------Variabili globali perché le richiamo nel main--------------------
		this.maxRenderX = 0;
		this.maxRenderY = 0;
//-----------------------------------------------------------------------------------

	}

	clear() {
		this.chain = {
			'heights':[],
			'blocks':{},
			'positions':[]
		};

//------------------azzero dopo un compute-------------------------------------------
		this.maxRenderX = 0;
		this.maxRenderY = 0;
//-----------------------------------------------------------------------------------


		this.forks = [];
	}

	heightPosition(height, bFoundHeight=true) {
		if(height>this.chain.positions[this.chain.positions.length -1].height){
			if(bFoundHeight){
				this.colorSelectedHeights(this.chain.positions.length-1, height);
			}
			return -1*(this.chain.positions[this.chain.positions.length -1].position - this.width/2);
		}

		for(let i=0; i<this.chain.positions.length; i++){
			if(this.chain.positions[i].height >= height){
				if(bFoundHeight){
					this.colorSelectedHeights(i, height);
				}
				if(i>0){
					return -1*(this.chain.positions[i].position - this.width/2 - (this.chain.positions[i].height == height ? (this.chain.positions[i-1].position - this.chain.positions[i].position)/2 : 0));
				}else return -1*(this.chain.positions[i].position - this.width/2);

			}
		}
		
		return 0;
	}
	blockPosition(height) {

		for(let i=0; i<this.chain.positions.length; i++){
			if(this.chain.positions[i].height >= height){

				if(this.chain.positions[i].height == height){
					return height;
				}
				return this.chain.positions[i].height;

			}
		}
		
		return 0;
	}
	
	colorSelectedHeights(index, height) {
		if(this.chain.positions[index].height == height){
			this.foundHeights=[];
			this.foundHeights[0] = height;
			
		}else{
			index<1 ? this.foundHeights[0] = 0 : this.foundHeights[0] = this.chain.positions[index-1].height;
			
			if(height>this.chain.positions[this.chain.positions.length -1].height){

				this.foundHeights[1] = 0;
				this.foundHeights[0] = this.chain.positions[index].height;

			}else{
				this.foundHeights[1] = this.chain.positions[index].height;
			}
		}
	}

	compute(probability, forkFertility, blocksNumber, valueFactor = 20) {
		let h = 0;
		let value = blocksNumber*valueFactor;
		var id = 1;

		this.clear();

		this.chain.heights.push([id.toString()]);
		this['chain']['blocks'][id.toString()] = {
			'id': id,
			'height':0,
			'pred':null,
			'next1':null,
			'next2':null,
			'render_height':0,
			'value':value
		};

		id +=1;

		let flag;
		while(id <= blocksNumber) {
			flag = false;
			this.chain.heights.push([]);

			for(let i=0; i<this.chain.heights[h].length; i++) {
				let block = this['chain']['blocks'][this.chain.heights[h][i]];

				let next1 = null;
				let next2 = null;
				let value = block.value;

				if(!flag) {
					value = value + Math.random()*1000 - 450;
					next1 = {
						'id': id,
						'height': h+1,
						'pred': block.id,
						'next1': null,
						'next2': null,
						'value': value
					}

					block.next1 = id;
					this['chain']['blocks'][id.toString()] = next1;
					this.chain.heights[h+1].push(id.toString());
					id += 1;

					flag = true;
					if (Math.floor(Math.random() * probability) === 0 && blocksNumber > id +1) {
						next2 = {
							'id': id,
							'height': h+1,
							'pred': block.id,
							'next1': null,
							'next2': null,
							'value': value
						}

						block.next2 = id;
						this['chain']['blocks'][id.toString()] = next2;
						this.chain.heights[h+1].push(id.toString());
						this.forks.push(h+1);
						id += 1;
					}

				} else {
					if (Math.floor(Math.random() * forkFertility) === 0 && blocksNumber > id) {
						next1 = {
							'id': id,
							'height': h+1,
							'pred': block.id,
							'next1': null,
							'next2': null,
							'value': value
						}

						block.next1 = id;
						this['chain']['blocks'][id.toString()] = next1;
						this.chain.heights[h+1].push(id.toString());
						id += 1;

						if (Math.floor(Math.random() * forkFertility) === 0 && blocksNumber >= id) {
							next2 = {
								'id': id,
								'height': h+1,
								'pred': block.id,
								'next1': null,
								'next2': null,
								'value': value
							}

							block.next2 = id;
							this['chain']['blocks'][id.toString()] = next2;
							this.chain.heights[h+1].push(id.toString());
							id += 1;
						}
					}
				}

			}

			h += 1;

		}

		for(let i=0; i<this.chain.heights.length; i++) {

//----------------------------------qui trovo il numero massimo di blocchi per altezza-----------
			if (this.maxRenderY < this.chain.heights[i].length)
				this.maxRenderY = this.chain.heights[i].length
//-----------------------------------------------------------------------------------------------


			let blockHeights = [];
			for(let j=0; j<this.chain.heights[i].length; j++) {
				let block = this['chain']['blocks'][this.chain.heights[i][j]];

				
				if(block.next1 !== null) {

					this['chain']['blocks'][block.next1]['render_height'] = block.render_height;
					let multiplier = block.render_height > 0 ? 1:-1;

					while(blockHeights.includes(this['chain']['blocks'][block.next1]['render_height'])) {
						this['chain']['blocks'][block.next1]['render_height'] += multiplier*this.dimensions;
					}

					blockHeights.push(this['chain']['blocks'][block.next1]['render_height'])
				}

				if(block.next2 !== null) {

					let multiplier = block.render_height === 0 ? (forkFertility == probability == 1 ? (this.chain.heights[i].length % 2 ? -1:1) : (Math.random() < 0.5 ? 1:-1)) : (block.render_height > 0 ? 1:-1);
					this['chain']['blocks'][block.next2]['render_height'] = block.render_height + (multiplier*this.dimensions);	

					while(blockHeights.includes(this['chain']['blocks'][block.next2]['render_height'])) {
						this['chain']['blocks'][block.next2]['render_height'] += multiplier*this.dimensions;
					}

					blockHeights.push(this['chain']['blocks'][block.next2]['render_height'])
				}

			}
		}

//---------------------------------------qui calcolo di quanto effettivamente mi devo allontanare da y = 0-----
		this.maxRenderY = (Math.floor(this.maxRenderY/2))*120;
//--------------------------------------------------------------------------------------------------------------

		return this.chain;
	}

	/***************************************************************************************************/

	showBlockDetails(block) {
		d3.select('#blockDetailID').html('#'+block.id);
		d3.select('#blockDetailMaster').html(block.render_height === 0 ? 'Master block':'Forked block');
		d3.select('#blockDetailHeight').html(block.height);
		d3.select('#blockDetailPred').html('#'+block.pred);
		d3.select('#blockDetailNext').html(block.next1 != null ? (block.next2 != null ? ('#'+block.next1+' and #'+block.next2):'#'+block.next1) : '-' )
		d3.select('#blockDetailDifficulty').html(block.value);

		$('#blockDetails').modal('show');
	}

	showClusterBlockDetails(from, to) {
		d3.select('#blocksClusterDetailFrom').html('#'+from);
		d3.select('#blocksClusterDetailTo').html('#'+to);
		d3.select('#blocksClusterDetailLength').html(to-from+1);

		d3.select('#searchBlock')
			.attr('min', from)
			.attr('max', to)

		d3.select('#searchBlockBtn')
			.on('click', (event) => {
				$('#blocksClusterDetails').modal('hide');
				this.showBlockDetails(this.chain.blocks[$('#searchBlock').val()]);
			});

		$('#blocksClusterDetails').modal('show');
	}

	compactRender(svg, clearBefore = true, height = 0) {
		this.compact = true;
		if(clearBefore)
			svg.html('');

		let compactChain = [];
		let maxClusterLenght = 1;

		let from = 0;
		let collecting = false;

		for(let i=1; i<this.chain.heights.length; i++) {
			if(this.chain.heights[i].length == 1 && collecting && this.chain.heights[i+1] && this.chain.heights[i+1].length == 1) {
				collecting = false;

				if(compactChain.length > 0 && from-compactChain[compactChain.length-1].to > maxClusterLenght)
					maxClusterLenght = from-compactChain[compactChain.length-1].to;

				compactChain.push({
					from: from,
					to: i-1
				});

			} else if(this.chain.heights[i].length > 1 && !collecting) {
				from = i;
				collecting = true;
			}
		}

		if(maxClusterLenght === 1)
			maxClusterLenght = this.chain.heights.length;

		if(collecting) {
			compactChain.push({
				from:from,
				to: this.chain.heights.length
			});

			if(from-compactChain[compactChain.length-1].to > maxClusterLenght)
				maxClusterLenght = from-compactChain[compactChain.length-1].to;
		}

		/*********************************************************************/

		let shortClusterLenght = Math.floor((maxClusterLenght/3)-1);
		let mediumClusterLength = Math.floor((2*maxClusterLenght/3)-1);

		let clusterLengthScale = function(length) {
			if(length < shortClusterLenght)
				return '#108193';
			if(length < mediumClusterLength)
				return '#0a515c';
			
			return '#042024';
		}

		d3.select('#legend-single').html('1');
		d3.select('#legend-short').html('2-'+(shortClusterLenght-1));
		d3.select('#legend-medium').html(shortClusterLenght+'-'+(mediumClusterLength-1));
		d3.select('#legend-long').html(mediumClusterLength+'-'+maxClusterLenght);

		let clusterFontSizeScale = d3.scaleLinear().domain([7,20]).range([26,10]);
		let fontSizeScale = d3.scaleLinear().domain([2,9]).range([24,9]);

		let g = svg.append('g').attr('id',height);

		if(compactChain.length > 0) {
			g.append('line')
				.attr('x1', height*this.dimensions)
				.attr('y1', height*this.dimensions)
				.attr('x2', (height+1)*this.dimensions)
				.attr('y2', height*this.dimensions)
				.attr('style', 'stroke:#000');

			if(this.chain.blocks[this.chain.heights[compactChain[0].from-1][0]].next2 != null) {
				let block = this.chain.blocks[this.chain.heights[compactChain[0].from-1][0]]

				g.append('path')
					.attr('d', 'M'+(height*this.dimensions)+','+block.render_height+' C'+((height+1)*this.dimensions)+','+block.render_height+' '+(height*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((height+1)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
					.attr('stroke','black')
					.attr('fill', 'transparent')
			}

			if((compactChain[0].from > 0 ? this.chain.blocks[this.chain.heights[compactChain[0].from-1][0]].id : this.chain.blocks[this.chain.heights[compactChain[0].from][0]].id) === 1) {
				g.append('circle')
					.attr('id', 'circle1')
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/5)
					.attr('color', '#17a2b8')
					.style('fill', '#17a2b8')
					.style('stroke', '#0a444d');
				g.append('text')
					.attr('x', height*this.dimensions)
					.attr('y', height*this.dimensions)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'middle')
					.attr('font-size', fontSizeScale(2))
					.attr('fill', 'white')
					.html('#1');
			} else {
				let blockText = '[#1-#'+(compactChain[0].from > 0 ? this.chain.blocks[this.chain.heights[compactChain[0].from-1][0]].id : this.chain.blocks[this.chain.heights[compactChain[0].from][0]].id)+']';
				let clusterId= 0;
				g.append('circle')
					.attr("id", "circle"+clusterId+"cluster")
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/2)
					.on('click', () => {this.showClusterBlockDetails(1, compactChain[0].from)})
					.on('mouseover', () => {event.srcElement.style.fill = '#94101d'})
					.on('mouseout', () => {event.srcElement.style.fill = clusterLengthScale(compactChain[0].from)})
					.attr('color', clusterLengthScale(compactChain[0].from))
					.style('fill', clusterLengthScale(compactChain[0].from))
					.style('stroke', '#0a444d');
				g.append('text')
					.attr('x', height*this.dimensions)
					.attr('y', height*this.dimensions)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'middle')
					.attr('font-size', clusterFontSizeScale(blockText.length))
					.attr('fill', 'white')
					.html(blockText);
			}

		} else {
			if(this.chain.heights.length === 1) {
				g.append('circle')
					.attr('id', 'circle'+block["id"])
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/5)
					.attr('color', '#042024')
					.style('fill', '#042024')
					.style('stroke', '#0a444d');
				g.append('text')
					.attr('x', height*this.dimensions)
					.attr('y', height*this.dimensions)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'middle')
					.attr('font-size', fontSizeScale(2))
					.attr('fill', 'white')
					.html('#1');
			} else {
				let blockText = '[#1-#'+(this.chain.heights.length)+']';
				let clusterId = 0;
					g.append('circle')
					.attr("id", "circle"+clusterId+"cluster")
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/2)
					.attr('color', '#042024')
					.style('fill', '#042024')
					.on('click', () => {this.showClusterBlockDetails(1, this.chain.heights.length)})
					.style('stroke', '#0a444d');
				g.append('text')
					.attr('x', height*this.dimensions)
					.attr('y', height*this.dimensions)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'middle')
					.attr('font-size', clusterFontSizeScale(blockText.length))
					.attr('fill', 'white')
					.html(blockText);
			}
		}

		height++;
		for(let i=0; i<compactChain.length; i++) {

			for(let j=compactChain[i].from; j<=compactChain[i].to; j++) {

				if(this.chain.heights[j] == undefined)
					return;

				g = svg.append('g').attr('id',height)
				// J -> blockchain height

				let distance_factor = (this.chain.heights[j+1] == undefined || this.chain.heights[j+1].length < 9 ? 1:(this.chain.heights[j+1].length/8));

				g.append('line')
					.attr('id', 'line'+j)
					.attr('x1', (height*this.dimensions))
					.attr('y1', -3*this.width)
					.attr('x2', (height*this.dimensions))
					.attr('y2', 3*this.width)
					.attr('style', 'stroke:#aaa; stroke-dasharray:5,5')
				g.append('text')
					.attr('x', (height*this.dimensions)+10)
					.attr('y', -1.5*this.dimensions)
					.html(j)
					.style('fill', '#aaa')

				this.chain.positions.push({
					height: j,
					position: height*this.dimensions
				});

				for(let k=0; k<this.chain.heights[j].length; k++) {
					let block = this['chain']['blocks'][this.chain.heights[j][k]];
					let blockText = '#'+block.id;

					if(block.next1 !== null) {
						if(this['chain']['blocks'][block['next1']]['render_height'] == block.render_height) {
							g.append('line')
								.attr('x1', height*this.dimensions)
								.attr('y1', block.render_height)
								.attr('x2', (height+distance_factor)*this.dimensions)
								.attr('y2', block.render_height)
								.attr('style', 'stroke:#000');
						} else { 

							let bezier_bending_factor = block.render_height === 0 ? 1 : Math.abs((this['chain']['blocks'][block['next1']]['render_height']-block.render_height)/this.dimensions);
							let cx = this.dimensions/bezier_bending_factor;

							g.append('path')
								.attr('d', 'M'+(height*this.dimensions)+','+block.render_height+' C'+((height*this.dimensions)+cx)+','+block.render_height+' '+(((height+distance_factor)*this.dimensions)-cx)+','+this['chain']['blocks'][block['next1']]['render_height']+' '+((height+distance_factor)*this.dimensions)+','+this['chain']['blocks'][block['next1']]['render_height'])
								.attr('stroke','black')
								.attr('fill', 'transparent');
						}
					}

					if(block.next2 !== null) {
						let bezier_bending_factor = block.render_height === 0 ? 1 : Math.abs((this['chain']['blocks'][block['next2']]['render_height']-block.render_height)/this.dimensions);
						let cx = this.dimensions/bezier_bending_factor;

						g.append('path')
							.attr('d', 'M'+(height*this.dimensions)+','+block.render_height+' C'+((height*this.dimensions)+cx)+','+block.render_height+' '+(((height+distance_factor)*this.dimensions)-cx)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((height+distance_factor)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
							.attr('stroke','black')
							.attr('fill', 'transparent')
					}

					g.append('circle')
						.attr("id",'circle'+block['id'])
						.attr('cx', height*this.dimensions)
						.attr('cy', block.render_height)
						.attr('r', this.dimensions/5)
						.attr('color', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('fill', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('stroke', '#0a444d')
						.on('click', () => { this.showBlockDetails(block); })
						.on('mouseover', () => {event.srcElement.style.fill = '#94101d'})
						.on('mouseout', () => {event.srcElement.style.fill = (block.render_height === 0 ? '#17a2b8' : '#5747d1')});

					g.append('text')
						.attr('x', height*this.dimensions)
						.attr('y', block.render_height)
						.attr('text-anchor', 'middle')
						.attr('alignment-baseline', 'middle')
						.attr('fill', 'white')
						.attr('font-size', fontSizeScale(blockText.length))
						.html(blockText)
				}

//--------------------------------------------------------------------------------------------------------------------------------------
				if (this.maxRenderX < height*this.dimensions)
					this.maxRenderX = height*this.dimensions;
//--------------------------------------------------------------------------------------------------------------------------------------

				height += distance_factor;
			}

			if(i != compactChain.length-1) {
				g.append('line')
					.attr('x1', height*this.dimensions)
					.attr('y1', 0)
					.attr('x2', (height+1)*this.dimensions)
					.attr('y2', 0)
					.attr('style', 'stroke:#000');

				if(this.chain.blocks[this.chain.heights[compactChain[i+1].from-1][0]].next2 != null) {
					let block = this.chain.blocks[this.chain.heights[compactChain[i+1].from-1][0]]

					g.append('path')
						.attr('d', 'M'+(height*this.dimensions)+','+block.render_height+' C'+((height+1)*this.dimensions)+','+block.render_height+' '+(height*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((height+1)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
						.attr('stroke','black')
						.attr('fill', 'transparent')
				}

				if(compactChain[i].to-compactChain.from === 1) {
					let blockText = '#'+(this.chain.blocks[this.chain.heights[compactChain[i].to+1][0]].id);

					g.append('circle')
						.attr('id', 'circle'+block["id"])
						.attr('cx', height*this.dimensions)
						.attr('cy', 0)
						.attr('r', this.dimensions/5)
						.attr('color', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('fill', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('stroke', '#0a444d')
						.style('stroke-width', block.render_height === 0 ? 1:3)
						.on('click', (event) => {console.log('->',event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "#94101d";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#17a2b8";})

					g.append('text')
						.attr('x', height*this.dimensions)
						.attr('y', 0)
						.attr('text-anchor', 'middle')
						.attr('alignment-baseline', 'middle')
						.attr('font-size', fontSizeScale(blockText.length))
						.attr('fill', 'white')
						.html(blockText)
				} else {
					let blockText = '[#'+(this.chain.blocks[this.chain.heights[compactChain[i].to+1][0]].id)+'-#'+(this.chain.blocks[this.chain.heights[compactChain[i+1].from-1][0]].id)+']';
					let clusterId = blockchain.chain.positions.length;
	
					g.append('circle')
						.attr("id", "circle"+clusterId+"cluster")
						.attr('cx', height*this.dimensions)
						.attr('cy', 0)
						.attr('r', this.dimensions/2)
						.on('click', () => {this.showClusterBlockDetails((this.chain.blocks[this.chain.heights[compactChain[i].to+1][0]].id), (this.chain.blocks[this.chain.heights[compactChain[i+1].from-1][0]].id))})
						.on('mouseover', () => {event.srcElement.style.fill = '#94101d'})
						.on('mouseout', () => {event.srcElement.style.fill = clusterLengthScale(compactChain[i+1].from-1 - compactChain[i].to+1)})
						.attr('color', clusterLengthScale(compactChain[i+1].from-1 - compactChain[i].to+1))
						.style('fill', clusterLengthScale(compactChain[i+1].from-1 - compactChain[i].to+1))
						.style('stroke', '#0a444d');
					g.append('text')
						.attr('x', height*this.dimensions)
						.attr('y', 0)
						.attr('text-anchor', 'middle')
						.attr('alignment-baseline', 'middle')
						.attr('font-size', clusterFontSizeScale(blockText.length))
						.attr('fill', 'white')
						.html(blockText);
				}
			} else {
				let blockText = '[#'+(this.chain.blocks[this.chain.heights[compactChain[i].to+1][0]].id)+'-#'+(this.chain.blocks[this.chain.heights[this.chain.heights.length-1][0]].id)+']';
				let clusterId = blockchain.chain.positions.length;
				
				g.append('circle')
					.attr("id", "circle"+clusterId+"cluster")
					.attr('cx', height*this.dimensions)
					.attr('cy', 0)
					.attr('r', this.dimensions/2)
					.on('click', () => {this.showClusterBlockDetails((this.chain.blocks[this.chain.heights[compactChain[i].to+1][0]].id), (this.chain.blocks[this.chain.heights[this.chain.heights.length-1][0]].id))})
					.on('mouseover', () => {event.srcElement.style.fill = '#94101d'})
					.on('mouseout', () => {event.srcElement.style.fill = clusterLengthScale(this.chain.heights.length-1 - compactChain[i].to+1)})
					.attr('color', clusterLengthScale(this.chain.heights.length-1 - compactChain[i].to+1))
					.style('fill', clusterLengthScale(this.chain.heights.length-1 - compactChain[i].to+1))
					.style('stroke', '#0a444d');
				g.append('text')
					.attr('x', height*this.dimensions)
					.attr('y', 0)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'middle')
					.attr('font-size', clusterFontSizeScale(blockText.length))
					.attr('fill', 'white')
					.html(blockText);

//--------------------------------------------------------------------------------------------------------------------------------------
				if (this.maxRenderX < height*this.dimensions)
					this.maxRenderX = height*this.dimensions;
//--------------------------------------------------------------------------------------------------------------------------------------

			}

			height ++;

		}

	}

}
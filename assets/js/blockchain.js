class Blockchain {

	constructor(width, dimensions = 120) {
		this.chain = {
			'heights':[],
			'blocks':{}
		};

		this.forks = [];
		this.dimensions = dimensions;
		this.offset = 0;
		this.renderized_from = this.renderized_to = undefined;
		this.clickedBlock = null;
		this.width = width;
	}

	clear() {
		this.chain = {
			'heights':[],
			'blocks':{}
		};

		this.forks = [];
	}

	forks() {
		return this.forks;
	}
	getClickedBlock(){
		return this.clickedBlock;
	}
	
	setClickedBlock(oBlock){
		this.clickedBlock = oBlock;
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

					let multiplier = block.render_height === 0 ? (forkFertility == probability == 1 ? (this.chain.heights[i].length % 2 ? -1:1) : Math.random() < 0.5 ? 1:-1) : (block.render_height > 0 ? 1:-1);
					this['chain']['blocks'][block.next2]['render_height'] = block.render_height + (multiplier*this.dimensions);	

					while(blockHeights.includes(this['chain']['blocks'][block.next2]['render_height'])) {
						this['chain']['blocks'][block.next2]['render_height'] += multiplier*this.dimensions;
					}

					blockHeights.push(this['chain']['blocks'][block.next2]['render_height'])
				}

			}
		}

		return this.chain;
	}

	selectedChain(e){

		
		var selector = e.target;
		var idSelected = selector.getAttribute("id");
		var colorSelected = selector.getAttribute("color");
		var xblock = selector.getAttribute("cx");


		var blockSelected = this.chain.blocks[idSelected];
		
		
		var numValori= 3


		var rect={
			x: xblock - 100,
			y: 400,
			/*
			width: 960- margin.left - margin.right,
			height: 500 - margin.top - margin.bottom
			*/
			width: 100*(numValori*2+1),
			height: 40*(numValori*2+1)
			
		};

		var margin = {
			top: rect.height/(numValori*2+1), 
			bottom: rect.height/(numValori*2+1), 
			right: rect.width*0.15, 
			left: rect.width*0.1,
		}
		var fontSize = 50;

		/*
		
		
		*/


		if(this.getClickedBlock()!== null){
			//console.log('Cancellando: ', this.getClickedBlock()["id"]);
			
			
			d3v7.select('#rect'+(this.getClickedBlock()["id"])).remove();

			d3v7.select('#rectTxt1'+(this.getClickedBlock()["id"])).remove();
			d3v7.select('#rectTxt2'+(this.getClickedBlock()["id"])).remove();
			d3v7.select('#rectTxt3'+(this.getClickedBlock()["id"])).remove();
			
		}
			this.setClickedBlock(blockSelected) ;
	
	
			g.append('rect')
				.attr('x', rect.x)
				.attr('y', rect.y)
				.attr('rx', 20)
				.attr('ry', 20)
				.attr('width', rect.width)
				.attr('height', rect.height)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.attr("id", 'rect'+blockSelected['id'])
				.style('fill', colorSelected);


				


				g.append('text')
					.attr('x', (+rect.x) + (+margin.left*2))
					.attr('y', (+rect.y) + (+margin.top*3))
					.attr('fill', 'white')
					.attr("id", 'rectTxt1'+blockSelected['id'])
					.style("font-size", fontSize)
					.text("Nodo "+ blockSelected['id']);

					//console.log('id: ', blockSelected['id']);

				if(!blockSelected["timestamp"]){
					blockSelected["timestamp"]= Math.floor(Math.random() * Math.pow(10,7));
				}
				g.append('text')
					.attr('x', (+rect.x) + (+margin.left*2))
					.attr('y', (+rect.y) + (+margin.top*5))
					.attr('fill', 'white')
					.attr("id", 'rectTxt2'+blockSelected['id'])
					.style("font-size", fontSize)
					.text("Timestamp: " + blockSelected["timestamp"]);

				g.append('text')
					.attr('x', (+rect.x) + (+margin.left*2))
					.attr('y', (+rect.y) + (+margin.top*7))
					.attr('fill', 'white')
					.attr("id", 'rectTxt3'+blockSelected['id'])
					.style("font-size", fontSize)
					.text("Valore: "+ Math.floor(blockSelected["value"])+ " $");
		
	}


	/***************************************************************************************************/

	compactRender(svg, clearBefore = true, height = 0) {
		this.compact = true;
		if(clearBefore)
			svg.html('');

		let compactChain = [];

		let from = 0;
		let collecting = false;

		for(let i=1; i<this.chain.heights.length; i++) {
			if(this.chain.heights[i].length == 1 && collecting && this.chain.heights[i+1] && this.chain.heights[i+1].length == 1) {
				collecting = false;

				compactChain.push({
					from: from,
					to: i-1
				});

			} else if(this.chain.heights[i].length > 1 && !collecting) {
				from = i;
				collecting = true;
			}
		}

		if(collecting) {
			compactChain.push({
				from:from,
				to: this.chain.heights.length
			});
		}

		/*********************************************************************/

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
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/5)
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
				g.append('circle')
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/2)
					.style('fill', '#17a2b8')
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
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/5)
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
				let blockText = '[#1-#'+(this.chain.heights.length)+']';
				g.append('circle')
					.attr('cx', height*this.dimensions)
					.attr('cy', height*this.dimensions)
					.attr('r', this.dimensions/2)
					.style('fill', '#17a2b8')
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
					.attr('x1', (height*this.dimensions))
					.attr('y1', -3*this.width)
					.attr('x2', (height*this.dimensions))
					.attr('y2', 3*this.width)
					.attr('style', 'stroke:#aaa; stroke-dasharray:5,5')
				g.append('text')
					.attr('x', (height*this.dimensions)+10)
					.attr('y', -1.5*this.dimensions)
					.html(j+1)
					.style('fill', '#aaa')

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
						.attr("id",block['id'])
						.attr('cx', height*this.dimensions)
						.attr('cy', block.render_height)
						.attr('r', this.dimensions/5)
						.style('fill', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('stroke', '#0a444d')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#17a2b8";})

					g.append('text')
						.attr('x', height*this.dimensions)
						.attr('y', block.render_height)
						.attr('text-anchor', 'middle')
						.attr('alignment-baseline', 'middle')
						.attr('fill', 'white')
						.attr('font-size', fontSizeScale(blockText.length))
						.html(blockText)
				}

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
						.attr('cx', height*this.dimensions)
						.attr('cy', 0)
						.attr('r', this.dimensions/5)
						.style('fill', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('stroke', '#0a444d')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
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

					g.append('circle')
						.attr('cx', height*this.dimensions)
						.attr('cy', 0)
						.attr('r', this.dimensions/2)
						.style('fill', '#17a2b8')
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

				g.append('circle')
					.attr('cx', height*this.dimensions)
					.attr('cy', 0)
					.attr('r', this.dimensions/2)
					.style('fill', '#17a2b8')
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

			height ++;

		}

	}

	render(svg, from = 0, to = 100, clearBefore = true) {
		this.compact = false;

		if(to > this.chain.heights.length)
			to = this.chain.heights.length;

		var g;

		if(clearBefore) {
			svg.html('');

			this.renderized_from = this.offset = from;
			this.renderized_to = to;

			for(let i=from; i<to; i++) {

				g = svg.append('g').attr('id','height-'+i);

				for(let j=0; j<this.chain.heights[i].length; j++) {
					let block = this['chain']['blocks'][this.chain.heights[i][j]];

					if(block.next1 !== null)
						g.append('line')
							.attr('x1', (i-from)*this.dimensions)
							.attr('y1', block.render_height)
							.attr('x2', (i-from+1)*this.dimensions)
							.attr('y2', block.render_height)
							.attr('style', 'stroke:#000')

					if(block.next2 !== null)
						g.append('path')
							.attr('d', 'M'+((i-from)*this.dimensions)+','+block.render_height+' C'+((i-from+1)*this.dimensions)+','+block.render_height+' '+((i-from)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((i-from+1)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
							.attr('stroke','black')
							.attr('fill', 'transparent')

					g.append('circle')
						.attr("id",block['id'])
						.attr('cx', (i-from)*this.dimensions)
						.attr('cy', block.render_height)
						.attr('r', this.dimensions/5)
						.style('fill', block.render_height === 0 ? '#17a2b8' : '#5747d1')
						.style('stroke', '#0a444d')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#17a2b8";})

					g.append('text')
						.attr('x', (i-from)*this.dimensions)
						.attr('y', block.render_height)
						.attr('text-anchor', 'middle')
						.html(block.id)

				}
			}

		} else {

			if(this.renderized_from > from)
				this.renderized_from = from;

			if(this.renderized_to < to)
				this.renderized_to = to;

			for(let i=from; i<to; i++) {

				g = svg.append('g').attr('id','height-'+i);

				for(let j=0; j<this.chain.heights[i].length; j++) {
					let block = this['chain']['blocks'][this.chain.heights[i][j]];

					if(block.next1 !== null)
						g.append('line')
							.attr('x1', (i-this.offset)*this.dimensions)
							.attr('y1', block.render_height)
							.attr('x2', (i-this.offset+1)*this.dimensions-(this.dimensions/5))
							.attr('y2', block.render_height)
							.attr('style', 'stroke:#000')

					if(block.next2 !== null)
						g.append('path')
							.attr('d', 'M'+((i-this.offset)*this.dimensions)+','+block.render_height+' C'+((i-this.offset+1)*this.dimensions)+','+block.render_height+' '+((i-this.offset)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((i-this.offset+1)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
							.attr('stroke','black')
							.attr('fill', 'transparent')

					g.append('circle')
						.attr("id",block['id'])
						.attr('cx', (i-this.offset)*this.dimensions)
						.attr('cy', block.render_height)
						.attr('r', this.dimensions/5)
						.attr('color', '#17a2b8')
						.style('fill', '#17a2b8')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#17a2b8";})

					g.append('text')
						.attr('x', (i-this.offset)*this.dimensions)
						.attr('y', block.render_height)
						.attr('text-anchor', 'middle')
						.html(block.id)

				}
			}

		}

	}

	removeFirst(toRemove) {
		for(let i=this.renderized_from; i<this.renderized_from+toRemove; i++)
			d3v7.select('#height-'+i).remove();

		this.renderized_from += toRemove;
	}

	removeLast(toRemove) {
		for(let i=this.renderized_to; i<this.renderized_to-toRemove; i--)
			d3v7.select('#height-'+i).remove();

		this.renderized_to -= toRemove;
	}

}
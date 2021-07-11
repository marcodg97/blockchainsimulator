class Blockchain {

	constructor() {
		this.chain = {
			'heights':[],
			'blocks':{}
		};

		this.forks = [];
		this.dimensions = 100;
		this.offset = 0;
		this.renderized_from = this.renderized_to = undefined;
		this.clickedBlock = null;
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

	compute(probability, blocksNumber, valueFactor = 20) {
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
		while(id<blocksNumber) {
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
					if (Math.floor(Math.random() * probability) === 0 && blocksNumber > id) {
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
					}
				}

			}

			h += 1;

		}

		for(let i=0; i<this.chain.heights.length; i++) {
			for(let j=0; j<this.chain.heights[i].length; j++) {

				let block = this['chain']['blocks'][this.chain.heights[i][j]];
				
				if(block.next1 !== null)
					this['chain']['blocks'][block.next1]['render_height'] = block.render_height;
				if(block.next2 !== null)
					this['chain']['blocks'][block.next2]['render_height'] = (this.chain.heights[i].length % 2 ? 1:-1)*this.dimensions;

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
			
			
			d3.select('#rect'+(this.getClickedBlock()["id"])).remove();

			d3.select('#rectTxt1'+(this.getClickedBlock()["id"])).remove();
			d3.select('#rectTxt2'+(this.getClickedBlock()["id"])).remove();
			d3.select('#rectTxt3'+(this.getClickedBlock()["id"])).remove();
			
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

				
				g.append('text')
					.attr('x', (+rect.x) + (+margin.left*2))
					.attr('y', (+rect.y) + (+margin.top*5))
					.attr('fill', 'white')
					.attr("id", 'rectTxt2'+blockSelected['id'])
					.style("font-size", fontSize)
					.text("Timestamp: " + Math.floor(Math.random() * 10^7));

				g.append('text')
					.attr('x', (+rect.x) + (+margin.left*2))
					.attr('y', (+rect.y) + (+margin.top*7))
					.attr('fill', 'white')
					.attr("id", 'rectTxt3'+blockSelected['id'])
					.style("font-size", fontSize)
					.text("Valore: "+ Math.floor(blockSelected["value"])+ "$");
		
	}


	/***************************************************************************************************/

	render(svg, from = 0, to = 100, clearBefore = true) {
		if(to > this.chain.heights.length)
			to = this.chain.heights.length;

		var g;

		if(clearBefore) {
			svg.html('');

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
						.attr('color', '#68b2a1')
						.style('fill', '#68b2a1')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#68b2a1";})

					g.append('text')
						.attr('x', (i-from)*this.dimensions)
						.attr('y', block.render_height)
						.html(block.id)

				}
			}

			this.renderized_from = this.offset = from;
			this.renderized_to = to;

		} else {

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
						.attr('color', '#68b2a1')
						.style('fill', '#68b2a1')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#68b2a1";})

					g.append('text')
						.attr('x', (i-this.offset)*this.dimensions)
						.attr('y', block.render_height)
						.html(block.id)

				}
			}

			if(this.renderized_from > from)
				this.renderized_from = from;

			if(this.renderized_to < to)
				this.renderized_to = to;

		}

	}

	removeFirst(toRemove) {
		for(let i=this.renderized_from; i<this.renderized_from+toRemove; i++)
			d3.select('#height-'+i).remove();

		this.renderized_from += toRemove;
	}

	removeLast(toRemove) {
		for(let i=this.renderized_to; i<this.renderized_to-toRemove; i--)
			d3.select('#height-'+i).remove();

		this.renderized_to -= toRemove;
	}

}
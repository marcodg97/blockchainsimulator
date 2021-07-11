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
						this.forks.push(h);
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

	/***************************************************************************************************/

	render(svg, from = 0, to = 100, clearBefore = true) {
		if(to > this.chain.heights.length)
			to = this.chain.heights.length;

		if(clearBefore) {
			svg.html('');

			this.offset = from;

			for(let i=from; i<to; i++) {
				for(let j=0; j<this.chain.heights[i].length; j++) {
					let block = this['chain']['blocks'][this.chain.heights[i][j]];

					if(block.next1 !== null)
						svg.append('line')
							.attr('x1', (i-from)*this.dimensions)
							.attr('y1', block.render_height)
							.attr('x2', (i-from+1)*this.dimensions)
							.attr('y2', block.render_height)
							.attr('style', 'stroke:#000')

					if(block.next2 !== null)
						svg.append('path')
							.attr('d', 'M'+((i-from)*this.dimensions)+','+block.render_height+' C'+((i-from+1)*this.dimensions)+','+block.render_height+' '+((i-from)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((i-from+1)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
							.attr('stroke','black')
							.attr('fill', 'transparent')

					svg.append('circle')
						.attr('cx', (i-from)*this.dimensions)
						.attr('cy', block.render_height)
						.attr('r', this.dimensions/5)
						.style('fill', '#68b2a1')
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#68b2a1";})

					svg.append('text')
						.attr('x', (i-from)*this.dimensions)
						.attr('y', block.render_height)
						.html(block.id)

				}
			}

			//this.offset = to-from;
			this.renderized_from = from;
			this.renderized_to = to;

		} else {

			for(let i=from; i<to; i++) {
				for(let j=0; j<this.chain.heights[i].length; j++) {
					let block = this['chain']['blocks'][this.chain.heights[i][j]];

					if(block.next1 !== null)
						svg.append('line')
							.attr('x1', (i-this.offset)*this.dimensions)
							.attr('y1', block.render_height)
							.attr('x2', (i-this.offset+1)*this.dimensions-(this.dimensions/5))
							.attr('y2', block.render_height)
							.attr('style', 'stroke:#000')

					if(block.next2 !== null)
						svg.append('path')
							.attr('d', 'M'+((i-this.offset)*this.dimensions)+','+block.render_height+' C'+((i-this.offset+1)*this.dimensions)+','+block.render_height+' '+((i-this.offset)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height']+' '+((i-this.offset+1)*this.dimensions)+','+this['chain']['blocks'][block['next2']]['render_height'])
							.attr('stroke','black')
							.attr('fill', 'transparent')

					svg.append('circle')
						.attr('cx', (i-this.offset)*this.dimensions)
						.attr('cy', block.render_height)
						.attr('r', this.dimensions/5)
						.style('fill', '#68b2a1')
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#68b2a1";})

					svg.append('text')
						.attr('x', (i-this.offset)*this.dimensions)
						.attr('y', block.render_height)
						.html(block.id)

				}

				//this.offset +=1;
			}

			this.renderized_to += to-from;

		}

	}

}
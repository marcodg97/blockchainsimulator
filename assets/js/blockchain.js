class Blockchain {

	constructor(svg) {
		this.svg = svg;

		this.chain = {
			'heights':[],
			'blocks':{}
		};

		this.forks = [];
	}

	clear() {
		this.chain = {
			'heights':[],
			'blocks':{}
		};

		this.forks = [];
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
							'valuue': value
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

		return this.chain;
	}

}
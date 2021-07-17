class Blockchain {

	constructor() {
		this.chain = {
			'heights':[],
			'blocks':{},
			'grafico':[]
		};

		this.forks = [];
		this.dimensions = 100;
		this.offset = 0;
		this.renderized_from = this.renderized_to = undefined;
		this.clickedBlock = null;
		this.minVal = 99999;
		this.maxVal = 0;
	}

	clear() {
		this.chain = {
			'heights':[],
			'blocks':{},
			'grafico':[]
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

		if (value > this.maxVal) this.maxVal = value;
		if (value < this.minVal) this.minVal = value;

		var temp = {id: id, value: value};
		this.chain.grafico.push(temp);

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
					value = value + Math.random()*1000 - 500;
					next1 = {
						'id': id,
						'height': h+1,
						'pred': block.id,
						'next1': null,
						'next2': null,
						'value': value
					}

					if (value > this.maxVal) this.maxVal = value;
					if (value < this.minVal) this.minVal = value;
					temp = {id: id, value: value};
					this.chain.grafico.push(temp);

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

				let blockHeights = [];
				let block = this['chain']['blocks'][this.chain.heights[i][j]];
				
				if(block.next1 !== null) {
					this['chain']['blocks'][block.next1]['render_height'] = block.render_height;
				} if(block.next2 !== null) {
					this['chain']['blocks'][block.next2]['render_height'] = (this.chain.heights[i].length % 2 ? 1:-1)*this.dimensions;

					blockHeights.push(this['chain']['blocks'][block.next2]['render_height'])

					//while(blockHeights.includes(this['chain']['blocks'][block.next2]['render_height']))
					//	this['chain']['blocks'][block.next2]['render_height'] += this['chain']['blocks'][block.next2]['render_height'] >= 0 ? this.dimensions: -1*this.dimensions;

					
				}

				console.log(blockHeights)

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

		/************************************************************************************/
		var width = document.body.clientWidth
		var dens = Math.floor(this.chain.heights.length/12)
		var w = width/12-1

	var div1 = d3.select("#anteprima").attr('width', 500);
	var svg1 = div1.append("svg:svg").attr('width', 500);
	svg1.attr('height', 100)
		.attr('transform', 'translate('+0+', '+10+')')

	this.seg1 = svg1.append('g')
		this.seg1.append('line')
			.style("stroke", "#400000")
			.style("stroke-width", 22)
       		.attr("x1", 0)
      		.attr("y1", 15)
      		.attr("x2", w)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(0,dens,"#400000")})

    this.seg1bis = svg1.append('g')
		this.seg1bis.append('line')
			.style("stroke", "#400000")
			.style("stroke-width", 22)
       		.attr("x1", 0)
      		.attr("y1", 15)
      		.attr("x2", w)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(0,dens,"#400000")})

    this.seg2 = svg1.append('g')
		this.seg2.append('line')
			.style("stroke", "#550000")
			.style("stroke-width", 22)
       		.attr("x1", w)
      		.attr("y1", 15)
      		.attr("x2", w*2)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens+1,dens*2,"#550000")})

    this.seg3 = svg1.append('g')
		this.seg3.append('line')
			.style("stroke", "#770000")
			.style("stroke-width", 22)
       		.attr("x1", w*2)
      		.attr("y1", 15)
      		.attr("x2", w*3)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*2+1,dens*3,"#770000")})

    this.seg4 = svg1.append('g')
		this.seg4.append('line')
			.style("stroke", "#990000")
			.style("stroke-width", 22)
       		.attr("x1", w*3)
      		.attr("y1", 15)
      		.attr("x2", w*4)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*3+1,dens*4,"#990000")})

    this.seg5 = svg1.append('g')
		this.seg5.append('line')
			.style("stroke", "#BB0000")
			.style("stroke-width", 22)
       		.attr("x1", w*4)
      		.attr("y1", 15)
      		.attr("x2", w*5)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*4+1,dens*5,"#BB0000")})

    this.seg6 = svg1.append('g')
		this.seg6.append('line')
			.style("stroke", "#DD4422")
			.style("stroke-width", 22)
       		.attr("x1", w*5)
      		.attr("y1", 15)
      		.attr("x2", w*6)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*5+1,dens*6,"#DD4422")})

    this.seg7 = svg1.append('g')
		this.seg7.append('line')
			.style("stroke", "#44DD22")
			.style("stroke-width", 22)
       		.attr("x1", w*6)
      		.attr("y1", 15)
      		.attr("x2", w*7)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*6+1,dens*7,"#44DD22")})

    this.seg8 = svg1.append('g')
		this.seg8.append('line')
			.style("stroke", "#00BB00")
			.style("stroke-width", 22)
       		.attr("x1", w*7)
      		.attr("y1", 15)
      		.attr("x2", w*8)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*7+1,dens*8,"#00BB00")})

    this.seg9 = svg1.append('g')
		this.seg9.append('line')
			.style("stroke", "#009900")
			.style("stroke-width", 22)
       		.attr("x1", w*8)
      		.attr("y1", 15)
      		.attr("x2", w*9)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*8+1,dens*9,"#009900")})

    this.seg10 = svg1.append('g')
		this.seg10.append('line')
			.style("stroke", "#007700")
			.style("stroke-width", 22)
       		.attr("x1", w*9)
      		.attr("y1", 15)
      		.attr("x2", w*10)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*9+1,dens*10,"#007700")})

    this.seg11 = svg1.append('g')
		this.seg11.append('line')
			.style("stroke", "#005500")
			.style("stroke-width", 22)
       		.attr("x1", w*10)
      		.attr("y1", 15)
      		.attr("x2", w*11)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*10+1,dens*11,"#005500")})

    this.seg12 = svg1.append('g')
		this.seg12.append('line')
			.style("stroke", "#004000")
			.style("stroke-width", 22)
       		.attr("x1", w*11)
      		.attr("y1", 15)
      		.attr("x2", w*12)
      		.attr("y2", 15)
      		//.on("mouseup", function() {segmento(dens*11+1,this.chain.heights.length,"#004000")})

    this.time1 = svg1.append('g')
		this.time1.append('line')
			.style("stroke-dasharray", ("3, 3"))
			.style("stroke", "black")
			.style("stroke-width", 2)
       		.attr("x1", 0)
      		.attr("y1", 50)
      		.attr("x2", w*12)
      		.attr("y2", 50);

    this.time2 = svg1.append('g')
		this.time2.append('line')
			.style("stroke-dasharray", ("3, 3"))
			.style("stroke", "black")
			.style("stroke-width", 2)
       		.attr("x1", 0)
      		.attr("y1", 2)
      		.attr("x2", w*12)
      		.attr("y2", 2);

    this.t1 = svg1.append('g')
    	this.t1.append('text')
    		.attr("x", 0)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.text("0");

    this.t2 = svg1.append('g')
    	this.t2.append('text')
    		.attr("x", w)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens);

    this.t3 = svg1.append('g')
    	this.t3.append('text')
    		.attr("x", w*2)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*2);

    this.t4 = svg1.append('g')
    	this.t4.append('text')
    		.attr("x", w*3)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*3);

    this.t5 = svg1.append('g')
    	this.t5.append('text')
    		.attr("x", w*4)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*4);

    this.t6 = svg1.append('g')
    	this.t6.append('text')
    		.attr("x", w*5)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*5);

    this.t7 = svg1.append('g')
    	this.t7.append('text')
    		.attr("x", w*6)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*6);

    this.t8 = svg1.append('g')
    	this.t8.append('text')
    		.attr("x", w*7)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*7);

    this.t9 = svg1.append('g')
    	this.t9.append('text')
    		.attr("x", w*8)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*8);

    this.t10 = svg1.append('g')
    	this.t10.append('text')
    		.attr("x", w*9)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*9);

    this.t11 = svg1.append('g')
    	this.t11.append('text')
    		.attr("x", w*10)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*10);

    this.t12 = svg1.append('g')
    	this.t12.append('text')
    		.attr("x", w*11)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*11);

    this.t13 = svg1.append('g')
    	this.t13.append('text')
    		.attr("x", w*12)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "end")
    		.text(this.chain.heights.length);


    var svg2 = d3.select("#grafico").append("svg:svg");
    svg2.attr('width', width-5)
		.attr('height', 600)
		.attr('transform', 'translate('+0+', '+10+')')
		

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
	    width1 = (width/2-10) - margin.left - margin.right,
	    height1 = (width/4) - margin.top - margin.bottom;
	
	var x = d3.scaleLinear()
      .domain([0,this.dimensions-1])
      .range([ 0, width1 ]);
  
    svg2.append("g")
      .attr("transform", "translate("+width/2+"," + (height1+250) + ")")
      .call(d3.axisBottom(x));

    var min = 0
    if (this.minVal<0) {min = this.minVal}
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([min, this.maxVal])
      .range([ height1, 0 ]);
    svg2.append("g")
      .attr("transform", "translate("+width/2+"," + 250 + ")")
      .call(d3.axisLeft(y));
    

    svg2.append("path")
      .datum(this.chain.grafico)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.id)+width/2 })
        .y(function(d) { return y(d.value)+250 })
        )


		/**************************************************************************************/
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
						.attr('color', '#68b2a1')
						.style('fill', '#68b2a1')
						.on('click', (event) => {this.selectedChain(event);})
						.on('mouseover', (event) => {event.srcElement.style.fill = "red";})
						.on('mouseout', (event) => {event.srcElement.style.fill = "#68b2a1";})

					g.append('text')
						.attr('x', (i-from)*this.dimensions)
						.attr('y', block.render_height)
    					.style("text-anchor", "middle")
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
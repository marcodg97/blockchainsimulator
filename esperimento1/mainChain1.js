const width = (document.body.clientWidth);
const height = (document.body.clientHeight);

var densità
var altezza = 0
var identificatore = 0
blocks = []
blocco = {}
var t = 0

function compute(probability, number){
	var tot = 20.0 * number

	//var identificatore = 1
	//var altezza = 0

	var radice = {id: identificatore ,altezza: altezza, padre: null, figlio1: null,valore: tot}
	blocco[altezza] = []
	blocco[altezza].push(radice['id'])

	identificatore = identificatore + 1
	blocks.push(radice)
	while (identificatore < number){
		flag = false
		blocco[altezza+1] = []
		for (let i=0;i<blocco[altezza].length;i++){
			b = blocks[blocco[altezza][i]]
			son1 = null
			son2 = null
			totT = b.valore
			if (flag == false){
				tot = tot + Math.random()*1000 -450
				son1 = {id: identificatore,altezza: altezza+1,padre: b['id'], figlio1: null,figlio2: null,valore: tot}
				identificatore = identificatore+1
				blocks.push(son1)
				blocco[altezza+1].push(son1['id'])
				flag = true
				rand = Math.floor(Math.random() * probability)
				if (rand == 0 && number > identificatore +1){
					son2 = {id:identificatore,altezza: altezza+1,padre:b['id'],figlio1:null,figlio2:null,valore:totT + Math.random()*1000 -490}
					identificatore = identificatore+1
					blocks.push(son2)
					blocco[altezza+1].push(son2[`id`])
				}
			}
			else {
				rand = Math.floor(Math.random() * (probability+Math.floor(altezza/2)))
				if (rand == 0 && number > identificatore){
					son1 = {id:identificatore,altezza:altezza+1,padre:b['id'],figlio1:null,figlio2:null,valore:totT + Math.random()*1000 -490}
					identificatore = identificatore+1
					blocks.push(son1)
					blocco[altezza+1].push(son1['id'])
					//console.log(b['id']+" - "+son1['id'])
				}
			}
			if (son1 == null) {}
			else { 
				if (son2 == null) {
				b['figlio1']=son1['id']
				b['figlio2']=null
				}
				else
					if (son1 != null && son2 != null){
					b['figlio1']=son1['id']
					b['figlio2']=son2['id']
				}
			}
		}
		altezza = altezza + 1
	}
	t=tot
}

function drawLine(dens) {
	w = width/12-1
	this.svg = d3.select('body')
			.append('svg')
			.attr('width', width-5)
			.attr('height', 1000)
			.attr('transform', 'translate('+0+', '+10+')')

	this.seg1 = this.svg.append('g')
		this.seg1.append('line')
			.style("stroke", "#400000")
			.style("stroke-width", 22)
       		.attr("x1", 0)
      		.attr("y1", 15)
      		.attr("x2", w)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(0,dens,"#400000")})

    this.seg2 = this.svg.append('g')
		this.seg2.append('line')
			.style("stroke", "#550000")
			.style("stroke-width", 22)
       		.attr("x1", w)
      		.attr("y1", 15)
      		.attr("x2", w*2)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens+1,dens*2,"#550000")})

    this.seg3 = this.svg.append('g')
		this.seg3.append('line')
			.style("stroke", "#770000")
			.style("stroke-width", 22)
       		.attr("x1", w*2)
      		.attr("y1", 15)
      		.attr("x2", w*3)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*2+1,dens*3,"#770000")})

    this.seg4 = this.svg.append('g')
		this.seg4.append('line')
			.style("stroke", "#990000")
			.style("stroke-width", 22)
       		.attr("x1", w*3)
      		.attr("y1", 15)
      		.attr("x2", w*4)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*3+1,dens*4,"#990000")})

    this.seg5 = this.svg.append('g')
		this.seg5.append('line')
			.style("stroke", "#BB0000")
			.style("stroke-width", 22)
       		.attr("x1", w*4)
      		.attr("y1", 15)
      		.attr("x2", w*5)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*4+1,dens*5,"#BB0000")})

    this.seg6 = this.svg.append('g')
		this.seg6.append('line')
			.style("stroke", "#DD4422")
			.style("stroke-width", 22)
       		.attr("x1", w*5)
      		.attr("y1", 15)
      		.attr("x2", w*6)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*5+1,dens*6,"#DD4422")})

    this.seg7 = this.svg.append('g')
		this.seg7.append('line')
			.style("stroke", "#44DD22")
			.style("stroke-width", 22)
       		.attr("x1", w*6)
      		.attr("y1", 15)
      		.attr("x2", w*7)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*6+1,dens*7,"#44DD22")})

    this.seg8 = this.svg.append('g')
		this.seg8.append('line')
			.style("stroke", "#00BB00")
			.style("stroke-width", 22)
       		.attr("x1", w*7)
      		.attr("y1", 15)
      		.attr("x2", w*8)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*7+1,dens*8,"#00BB00")})

    this.seg9 = this.svg.append('g')
		this.seg9.append('line')
			.style("stroke", "#009900")
			.style("stroke-width", 22)
       		.attr("x1", w*8)
      		.attr("y1", 15)
      		.attr("x2", w*9)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*8+1,dens*9,"#009900")})

    this.seg10 = this.svg.append('g')
		this.seg10.append('line')
			.style("stroke", "#007700")
			.style("stroke-width", 22)
       		.attr("x1", w*9)
      		.attr("y1", 15)
      		.attr("x2", w*10)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*9+1,dens*10,"#007700")})

    this.seg11 = this.svg.append('g')
		this.seg11.append('line')
			.style("stroke", "#005500")
			.style("stroke-width", 22)
       		.attr("x1", w*10)
      		.attr("y1", 15)
      		.attr("x2", w*11)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*10+1,dens*11,"#005500")})

    this.seg12 = this.svg.append('g')
		this.seg12.append('line')
			.style("stroke", "#004000")
			.style("stroke-width", 22)
       		.attr("x1", w*11)
      		.attr("y1", 15)
      		.attr("x2", w*12)
      		.attr("y2", 15)
      		.on("mouseup", function() {segmento(dens*11+1,altezza,"#004000")})

    this.time1 = svg.append('g')
		this.time1.append('line')
			.style("stroke-dasharray", ("3, 3"))
			.style("stroke", "black")
			.style("stroke-width", 2)
       		.attr("x1", 0)
      		.attr("y1", 50)
      		.attr("x2", w*12)
      		.attr("y2", 50);

    this.time2 = svg.append('g')
		this.time2.append('line')
			.style("stroke-dasharray", ("3, 3"))
			.style("stroke", "black")
			.style("stroke-width", 2)
       		.attr("x1", 0)
      		.attr("y1", 2)
      		.attr("x2", w*12)
      		.attr("y2", 2);

    this.t1 = svg.append('g')
    	this.t1.append('text')
    		.attr("x", 0)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.text("0");

    this.t2 = svg.append('g')
    	this.t2.append('text')
    		.attr("x", w)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens);

    this.t3 = svg.append('g')
    	this.t3.append('text')
    		.attr("x", w*2)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*2);

    this.t4 = svg.append('g')
    	this.t4.append('text')
    		.attr("x", w*3)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*3);

    this.t5 = svg.append('g')
    	this.t5.append('text')
    		.attr("x", w*4)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*4);

    this.t6 = svg.append('g')
    	this.t6.append('text')
    		.attr("x", w*5)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*5);

    this.t7 = svg.append('g')
    	this.t7.append('text')
    		.attr("x", w*6)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*6);

    this.t8 = svg.append('g')
    	this.t8.append('text')
    		.attr("x", w*7)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*7);

    this.t9 = svg.append('g')
    	this.t9.append('text')
    		.attr("x", w*8)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*8);

    this.t10 = svg.append('g')
    	this.t10.append('text')
    		.attr("x", w*9)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*9);

    this.t11 = svg.append('g')
    	this.t11.append('text')
    		.attr("x", w*10)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*10);

    this.t12 = svg.append('g')
    	this.t12.append('text')
    		.attr("x", w*11)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "middle")
    		.text(dens*11);

    this.t13 = svg.append('g')
    	this.t13.append('text')
    		.attr("x", w*12)
    		.attr("y", 45)
    		.style("font-size","12px")
    		.style("text-anchor", "end")
    		.text(altezza);


	/*var svg = d3.select("#divCategoric").append("svg").attr("width", 1000).attr("height",400)
	var data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
	var myColor = d3.scaleOrdinal().domain(data)
  	.range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"])
	svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 50).attr("r", 19).attr("fill", function(d){return myColor(d) })
	*/
}
/*
	seg1Listener(func){
		this.seg1.on('mouseup', func)
	}

	seg2Listener(func){
		this.seg2.on('mouseup', func)
	}

	seg3Listener(func){
		this.seg3.on('mouseup', func)
	}

	seg4Listener(func){
		this.seg4.on('mouseup', func)
	}

	seg5Listener(func){
		this.seg5.on('mouseup', func)
	}

	seg6Listener(func){
		this.seg6.on('mouseup', func)
	}

	seg7Listener(func){
		this.seg7.on('mouseup', func)
	}

	seg8Listener(func){
		this.seg8.on('mouseup', func)
	}

	seg9Listener(func){
		this.seg9.on('mouseup', func)
	}

	seg10Listener(func){
		this.seg10.on('mouseup', func)
	}

	seg11Listener(func){
		this.seg11.on('mouseup', func)
	}

	seg12Listener(func){
		this.seg12.on('mouseup', func)
	}
*/


function segmento(inizio,fine,colore) {
	this.b1 = this.svg.append('g')
		this.b1.append('circle')
			.attr("cx", 50)
			.attr("cy", 150)
			.attr("r", 40)
			.attr("fill", colore)
	this.tx = this.svg.append('g')
		this.tx.append("text")
			.attr("x", 50)
    		.attr("y", 150)
    		.style("font-size","20px")
    		.style("text-anchor", "middle")
    		.style("fill", "white")
    		.text(inizio)
    this.tx2 = this.svg.append('g')
		this.tx2.append("text")
			.attr("x", 150)
    		.attr("y", 170)
    		.style("font-size","40px")
    		.style("fill", "black")
    		.text("etc etc")
}

compute(10,1200)
drawLine(Math.floor(altezza/12)+1)


d3.select('line')
	.on('click', function() {
		segmento();
	});


/*
for (let i=0;blocco[i];i++) {
	for (let j=0;j<blocco[i].length;j++)
	console.log(i+' -- '+j+": "+blocco[i][j]+" padre:"+blocks[blocco[i][j]]['padre']+" f1:"+blocks[blocco[i][j]]['figlio1']+" f2:"+blocks[blocco[i][j]]['figlio2'])
}
console.log(identificatore,"blocchi  -  valore:",t,"$   -   altezza:",altezza)
*/
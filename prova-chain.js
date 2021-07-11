

prob = 1
number = 30
blocks = []
blocco = {}
var tot = 20.0 * number

var identificatore = 1
var altezza = 0

var radice = {id: identificatore ,altezza: altezza, padre: null, figlio1: null,valore: tot}
blocco[altezza] = [radice]

identificatore = identificatore + 1
blocks.push(radice)
while (identificatore < number+1){
	flag = false
	blocco[altezza+1] = []
	for (let i=0;blocco[altezza][i];i++){
		b = blocco[altezza][i]
		son1 = null
		son2 = null
		totT = b.valore
		if (flag == false){
			tot = tot + Math.random()*1000 -450
			son1 = {id: identificatore,altezza: altezza+1,padre: b['id'], figlio1: null,figlio2: null,valore: tot}
			identificatore = identificatore+1
			blocks.push(son1)
			blocco[altezza+1].push(son1)
			flag = true
			rand = Math.floor(Math.random() * prob)
			if (rand == 0 && number > identificatore){
				son2 = {id:identificatore,altezza: altezza+1,padre:b['id'],figlio1:null,figlio2:null,valore:totT + Math.random()*1000 -490}
				identificatore = identificatore+1
				blocks.push(son2)
				blocco[altezza+1].push(son2)
			}
		}
		else {
			rand = Math.floor(Math.random() * (prob+Math.floor(altezza/2)))
			if (rand == 0 && number > identificatore){
				son1 = {id:identificatore,altezza:altezza+1,padre:b['id'],figlio1:null,figlio2:null,valore:totT + Math.random()*1000 -490}
				identificatore = identificatore+1
				blocks.push(son1)
				blocco[altezza+1].push(son1)
				console.log(b['id']+" - "+son1['id'])
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


for (let i=0;blocco[i];i++) {
	for (let j=0;blocco[i][j];j++)
		console.log(i+' -- '+j+": "+blocco[i][j]['id']+" padre:"+blocco[i][j]['padre']+" f1:"+blocco[i][j]['figlio1']+" f2:"+blocco[i][j]['figlio2'])
}
console.log(identificatore-1,"blocchi  -  valore:",tot,"$")
	
	

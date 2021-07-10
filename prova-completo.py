
import random
import math

prob = 0
number = 300
blocks = []
blocco = {}
tot = 20.0 * number

class Block:
	def __init__(self, idb, altezza, idFather = None, idSon1 = None, idSon2 = None, valore = 0):
		self.idb = idb
		self.altezza = altezza
		self.idFather = idFather
		self.idSon1 = idSon1
		self.idSon2 = idSon2
		self.valore = valore

	def set(self,s1 = None,s2 = None):
		self.idSon1 = s1
		self.idSon2 = s2

	def printB(self):
		if (self.idSon1 == None):
			print("blocco:", self.idb, "  altezza:", self.altezza, "  valore:", self.valore, "$ ","  padre:", self.idFather)
		elif (self.idSon2 == None):
			print("blocco:", self.idb, "  altezza:", self.altezza, "  valore:", self.valore, "$ ", "  figlio1:", self.idSon1,"  padre:", self.idFather)
		else:
			print("blocco:", self.idb, "  altezza:", self.altezza, "  valore:", self.valore, "$ ", "  figlio1:" , self.idSon1, "  figlio2:", self.idSon2,"  padre:", self.idFather)


identificatore = 1
altezza = 0

radice = Block(identificatore,altezza,None,None,tot)
blocco[altezza] = []
blocco[altezza].append(radice)
identificatore = identificatore + 1
blocks.append(radice)
while (identificatore < number+1):
	flag = False
	blocco[altezza+1] = []
	for b in blocco[altezza]:
		son1 = None
		son2 = None
		totT = b.valore
		if not flag:
			tot = tot + random.uniform(-500.0,510.0)
			son1 = Block(identificatore,altezza+1,b.idb,None,None,tot)
			identificatore = identificatore+1
			blocks.append(son1)
			blocco[altezza+1].append(son1)
			flag = True
			rand = random.randint(0,prob)
			if (rand == 0 and number > identificatore):
				son2 = Block(identificatore,altezza+1,b.idb,None,None,totT + random.uniform(-500.0,510.0))
				identificatore = identificatore+1
				blocks.append(son2)
				blocco[altezza+1].append(son2)
		else:
			rand = random.randint(0,prob)
			rand2 = random.randint(0,int(math.sqrt(prob)))
			if (rand == 0 and rand2 != 0 and number > identificatore):
				son1 = Block(identificatore,altezza+1,b.idb,None,None,totT + random.uniform(-500.0,510.0))
				identificatore = identificatore+1
				blocks.append(son1)
				blocco[altezza+1].append(son1)
			if (rand == 0 and rand2 == 0 and number > identificatore+1):
				#print("----------------",b.idb,"--------------------")
				son1 = Block(identificatore,altezza+1,b.idb,None,None,totT + random.uniform(-500.0,510.0))
				identificatore = identificatore+1
				blocks.append(son1)
				blocco[altezza+1].append(son1)
				son2 = Block(identificatore,altezza+1,b.idb,None,None,totT + random.uniform(-500.0,510.0))
				identificatore = identificatore+1
				blocks.append(son2)
				blocco[altezza+1].append(son2)
		if son1 == None: {}
		elif son2 == None:
			b.set(son1.idb,None)
		else:
			b.set(son1.idb,son2.idb)
	altezza = altezza + 1


for b in blocks:
	b.printB()
print(len(blocks),"blocchi  -  valore:",tot,"$")
	
	

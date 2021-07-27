# Blockchain Simulator
Progetto per il corso di visualizzazione delle informazioni 2020/2021:




L'interfaccia ha come finalità l'intento di simulare il comportamento di una (o più) blockchain e mostrarla a video.
Obbiettivo della simulazione è che al variare di alcuni fattori sia possibile riprodurre una concatenzazione che si avvicini alla struttura di una crypto-valuta costruita in blockchain.

Le tre variabili fondamentali permettono all'applicativo di generare una concatenazione sempre nuova in base 

1) al numero di nodi,
2) ad una probabilità che nascano ramificazioni ossia che un nodo abbia due figli invece di averne uno solo,
3) ad una probabilità che, in presenza di più rami, interrompa il più corto.

Durante la navigazione è possibile:
- gestire lo zoom in maniera autonoma
- selezionare un singolo nodo o un gruppo di nodi per averne il dettaglio
- in qualunque momento trovare uno specifico nodo attraverso l'inserimento manuale del suo identificativo
- spostarsi tra le altezze identificandole attraverso l'inserimento manuale del loro valore
- vedere l'andamento del valore della "difficulty" all'aumentare dei nodi 
- avere una visione d'insieme della frequenza di biforcazione dell'albero


È stato inoltre di nostro interesse trovare una soluzione più compatta e manegevole per l'utente nel visualizzare l'intero albero generato che altrimenti avrebbe avuto una visione ripetitiva e di scarso interesse. 
![alt text](/images/graph.png)
Qualora ci fossero due o più nodi in sequenza ma senza biforcazioni, questi vengono raggruppati in un gruppo di nodi. 
Ciò permette più facilmente d'identificare nodi orfani ed avere una visione complessiva di tutto l'albero senza però doverlo scorrerlo nodo per nodo.

![alt text](/images/mappatura.png)
Per distinguere le diverse densità dei cluster generati si è scelto di identificarli con una mappatura dei colori scalabile a seconda del numero dei nodi contenuti.



Tra gli elementi aggiuntivi vi è una pre-view semplice al momento dell'apertura della pagina che identifica gli elementi fondamentali da sapere per la lettura del grafo e delle piccole descrizioni sulle variabili di probabilità selezionando il pulsante "more information".


## Autori
Marco De Giovanni 
Alice Di Carlo
Andrea Giaccone
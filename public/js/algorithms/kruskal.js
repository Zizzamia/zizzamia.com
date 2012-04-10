/* 
 *  kruskal.js
 *  ~~~~~~
 *  Kruskal
 *
 *  :copyright: (c) 2012 by Leonardo Zizzamia
 *  :license: BSD (See LICENSE for details)  */
var d = document;
engine.coordsX = [60,140,300,460,540,460,300,140,220]
engine.coordsY = [140,60,60,60,140,220,220,220,140]
	   
var order             // qui rimane salvato l'array ordinato
var A = []  // albero di copertura minimo
var dif, posX, posY, color

var indice = 0
var k = 0
var edge = [];


function engine_time() {
	if (engine.timeOn) {
		kruskal();
		engine.timePause = setTimeout('engine_time()', 3000);
	}
}


function init_graph() {	
    var node = []
	/* L'array node serve a conservare per ogni vertice
	 * il riferimento al padre e il rank, rispettivamente
	 * node[?][1] e node[?][2]                         */
	node[0] = ['a', 0, 0];
	node[1] = ['b', 0, 0];
	node[2] = ['c', 0, 0];
	node[3] = ['d', 0, 0];
	node[4] = ['e', 0, 0];
	node[5] = ['f', 0, 0];
	node[6] = ['g', 0, 0];
	node[7] = ['h', 0, 0];
	node[8] = ['i', 0, 0];
	          
	edge[0] = ['a', 'b', 4];
	edge[1] = ['a', 'h', 8];
	edge[2] = ['b', 'c', 8];
	edge[3] = ['b', 'h', 11];
	edge[4] = ['c', 'd', 7];
	edge[5] = ['c', 'f', 4];
	edge[6] = ['c', 'i', 2];
	edge[7] = ['d', 'e', 9];
	edge[8] = ['d', 'f', 14];
	edge[9] = ['e', 'f', 10];
	edge[10] = ['f', 'g', 2];
	edge[11] = ['g', 'h', 1];
	edge[12] = ['g', 'i', 6];
	edge[13] = ['h', 'i', 7];
	
	return node;
}

var node = init_graph();

function update(container) {
	indice = 0 
	engine.timeOn = 0
	val.childNodes[0].nodeValue = 'Play'
	clearTimeout(engine.timePause)
	A = new Array(0) 
	k = 0
	engine.start = 0
	node = new Array(0)
	edge = new Array(0)
	node = init_graph();
	var input = d.getElementById(container).getElementsByTagName('input');
	for (var i = 0, co = input.length; i < co; i++) {
		edge[i][2] = input[i].value
	}
	drawGraph()
}

function clean() {
	indice = 0
	engine.timeOn = 0
	val.childNodes[0].nodeValue = 'Play'
	clearTimeout(engine.timePause)
	A = [];
	k = 0;
	engine.start = 0
	node = init_graph();
	edge = [];
	drawGraph();
}




/* Start Set Kruskal Algorithms ---------------------------------------------------------*/
function findSet (x) {
	i = typeof x != 'number' ? engine.node_one (node, x) : x //piccola porcata
	if (i != node[i][1]) {
	    node[i][1] = findSet (node[i][1])
	}
	return node[i][1]
}

function graphLink(x, y) {
    //node[?][2] è il rank[?]
	if (node[x][2] > node[y][2]) {
	    node[y][1] = x
	} else {
	    node[x][1] = y
	}
	if (node[x][2] == node[y][2]) {
	    node[y][2] = node[y][2] + 1
	}
}

function union(x, y){
	graphLink(findSet(x), findSet(y));
}

function kruskal () {
	if (engine.start == 0) {
		for (var i = 0, node_length = node.length; i < node_length; i++) {
			//MAKE-SET, padre e rank
			node[i][1] = i;
			node[i][2] = 1;
		}
		/* ordino gli archi del grafo in senso crescente rispetto al peso */
		order = edge.sort((function(a,b){return a[2] - b[2]}))
	}
	
	if (findSet(edge[indice][0]) != findSet(edge[indice][1])) {
		A[k] = new Array(edge[indice][0], edge[indice][1], edge[indice][2])
		k += 1;
		union(edge[indice][0], edge[indice][1]);
	}
		
	drawGraph();
	if (indice < order.length - 1) {
		indice +=1;
		engine.start = engine.start + 1;
	}
}
/* End Set Kruskal Algorithms -----------------------------------------------------------*/


function drawGraph() {
	var canvas = d.getElementById('canv');
	if (canvas.getContext){  // Make sure we don't execute when canvas isn't supported
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,600,350); // clear canvas x y
		/* Coloro di grigio tutti gli archi */
		for (var i = 0, edge_length; i < edge_length; i++) {
			var a = engine.node_one(node, edge[i][0]); // recupero il numero dell'indice analizzato
			var b = engine.node_one(node, edge[i][1]);
			text  = edge[i][2];
			draw.line (ctx, a, b, '5', '#ddd', text);
		}
		/* Coloro di grigio tutti gli archi */
		for (i = 0; i < A.length; i++) {
			var a = engine.node_one(node, A[i][0]); // recupero il numero dell'indice analizzato
			var b = engine.node_one(node, A[i][1]); 
			text  = A[i][2];
			draw.line (ctx, a, b, '6', '#7FB24C', text);
		}
		/*  disegno i nodi */
		for (var indice = 0; indice < node.length; indice++) {
			draw.node(ctx, '', 20, '');
		}		
	} else {
        alert('You need Safari or Firefox 1.5+ to see this demo.');
    }
}
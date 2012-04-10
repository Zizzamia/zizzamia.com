engine.coordsX = new Array(60,140,300,460,540,460,300,140,220)
engine.coordsY = new Array(140,60,60,60,140,220,220,220,140)
	   
var order             // qui rimane salvato l'array ordinato
var A = new Array(0)  // albero di copertura minimo
var dif, posX, posY, color

var indice = 0
var k = 0

var node = new Array(0)
var edge = new Array(0)

setGraph()
/*  -----------------  */

function engineTime () {
	if (engine.timeOn) {
		kruskal()
		engine.timePause = setTimeout('engineTime()', 3000)
	}
}


function setGraph() {	
	/* L'array node serve a conservare per ogni vertice
	 * il riferimento al padre e il rank, rispettivamente
	 * node[?][1] e node[?][2]                         */
	node[0] = new Array('a', 0, 0)
	node[1] = new Array('b', 0, 0)
	node[2] = new Array('c', 0, 0)
	node[3] = new Array('d', 0, 0)
	node[4] = new Array('e', 0, 0)
	node[5] = new Array('f', 0, 0)
	node[6] = new Array('g', 0, 0)
	node[7] = new Array('h', 0, 0)
	node[8] = new Array('i', 0, 0)
	
	edge[0] = new Array('a', 'b', 4) 
	edge[1] = new Array('a', 'h', 8)
	edge[2] = new Array('b', 'c', 8)
	edge[3] = new Array('b', 'h', 11)
	edge[4] = new Array('c', 'd', 7)
	edge[5] = new Array('c', 'f', 4)
	edge[6] = new Array('c', 'i', 2)
	edge[7] = new Array('d', 'e', 9)
	edge[8] = new Array('d', 'f', 14)
	edge[9] = new Array('e', 'f', 10)
	edge[10] = new Array('f', 'g', 2)
	edge[11] = new Array('g', 'h', 1)
	edge[12] = new Array('g', 'i', 6)
	edge[13] = new Array('h', 'i', 7)
}

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
	setGraph()
	var input = document.getElementById(container).getElementsByTagName('input');
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
	A = new Array(0)
	k = 0
	engine.start = 0
	node = new Array(0)
	edge = new Array(0)
	setGraph()
	drawGraph()
}




/* Start Set Kruskal Algorithms ---------------------------------------------------------*/
function findSet (x) {
	i = typeof x != 'number' ? nodeNumberOne (node, x) : x //piccola porcata
	if (i != node[i][1])
		node[i][1] = findSet (node[i][1])
	return node[i][1]
}

function graphLink(x, y) {
	if (node[x][2] > node[y][2])      //node[?][2] è il rank[?]
		node[y][1] = x
	else node[x][1] = y
	if (node[x][2] == node[y][2])
		node[y][2] = node[y][2] + 1
}

function union(x, y){
	graphLink(findSet(x), findSet(y))
}

function kruskal () {
	if (engine.start == 0) {
		for (var i = 0; i < node.length; i++) {
			//MAKE-SET, padre e rank
			node[i][1] = i
			node[i][2] = 1
		}
		/* ordino gli archi del grafo in senso crescente rispetto al peso */
		order = edge.sort((function(a,b){return a[2] - b[2]}))
	}
	
	if (findSet(edge[indice][0]) != findSet(edge[indice][1])) {
		A[k] = new Array(edge[indice][0], edge[indice][1], edge[indice][2])
		k++
		union(edge[indice][0], edge[indice][1])
	}
		
	drawGraph()
	if (indice < order.length - 1) {
		indice++
		engine.start = engine.start + 1
	}
}
/* End Set Kruskal Algorithms -----------------------------------------------------------*/


function drawGraph() {
	var canvas = document.getElementById('canv');
	if (canvas.getContext){  // Make sure we don't execute when canvas isn't supported
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,600,350); // clear canvas x y
		/* Coloro di grigio tutti gli archi */
		for (i = 0; i < edge.length; i++) {
			var a = nodeNumberOne(node, edge[i][0]) // recupero il numero dell'indice analizzato
			var b = nodeNumberOne(node, edge[i][1]) 
			text  = edge[i][2]
			drawLine (ctx, a, b, '5', '#ddd', text)
		}
		/* Coloro di grigio tutti gli archi */
		for (i = 0; i < A.length; i++) {
			var a = nodeNumberOne(node, A[i][0]) // recupero il numero dell'indice analizzato
			var b = nodeNumberOne(node, A[i][1]) 
			text  = A[i][2]
			drawLine (ctx, a, b, '6', '#7FB24C', text)
		}
		/*  disegno i nodi */
		for (var indice = 0; indice < node.length; indice++) {
			drawNode (ctx, '', 20, '')
		}		
	} else {
        alert('You need Safari or Firefox 1.5+ to see this demo.');
    }
}
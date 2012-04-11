/* 
 *  kruskal.js
 *  ~~~~~~
 *  Kruskal
 *
 *  :copyright: (c) 2012 by Leonardo Zizzamia
 *  :license: BSD (See LICENSE for details)  */
var d = document;

var engine = engine || {};
engine.coordsX = [60,140,300,460,540,460,300,140,220]
engine.coordsY = [140,60,60,60,140,220,220,220,140]

function engine_time() {
	if (engine.timeOn) {
		kruskal.init();
		engine.timePause = setTimeout('engine_time()', 3000);
	}
}
	 
var dif, 
    posX, 
    posY, 
    color,
    indice = 0,
    k = 0;

var kruskal = {
    
    A : [], // A - albero di copertura minimo
    
    edge : [],

    node : [], // vertices of the graph
    
    order : [], // qui rimane salvato l'array ordinato  
    
    init : function () {
    	if (engine.start == 0) {
    		for (var i = 0, node_length = this.node.length; i < node_length; i++) {
    			//MAKE-SET, padre e rank
    			this.node[i][1] = i;
    			this.node[i][2] = 1;
    		}
    		/* ordino gli archi del grafo in senso crescente rispetto al peso */
    		this.order = this.edge.sort((function(a,b){return a[2] - b[2]}));
    	}

    	if (this.find_set(this.edge[indice][0]) != this.find_set(this.edge[indice][1])) {
    		this.A[k] = new Array(this.edge[indice][0], this.edge[indice][1], this.edge[indice][2])
    		k += 1;
    		this.union(this.edge[indice][0], this.edge[indice][1]);
    	}

    	this.draw_graph();
    	if (indice < this.order.length - 1) {
    		indice +=1;
    		engine.start = engine.start + 1;
    	}
    },
    
    /* L'array node serve a conservare per ogni vertice
	 * il riferimento al padre e il rank, rispettivamente
	 * node[?][1] e node[?][2]                         */
    init_graph : function() {	
    	
    	this.node[0] = ['a', 0, 0];
    	this.node[1] = ['b', 0, 0];
    	this.node[2] = ['c', 0, 0];
    	this.node[3] = ['d', 0, 0];
    	this.node[4] = ['e', 0, 0];
    	this.node[5] = ['f', 0, 0];
    	this.node[6] = ['g', 0, 0];
    	this.node[7] = ['h', 0, 0];
    	this.node[8] = ['i', 0, 0];

    	this.edge[0] = ['a', 'b', 4];
    	this.edge[1] = ['a', 'h', 8];
    	this.edge[2] = ['b', 'c', 8];
    	this.edge[3] = ['b', 'h', 11];
    	this.edge[4] = ['c', 'd', 7];
    	this.edge[5] = ['c', 'f', 4];
    	this.edge[6] = ['c', 'i', 2];
    	this.edge[7] = ['d', 'e', 9];
    	this.edge[8] = ['d', 'f', 14];
    	this.edge[9] = ['e', 'f', 10];
    	this.edge[10] = ['f', 'g', 2];
    	this.edge[11] = ['g', 'h', 1];
    	this.edge[12] = ['g', 'i', 6];
    	this.edge[13] = ['h', 'i', 7];

    },
    
    // ~
    clean: function() {
    	indice = 0;
    	engine.timeOn = 0;
    	d.getElementById('time').childNodes[0].nodeValue = 'Play';
    	clearTimeout(engine.timePause);
    	this.A = [];
    	k = 0;
    	engine.start = 0;
    	this.init_graph();
    	this.draw_graph();
    },
    
    // ~
    draw_graph : function() {
    	var canvas = d.getElementById('canv');
    	// Make sure we don't execute when canvas isn't supported
    	if (canvas.getContext){  
    		var ctx = canvas.getContext('2d');
    		ctx.clearRect(0,0,600,350);             // clear canvas x y
    		
    		/* Coloro di grigio tutti gli archi */
    		for (var i = 0, edge_length = this.edge.length; i < edge_length; i++) {
    			var a = engine.node_one(this.node, this.edge[i][0]); // recupero il numero dell'indice analizzato
    			var b = engine.node_one(this.node, this.edge[i][1]);
    			text  = this.edge[i][2];
    			draw.line(ctx, a, b, '5', '#a4a4a4', text);
    		}
    		
    		/* Coloro di grigio tutti gli archi */
    		for (var i = 0, A_length = this.A.length; i < A_length; i++) {
    			var a = engine.node_one(this.node, this.A[i][0]);          // recupero il numero dell'indice analizzato
    			var b = engine.node_one(this.node, this.A[i][1]); 
    			text  = this.A[i][2];
    			draw.line(ctx, a, b, '6', '#7FB24C', text);
    		}
    		
    		/*  disegno i nodi */
    		for (var indice = 0, node_length = this.node.length; indice < node_length; indice++) {
    			draw.node(ctx, '', 20, '', this.node);
    		}	
    			
    	} else {
            alert('You need Safari or Firefox 1.5+ to see this demo.');
        }
        
    },
    
    // ~
    find_set : function(x) {
        /* Start Set Kruskal Algorithms ---------------------------------------------------------*/
    	i = typeof x != 'number' ? engine.node_one (this.node, x) : x;
    	if (i != this.node[i][1]) {
    	    this.node[i][1] = this.find_set(this.node[i][1]);
    	}
    	return this.node[i][1];
    },
    
    // ~
    graph_link : function(x, y) {
        //node[?][2] è il rank[?]
    	if (this.node[x][2] > this.node[y][2]) {
    	    this.node[y][1] = x;
    	} else {
    	    this.node[x][1] = y;
    	}
    	if (this.node[x][2] == this.node[y][2]) {
    	    this.node[y][2] = this.node[y][2] + 1;
    	}
    },
    
    // ~
    union : function(x, y){
    	this.graph_link(this.find_set(x), this.find_set(y));
    },
    
    // ~
    update : function(container) {
    	indice = 0;
    	engine.timeOn = 0;
    	d.getElementById('time').childNodes[0].nodeValue = 'Play';
    	clearTimeout(engine.timePause);
    	this.A = [];
    	k = 0;
    	engine.start = 0;
    	this.init_graph();
    	var input = d.getElementById(container).getElementsByTagName('input');
    	for (var i = 0, co = input.length; i < co; i++) {
    		this.edge[i][2] = input[i].value;
    	}
    	this.draw_graph();
    }
}

kruskal.init_graph();
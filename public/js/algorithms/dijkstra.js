/* 
 *  dijkstra.js
 *  ~~~~~~
 *  Dijkstra
 *
 *  :copyright: (c) 2012 by Leonardo Zizzamia
 *  :license: BSD (See LICENSE for details)  */
var d = document;

var engine = engine || {};
engine.coordsX = [46,174,174,430,430];
engine.coordsY = [174,46,302,46,302];
engine.start   = 0;
engine.written = 0;

function engine_time() {
	if (engine.timeOn) {
		dijkstra.init();
		engine.timePause = setTimeout('engine_time()', 3000);
	}
}
    
var dijkstra = {
    
    node : [], // vertices of the graph
    
    S : [], // S is the list of vertices constituting one of the shortest paths 
            // from source to target, or the empty sequence if no path exists.
            
    Q : [], // Q is a queue of vertices of the min-priority, or implemented 
            // with a binary-heap or Fibonacci heap.
    
    init : function() {  
         
        // ~
    	if (this.S.length == 0) {
    		this.initialize_single_source();
    	}	
    	
    	// ~
    	u = this.Q.shift();        // u <- Extract-Min (Q)
    	this.S.push(u);       // S <- S U {u}
    	
    	// ~
    	if (u) {	
    		var i = engine.node_two(this.node, u, 0);	
    		Min = Number.MAX_VALUE;

    		for (var j = 0, co = this.node[i][3].length; j < co; j++) {
    		    
    			var z = engine.node_three_two(this.node, this.node, i, 3, j);
    			this.relax( i, z,  this.node[i][4][j]);                      // relax(u, v, w)
    				
    		}

    		this.draw_graph();	

    		/* Choose who among them color the gray, then choose the 
    		 * vertex that has the edge that costs less.
             * Cycles through vertices in S and marks the arc comes 
             * to a white node, which costs less.                   */
    		for (var y = 0, c = this.S.length; y < c; y++) {
    		    
    			for (var val = 0, coun = this.node.length; val < coun; val++) {
    				if (this.S[y][0] == this.node[val][0]) break;
    			}
    			
    			// through each edge of the node
    			for (var x = 0, cou = this.S[y][3].length; x < cou; x++) {

    				// get number of the node
    				for (var t = 0, coun = this.node.length; t < coun; t++) {
    					if (this.S[y][3][x] == this.node[t][0]) {
    					    break;
    					}
    				}
    				
    				// ~
    				if ((Min > this.S[y][4][x]) && (this.node[t][5] == 'white')) {
    					Min = this.S[y][4][x];
    					MinEnd   = t;
    					MinStart = val;
    				}

    			}

    		}
    		
    		// To gray node that costs less.
    		this.node[MinEnd][5] = 'gray'; 
    		
    		// ~
    		for (var k = 0, con = this.Q.length; k < con; k++) {
    			if (this.node[MinEnd][0] == this.Q[k][0]) {
    			    break;
    			}
    		}
    		
    		// ~
    		if (this.Q.length != 0)  {
    			this.Q[k][5] = 'gray';
    			var text = 'Smaller edge : <span style="color:#F09E62">&phi; ('+this.node[MinStart][0];
    			text += ', '+this.node[MinEnd][0]+')</span> with weight : <span style="color:#8BB399">' + Min + '</span>';
    			draw.text(text);
    			engine.written += 1;
    		}
    		
    		// After they have been relaxed all their edges, the node is colored black.
    		this.node[i][5] = 'black';

    		// Sort the array by placing in the top of the list nodes gray.
    		this.Q.sort( function (a,b) {
    			if (a[5] === b[5]) {
    			    return 0;
    			}
    			if (typeof a[5] === typeof b[5]) {
    			    return a[5] < b[5] ? -1 : 1;
    			}
    			return typeof a[5] < typeof b[5] ? -1 : 1;
    		})
    		
    		this.Q.reverse();

        // ~
    	} else {
    	    
    		dijkstra.draw_graph();
    		engine.timeOn = 0;
    		d.getElementById('time').childNodes[0].nodeValue = 'Play';
    		clearTimeout(engine.timePause);
    		dijkstra.init_graph();
    		this.S = [];
    		this.Q = engine.clone(this.node);
    		
    	}

    },
    
    // Initialization of the directed graph
    init_graph : function() {
    	// Node[..] = [vertex, cost shortest path from the source 0, the node's parent]
    	this.node[0] = ['s', 0, 'nil'];
    	this.node[1] = ['t', 0, 'nil'];
    	this.node[2] = ['y', 0, 'nil'];
    	this.node[3] = ['x', 0, 'nil'];
    	this.node[4] = ['z', 0, 'nil'];

    	// edges directed, e.g. node[0] :  s -> t , s -> y
    	this.node[0][3] = ['t','y'];
    	this.node[1][3] = ['x','y'];
    	this.node[2][3] = ['t','x','z'];
    	this.node[3][3] = ['z'];
    	this.node[4][3] = ['s','x'];

    	// edge weights, e.g. node[0] : s -> t with weight 10
    	this.node[0][4] = [10,5];
    	this.node[1][4] = [1,2];
    	this.node[2][4] = [3,9,2];
    	this.node[3][4] = [4];
    	this.node[4][4] = [7,6];

    	// other stuff to the graphics of the edges
    	this.node[0][6] = [0,0];
    	this.node[1][6] = [0,3];
    	this.node[2][6] = [4,0,0];
    	this.node[3][6] = [3];
    	this.node[4][6] = [0,4];

    	// stores nodes already discovered
    	this.node[0][5] = ['gray'];
    	this.node[1][5] = ['white'];
    	this.node[2][5] = ['white'];
    	this.node[3][5] = ['white'];
    	this.node[4][5] = ['white'];
    },
    
    // ~
    clean : function () {
        var parent, child;
    	while (engine.written != 0) {
    		parent = d.getElementById('right-table');
    	    child = d.getElementById('text-output');
    		parent.removeChild(child);
    		engine.written -= 1;
    	}
    	engine.timeOn = 0;
    	d.getElementById('time').childNodes[0].nodeValue = 'Play';
    	clearTimeout(engine.timePause);
    	
    	this.init_graph();
    	this.S = [];
    	this.Q = engine.clone(this.node);
    	this.draw_graph();
    },
    
    // ~
    draw_graph : function() {
    	var canvas = d.getElementById('canv');
    	
    	// Make sure we don't execute when canvas isn't supported
    	if (canvas.getContext){  
    	    
    		var ctx = canvas.getContext('2d');
    		ctx.clearRect(0,0,400,400);         // clear canvas x y

    		// To gray all the edges
    		for (var indice = 0, node_length = this.node.length; indice < node_length; indice++) {
    		    // ~
    			for (k = 0, c = this.node[indice][3].length; k < c; k++) {	
    			    
    			    // Retrieves the index number analyzed.
    				var z = engine.node_three_two(this.node, this.node, indice, 3, k);

    				posX = draw.nodeCp1x(indice, z, this.node[indice][6][k]);
    				posY = draw.nodeCp1y(indice, z, this.node[indice][6][k]);
    				
    				if (this.node[indice][0] == this.node[z][2]) {
    				    color = '#7FB24C';
    				} else {
    				    color = '#ddd';
    				}
    				
    				draw.edge(ctx, indice, z, posX, posY, '5', color, this.node[indice][4][k], this.node[indice][6][k], engine.radius);
    			}
    		}

    		// draws the nodes
    		for (var indice = 0, node_length = this.node.length; indice < node_length; indice++) {
    			// Draw shapes
    			ctx.beginPath();
    			ctx.arc(engine.coordsX[indice],engine.coordsY[indice],engine.radius,0,360,false);
    			ctx.moveTo(engine.coordsX[indice],engine.coordsY[indice]);                          //moveTo(x, y)

    			if (this.node[indice][5] == 'gray') {
    				ctx.fillStyle = "#dedede";
    			} else if (this.node[indice][5] == 'black') {
    				ctx.fillStyle = "#000";
    			} else {
    			    ctx.fillStyle = "#7FB24C"; 
    			}
    			ctx.fill();

    			ctx.font = "14px Arial";
    			ctx.fillStyle = "white";
    			
    			// weight of the paths
    			weight = this.node[indice][1] == Number.MAX_VALUE ? '∞' : this.node[indice][1];
    			text = this.node[indice][0];
    			ctx.fillText( text, engine.coordsX[indice] - 12, engine.coordsY[indice] + 6);
    			ctx.font = "16px Arial";
    			ctx.fillText( weight, engine.coordsX[indice] - 3, engine.coordsY[indice] + 6);
    		}

    	}
    },
    
    // Initialize the graph
    initialize_single_source : function () {
    	var infinity = Number.MAX_VALUE;
    	for (var i = 0, c = this.node.length; i < c; i++) {
    		this.node[i][1] = infinity;                           // d[v] <- infinity  , is the estimate of the shortest path
    		this.node[i][2] = 'nil';                              // p[root] <- NIL    , parent
    	}
    	this.node[0][1] = 0;  //  estimate of the shortest path to the root
    },
    
    /* Relax : when he discovers a node, if its cost is greater than the 
     * weight of the analyzed node that connects them, relaxes the node 
     * discovered by decreasing the cost to reach the source.         */
    relax : function (u, v, w){
    	if (this.node[v][1] > (this.node[u][1] + w)) {
    		this.node[v][1] = this.node[u][1] + w;
    		this.node[v][2] = this.node[u][0];
    	}
    },
    
    // update a directed graph
    update : function (container) {
        var parent, child, input, label, lab;
    	while (engine.written != 0) {
    		parent = d.getElementById('right-table');
    		child = d.getElementById('text-output');
    		parent.removeChild(child);
    		engine.written -= 1;
    	}

    	engine.timeOn = 0;
    	d.getElementById('time').childNodes[0].nodeValue = 'Play';
    	clearTimeout(engine.timePause);
    	dijkstra.init_graph();

    	input = d.getElementById(container).getElementsByTagName('input');
    	label = d.getElementById(container).getElementsByTagName('label');
    	lab   = [];

    	for (var i = 0; i < 10; i++) {	
    		lab = label[i].childNodes[0].nodeValue;
    		var arrayLab = lab.split(' ',2);

            // ~
    		for (var j = 0, node_length = this.node.length; j < node_length; j++) {
    		    // ~
    			for (var k = 0; k < this.node[j][3].length; k++) {
    				
    				// change all the edges
    				if (this.node[j][0] == arrayLab[0]) {
    					if (this.node[j][3][k] == arrayLab[1]) {
    						if (this.node[j][4][k] != input[i].value) {
    							this.node[j][4][k] = parseInt(input[i].value);
    						}
    					}
    				}
    			}

    		}

    	}
    	
    	this.S = [];
    	this.Q = engine.clone(this.node);
    	this.draw_graph();
    } 
}

var Min;

dijkstra.init_graph();
dijkstra.Q = engine.clone(dijkstra.node);
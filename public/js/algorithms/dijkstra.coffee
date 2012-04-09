# 
#   dijkstra.coffee
#   ~~~~~~
#   Dijkstra
#
#   :copyright: (c) 2012 by Leonardo Zizzamia
#   :license: BSD (See LICENSE for details)

engine.coordsX = [46,174,174,430,430];
engine.coordsY = [174,46,302,46,302];
engine.start   = 0
engine.written = 0
Min = 99999
node = setGraph()
S = [] # insieme S di vertici i cui pesi finali dei cammini minimi dalla sorgente s sono stati già determinati
Q = clone(node)  # Q è una coda di vertici di min-priorità, implentata o con un heap-binario o con un heap di Fibonacci


engineTime = () -> 
	if engine.timeOn
	    dijkstra()
	    engine.timePause = setTimeout('engineTime()', 3000)
	
# Dichiaro il grafo orientato
setGraph = () ->
	node = []
	
	# parametri : vertice, costo cammino minimo dalla sorgente 0, padre del nodo 
	node[0] = ['s', 0, 'nil']
	node[1] = ['t', 0, 'nil']
	node[2] = ['y', 0, 'nil']
	node[3] = ['x', 0, 'nil']
	node[4] = ['z', 0, 'nil']

	# archi orientati
	node[0][3] = ['t','y']
	node[1][3] = ['x','y']
	node[2][3] = ['t','x','z']
	node[3][3] = ['z']
	node[4][3] = ['s','x']

	# pesi degli archi 
	node[0][4] = [10,5]
	node[1][4] = [1,2]
	node[2][4] = [3,9,2]
	node[3][4] = [4]
	node[4][4] = [7,6]

	# altra robaccia per la grafica degli archi
	node[0][6] = [0,0]
	node[1][6] = [0,3]
	node[2][6] = [4,0,0]
	node[3][6] = [3]
	node[4][6] = [0,4]

	# ci serve per ricordarci i nodi gia scoperti, come si fa nella BFS
	node[0][5] = ['gray']
	node[1][5] = ['white']
	node[2][5] = ['white']
	node[3][5] = ['white']
	node[4][5] = ['white']

	return node

# aggiorno un grafo orientato
update = (container) ->
	while engine.written != 0
	    parent = d.getElementById('right-table')
	    child = d.getElementById('text-output')
	    parent.removeChild(child)
	    engine.written -= 1
	
	engine.timeOn = 0
	d.getElementById('time').childNodes[0].nodeValue = 'Play'
	clearTimeout(engine.timePause)
	node = setGraph()
	input = d.getElementById(container).getElementsByTagName('input');
	label = d.getElementById(container).getElementsByTagName('label');
	lab   = []
	for i in [0..10]
		lab = label[i].childNodes[0].nodeValue
		arrayLab = lab.split(' ',2)
		
		for j in [0..node.length]
		    for k in [0..node[j][3].length]
				# modifico tutti gli archi
				if node[j][0] == arrayLab[0]
					if node[j][3][k] == arrayLab[1]
						if node[j][4][k] != input[i].value
							node[j][4][k] = parseInt(input[i].value)
	S = []
	Q = clone(node)
	draw_graph()
	
clean = () ->
	while engine.written != 0
		parent = d.getElementById('right-table')
		child = d.getElementById('text-output')
		parent.removeChild(child);
		engine.written -= 1
		
	engine.timeOn = 0
	d.getElementById('time').childNodes[0].nodeValue = 'Play'
	clearTimeout(engine.timePause)
	node = set_graph()
	S = []
	Q = clone(node)
	draw_graph()


# Inizializzo il grafo 
initializeSingleSource = () ->
    infinity = Number.MAX_VALUE
    for i in [0..node.length]
		node[i][1] = infinity  # d[v] <- infinito  , è la stima del cammino minimo
		node[i][2] = 'nil'     # p[root] <- NIL    , ovviamente il padre
	node[0][1] = 0      # stima del cammino minimo per la radice


# Relax : quando scopro un nodo se il suo costo è maggiore 
# del nodo analizzato più il peso dell'arco che li collega
# rilasso il nodo scoperto decrementando il suo costo 
# per raggiungere a sorgente                             
relax = (u, v, w) ->
	if node[v][1] > (node[u][1] + w)
		node[v][1] = node[u][1] + w
		node[v][2] = node[u][0]

# node sono i vertici del grafo
dijkstra = () ->
	if S.length == 0
		initializeSingleSource()
	u = Q.shift()   # u <- Extract-Min (Q)
	S.push(u)       # S <- S U {u}

	if u
		i = nodeNumberTwo(node, u, 0)			
		Min = Number.MAX_VALUE		
		
		for j in [0..node[i][3].length]
			z = nodeNumberThreeTwo(node, node, i, 3, j)
			relax( i, z,  node[i][4][j])  # relax(u, v, w)	
			
		drawGraph()	

		# Importante sto decidendo chi tra loro colorare di grigio
		# quindi scelgo il vertice che ha l'arco che costa meno arrivarci
		# Scorro i vertici dentro S e mi segno l'arco che arriva a un nodo
		# bianco che costa meno  
		for y in [0..S.length] 
		    for val in [0..node.length]                            
				if S[y][0] == node[val][0]
				    break;
			# scorro ogni arco del nodo
			for x in [0..S[y][3].length]		
				# ci serve il numero del nodo
				for t in [0..node.length]
				    if S[y][3][x] == node[t][0]
				        break
			
				if (Min > S[y][4][x]) and (node[t][5] == 'white')
					Min = S[y][4][x]
					MinEnd   = t
					MinStart = val
		
		node[MinEnd][5] = 'gray' # coloro di grigio il nodo che costa meno arrivarci
		
		for k in [0..Q.length]
			if node[MinEnd][0] == Q[k][0]
			    break
			    
		if Q.length != 0)
			Q[k][5] = 'gray'
			writeP ('Arco più piccolo : <span style="color:#F09E62">&phi; ('+node[MinStart][0]+', '+node[MinEnd][0]+')</span> con il  peso : ' +
					'<span style="color:#8BB399">' + Min + '</span>')
			engine.written += 1
			
		node[i][5] = 'black' # dopo che ho rilassato tutti i suoi archi lo coloro di nero

		# ordina l'array mettendo in cima alla lista i nodi grigi
		Q.sort( (a,b) ->
			if a[5] === b[5] 
				return 0
			if typeof a[5] === typeof b[5]
				return a[5] < b[5] ? -1 : 1
			return typeof a[5] < typeof b[5] ? -1 : 1
		)
		Q.reverse()
	
	else
	    drawGraph()
		engine.timeOn = 0
		d.getElementById('time').childNodes[0].nodeValue = 'Play'
		clearTimeout(engine.timePause)
		node = setGraph()
		S = []
		Q = Clone(node)


drawGraph = () ->
    canvas = d.getElementById('canv')
    
    # Make sure we don't execute when canvas isn't supported
	if canvas.getContext
	    ctx = canvas.getContext('2d')
		ctx.clearRect(0,0,400,400); # clear canvas x y
	
		# Coloro di grigio tutti gli archi 
		for indice in [0..node.length] 
		    for k in [0..node[indice][3].length] 
				z = nodeNumberThreeTwo(node, node, indice, 3, k) # recupero il numero dell'indice analizzato	
			
				posX = nodeCp1x(indice, z, node[indice][6][k])
				posY = nodeCp1y(indice, z, node[indice][6][k])
				if node[indice][0] == node[z][2]
				    color = '#7FB24C'
				else
				    color = '#ddd'
				drawEdge(ctx, indice, z, posX, posY, '5', color, node[indice][4][k], node[indice][6][k], engine.radius)
		
		#  disegno i nodi
		for indice in [0..node.length] 
			# Draw shapes
			ctx.beginPath()
			ctx.arc(engine.coordsX[indice],engine.coordsY[indice],engine.radius,0,360,false)
			ctx.moveTo(engine.coordsX[indice],engine.coordsY[indice]) # moveTo(x, y)
		
			if node[indice][5] == 'gray')
				ctx.fillStyle = "#dedede"
			else if node[indice][5] == 'black')
				ctx.fillStyle = "#000";
			else 
			    tx.fillStyle = "#7FB24C";
			ctx.fill();
		
			ctx.font = ("14px Arial");
			ctx.fillStyle = "white";
			
			# peso dei cammini
			weight = node[indice][1] == Number.MAX_VALUE ? '∞' : node[indice][1]
			text = node[indice][0]
			ctx.fillText( text, engine.coordsX[indice] - 12, engine.coordsY[indice] + 6);
			ctx.font = ("16px Arial");
			ctx.fillText( weight, engine.coordsX[indice] - 3, engine.coordsY[indice] + 6);
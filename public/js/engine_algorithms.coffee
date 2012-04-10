# 
#   engine_algorithms.coffee
#   ~~~~~~
#   Engine
#
#   :copyright: (c) 2012 by Leonardo Zizzamia
#   :license: BSD (See LICENSE for details)
d = document
root = exports ? this


# "engine algorithms object" is the engine of the all the algorithms
# --------------------
# pause : if active to 1 disables the algorithm giving the impression of a break
# start : if it's 0, the initialization of the algorithm starts
# time  : waiting time between interactions of the algorithm
root.engine =
    pause : 0,
    start : 0,
    time  : 3000,
    timePause : 0,
    timeOn : 0,
    coordsX : [],
    coordsY : [],
    radius : 20,
    writen : 0,
    
    algorithms_time : (id) ->
        val = d.getElementById(id)
        value = val.childNodes[0].nodeValue
        if value == 'Pausa'
            this.timeOn = 0
            val.childNodes[0].nodeValue = 'Play'
            clearTimeout(engine.timePause)
        
        if value == 'Play'
            this.timeOn = 1
            val.childNodes[0].nodeValue = 'Pausa'
            this.timePause = setTimeout('engine_time()', 2000)
    
    clone : (_ArryToClone) ->
        _Clone = []
        for content, _IdClone in _ArryToClone
            if _ArryToClone[_IdClone].Constructor == Array
                this.clone(_ArryToClone[_IdClone])
            else
                _Clone[_IdClone] = _ArryToClone[_IdClone]
        return _Clone
    
    node_one : (a, val) ->
        # a : List where research  
        # val : value to search
        for item, num in a
            if val == a[num][0]
                break
        return num
    
    node_two : (a, b, val) ->
        # a : List where research  
        # b : list from which to take
        # val : value to search
        for item, num in a
            if b[val] == a[num][0]
                break
        return num
    
    node_double_two : (a, b, val1, val2) ->
        # a : List where research  
        # b : list from which to take
        # val1 : index
        # val2 : value to search
        for item, num in a
            if b[val1][val2] == a[num][0]
                break
        return num
    
    node_three_two : (a, b, val1, val2, val3) ->
        # a : List where research  
        # b : list from which to take
        # val1 : index
        # val2 : value to search
        # val3 :
        for item, num in a
            if b[val1][val2][val3] == a[num][0]
                break
        return num
        
    swap : (list,y,x) ->
        # alert('parte : ' + list.length + ' ' + i)
        b = list[y]
        list[y] = list[x]
        list[x] = b

heap_size = 0;

min_heapify = ( A, i ) ->
	l = 2*i
	br = 2*i+1
	min = 9999999
	
	if ( l <= heap_size ) and ( A[l][1] < A[i][1] )
		min = l;
	else  
	    min = i;
	    
	if ( r <= heap_size ) and ( A[r][1] < A[Min][1] )
		min = r;
		
	if min != i
		swap( A, i, min)
		min_heapify( A, min )

build_min_heap = ( A ) ->
	heap_size = A.length - 1;
	for num in [Math.ceil(A.length/2)..0]
		min_heapify( A, num )
	
root.draw = 
    edge : (ctx, a, b, cp1x, cp1y, width, color, text, type, r) ->
        # r : radius
        ctx.beginPath()
        ctx.moveTo(engine.coordsX[b],engine.coordsY[b]);
        ctx.lineWidth = width
        ctx.quadraticCurveTo(cp1x, cp1y, engine.coordsX[a], engine.coordsY[a]) 
        ctx.strokeStyle = color					
        ctx.stroke()
        
        # Calculate the proportion between the pairs of vertices connected
        pixX = Math.max(engine.coordsX[b],engine.coordsX[a]) / Math.min(engine.coordsX[b],engine.coordsX[a])
        pixY = Math.max(engine.coordsY[b],engine.coordsY[a]) / Math.min(engine.coordsY[b],engine.coordsY[a])
        
        solX = 0
        solY = 0
        
        ctx.beginPath()
        
        # Calculate the X position of the arrow
        if engine.coordsX[b] > engine.coordsX[a]
            X = engine.coordsX[b] - r + 4
            if engine.coordsY[b] == engine.coordsY[a] 
                X -= r / 3
            if pixY > 1 && pixY <= 2 && pixX > 4
                X -= r / 6
            solX = 1
        else if engine.coordsX[b] == engine.coordsX[a]
            X = engine.coordsX[b]
            # vertical curved arches, right and left
            if (engine.coordsY[b] != engine.coordsY[a]) and (type > 0)
                if cp1x > engine.coordsX[b]
                    X += r / 3
                else
                    X -= r / 3 
            solX = 2
        else 
            X = engine.coordsX[b] + r - 4
            if engine.coordsY[b] == engine.coordsY[a] 
                X += r / 3
            if pixY > 1 and pixY <= 2 and pixX > 4 
                X += r / 7
            solX = 3
        
        if pixY > 1 and pixY <= 2
            # Calculate the Y position of the arrow
            if pixX > 4 
                pixY *= (r / 7)
            else 
                pixY = pixY * (r / 2) - 1
        else if pixY > 2 and pixY <= 3
            pixY *= r / 8
        else if pixY > 3 and pixY <= 5
            # arc s t
            pixY *= r / 5
        else if pixY > 5 and pixY <= 10
            # arcs y x, t z
            pixY *= r / 8
        else if pixY > 10
            pixY *= r / 13
        
        # arcs between the nodes with the same X but different Y
        if engine.coordsY[b] > engine.coordsY[a]
            Y = engine.coordsY[b] - pixY
            if engine.coordsX[b] == engine.coordsX[a]
                Y = Y  - (r / 2) + 4 
            solY = 1
        else if engine.coordsY[b] == engine.coordsY[a]
            Y = engine.coordsY[b]
            # archi orizzontali curvi, up e down
            if engine.coordsX[b] != engine.coordsX[a] && type > 0 
                if cp1y > engine.coordsY[b]
                	Y += r / 3
                else 
                    Y -= r / 3 
            solY = 2
        else 
            Y = engine.coordsY[b] + pixY
            if engine.coordsX[b] == engine.coordsX[a]
                Y = Y  + (r / 2) - 4
            solY = 3
        
        ctx.arc(X,Y,5,0,360,false)
        ctx.moveTo(X,Y);
        ctx.fillStyle = color
        ctx.fill()
        
        if type == 1
            cp1y = cp1y + 20
        
        # diagonal line st and yx 
        if solY == 3 and solX == 1
            cp1x -= 20
            cp1y += 15
        
        # diagonal line sy and tz 
        if solY == 1 and solX == 1
            cp1x -= 15
            cp1y -= 20
        
        ctx.font = ("20px Arial")
        ctx.fillStyle = "black"
        ctx.fillText( text, cp1x-5, cp1y)
        
    line : (ctx, a, b, width, color, text) ->
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.moveTo( engine.coordsX[a], engine.coordsY[a] )  
        ctx.lineTo( engine.coordsX[a], engine.coordsY[a] )
        ctx.lineTo( engine.coordsX[b], engine.coordsY[b] )
        ctx.closePath()
        ctx.strokeStyle = color
        ctx.stroke()
        
        pos_x_max = Math.max(engine.coordsX[a],engine.coordsX[b])
        pos_x_min = Math.min(engine.coordsX[a],engine.coordsX[b])
        
        pos_y_max = Math.max(engine.coordsY[a],engine.coordsY[b])
        pos_y_min = Math.min(engine.coordsY[a],engine.coordsY[b])
        
        posX = (pos_x_max - pos_x_min)/2 + pos_x_min
        posY = (pos_y_max - pos_y_min)/2 + pos_y_min
        
        # Writes the weight of the arc between two nodes.
        ctx.font = "20px Arial"
        ctx.fillStyle = "black"
        ctx.fillText( text, posX, posY)
        
    graph_line : (ctx) ->
        for item, indice in node
            for item, i in node[indice][3]
                for item, x in node
                    if node[indice][3][i] == node[z][0]
                        break
                color = '#333'
                width = '4'
                if node[indice][5][i] == 'green'
                    color = '#7FB24C'
                    width = '5'	
                draw.line(ctx, indice, z, width, color, node[indice][4][i])
    
    node : (ctx, b, radius, type) ->
        for item, i in node
            ctx.beginPath()
            # arc(x, y, raggio, startAngle, endAngle, in senso antiorario) , Math.PI*2
            ctx.arc(engine.coordsX[i],engine.coordsY[i],radius,0,360,false)
            # moveTo(x, y)
            ctx.moveTo(engine.coordsX[i],engine.coordsY[i])
            
            ctx.fillStyle = "#7FB24C"
            if type == 'prim'
                ctx.fillStyle = "#ccc"
                if node[i][6] == 'ok'
                    ctx.fillStyle = "#7FB24C"
                if node[i][0] == node[b][0]
                    ctx.fillStyle = "red"
                    node[b][6] = 'ok'
            
            ctx.fill()
            ctx.font = "20px Arial"
            ctx.fillStyle = "white"
            ctx.fillText( node[i][0], engine.coordsX[i] - 4, engine.coordsY[i] + 6)
    
    nodeCp1x : (i, z, ty) ->
        pos_x_max = Math.max(engine.coordsX[i],engine.coordsX[z])
        pos_x_min = Math.min(engine.coordsX[i],engine.coordsX[z])
        
        posX = (pos_x_max - pos_x_min)/2 + pos_x_min;
        if ty == 3
            posX -= engine.radius * 2
        if ty == 4
            posX += engine.radius * 2
        return posX
    
    nodeCp1y : (i, z, ty) ->
        pos_y_max = Math.max(engine.coordsY[i],engine.coordsY[z])
        pos_y_min = Math.min(engine.coordsY[i],engine.coordsY[z])
        
        posY = (pos_y_max - pos_y_min)/2 + pos_y_min;	
        if ty == 1
            posY -= engine.radius * 2
        if ty == 2
            posY += engine.radius * 2
        return posY
        
    text : (text) ->
    	div = d.getElementById('right-table')
    	p = d.createElement('p')
    	p.setAttribute('id','text-output')
    	p.innerHTML = text
    	div.appendChild(p)
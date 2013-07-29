(function() {
  var d, root;

  d = document;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.engine = {
    pause: 0,
    start: 0,
    time: 3000,
    timePause: 0,
    timeOn: 0,
    coordsX: [],
    coordsY: [],
    radius: 20,
    writen: 0,
    algorithms_time: function(id) {
      var val, value;
      val = d.getElementById(id);
      value = val.childNodes[0].nodeValue;
      if (value === 'Pause') {
        this.timeOn = 0;
        val.childNodes[0].nodeValue = 'Play';
        clearTimeout(engine.timePause);
      }
      if (value === 'Play') {
        this.timeOn = 1;
        val.childNodes[0].nodeValue = 'Pause';
        return this.timePause = setTimeout('engine_time()', 2000);
      }
    },
    clone: function(_ArryToClone) {
      var content, _Clone, _IdClone, _len;
      _Clone = [];
      for (_IdClone = 0, _len = _ArryToClone.length; _IdClone < _len; _IdClone++) {
        content = _ArryToClone[_IdClone];
        if (_ArryToClone[_IdClone].Constructor === Array) {
          this.clone(_ArryToClone[_IdClone]);
        } else {
          _Clone[_IdClone] = _ArryToClone[_IdClone];
        }
      }
      return _Clone;
    },
    node_one: function(a, val) {
      var item, num, _len;
      for (num = 0, _len = a.length; num < _len; num++) {
        item = a[num];
        if (val === a[num][0]) break;
      }
      return num;
    },
    node_two: function(a, b, val) {
      var item, num, _len;
      for (num = 0, _len = a.length; num < _len; num++) {
        item = a[num];
        if (b[val] === a[num][0]) break;
      }
      return num;
    },
    node_double_two: function(a, b, val1, val2) {
      var item, num, _len;
      for (num = 0, _len = a.length; num < _len; num++) {
        item = a[num];
        if (b[val1][val2] === a[num][0]) break;
      }
      return num;
    },
    node_three_two: function(a, b, val1, val2, val3) {
      var item, num, _len;
      for (num = 0, _len = a.length; num < _len; num++) {
        item = a[num];
        if (b[val1][val2][val3] === a[num][0]) break;
      }
      return num;
    },
    swap: function(list, y, x) {
      var b;
      b = list[y];
      list[y] = list[x];
      return list[x] = b;
    }
  };

  root.heap = {
    size: 0,
    min_heapify: function(A, i) {
      var br, l, min;
      l = 2 * i;
      br = 2 * i + 1;
      min = 9999999;
      if ((l <= heap_size) && (A[l][1] < A[i][1])) {
        min = l;
      } else {
        min = i;
      }
      if ((r <= heap_size) && (A[r][1] < A[Min][1])) min = r;
      if (min !== i) {
        swap(A, i, min);
        return heap.min_heapify(A, min);
      }
    },
    build_min_heap: function(A) {
      var num, _ref, _results;
      heap.size = A.length - 1;
      _results = [];
      for (num = _ref = Math.ceil(A.length / 2); _ref <= 0 ? num <= 0 : num >= 0; _ref <= 0 ? num++ : num--) {
        _results.push(heap.min_heapify(A, num));
      }
      return _results;
    }
  };

  root.draw = {
    edge: function(ctx, a, b, cp1x, cp1y, width, color, text, type, r) {
      var X, Y, pixX, pixY, solX, solY;
      ctx.beginPath();
      ctx.moveTo(engine.coordsX[b], engine.coordsY[b]);
      ctx.lineWidth = width;
      ctx.quadraticCurveTo(cp1x, cp1y, engine.coordsX[a], engine.coordsY[a]);
      ctx.strokeStyle = color;
      ctx.stroke();
      pixX = Math.max(engine.coordsX[b], engine.coordsX[a]) / Math.min(engine.coordsX[b], engine.coordsX[a]);
      pixY = Math.max(engine.coordsY[b], engine.coordsY[a]) / Math.min(engine.coordsY[b], engine.coordsY[a]);
      solX = 0;
      solY = 0;
      ctx.beginPath();
      if (engine.coordsX[b] > engine.coordsX[a]) {
        X = engine.coordsX[b] - r + 4;
        if (engine.coordsY[b] === engine.coordsY[a]) X -= r / 3;
        if (pixY > 1 && pixY <= 2 && pixX > 4) X -= r / 6;
        solX = 1;
      } else if (engine.coordsX[b] === engine.coordsX[a]) {
        X = engine.coordsX[b];
        if ((engine.coordsY[b] !== engine.coordsY[a]) && (type > 0)) {
          if (cp1x > engine.coordsX[b]) {
            X += r / 3;
          } else {
            X -= r / 3;
          }
        }
        solX = 2;
      } else {
        X = engine.coordsX[b] + r - 4;
        if (engine.coordsY[b] === engine.coordsY[a]) X += r / 3;
        if (pixY > 1 && pixY <= 2 && pixX > 4) X += r / 7;
        solX = 3;
      }
      if (pixY > 1 && pixY <= 2) {
        if (pixX > 4) {
          pixY *= r / 7;
        } else {
          pixY = pixY * (r / 2) - 1;
        }
      } else if (pixY > 2 && pixY <= 3) {
        pixY *= r / 8;
      } else if (pixY > 3 && pixY <= 5) {
        pixY *= r / 5;
      } else if (pixY > 5 && pixY <= 10) {
        pixY *= r / 8;
      } else if (pixY > 10) {
        pixY *= r / 13;
      }
      if (engine.coordsY[b] > engine.coordsY[a]) {
        Y = engine.coordsY[b] - pixY;
        if (engine.coordsX[b] === engine.coordsX[a]) Y = Y - (r / 2) + 4;
        solY = 1;
      } else if (engine.coordsY[b] === engine.coordsY[a]) {
        Y = engine.coordsY[b];
        if (engine.coordsX[b] !== engine.coordsX[a] && type > 0) {
          if (cp1y > engine.coordsY[b]) {
            Y += r / 3;
          } else {
            Y -= r / 3;
          }
        }
        solY = 2;
      } else {
        Y = engine.coordsY[b] + pixY;
        if (engine.coordsX[b] === engine.coordsX[a]) Y = Y + (r / 2) - 4;
        solY = 3;
      }
      ctx.arc(X, Y, 5, 0, 360, false);
      ctx.moveTo(X, Y);
      ctx.fillStyle = color;
      ctx.fill();
      if (type === 1) cp1y = cp1y + 20;
      if (solY === 3 && solX === 1) {
        cp1x -= 20;
        cp1y += 15;
      }
      if (solY === 1 && solX === 1) {
        cp1x -= 15;
        cp1y -= 20;
      }
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      return ctx.fillText(text, cp1x - 5, cp1y);
    },
    line: function(ctx, a, b, width, color, text) {
      var posX, posY, pos_x_max, pos_x_min, pos_y_max, pos_y_min;
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.moveTo(engine.coordsX[a], engine.coordsY[a]);
      ctx.lineTo(engine.coordsX[a], engine.coordsY[a]);
      ctx.lineTo(engine.coordsX[b], engine.coordsY[b]);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.stroke();
      pos_x_max = Math.max(engine.coordsX[a], engine.coordsX[b]);
      pos_x_min = Math.min(engine.coordsX[a], engine.coordsX[b]);
      pos_y_max = Math.max(engine.coordsY[a], engine.coordsY[b]);
      pos_y_min = Math.min(engine.coordsY[a], engine.coordsY[b]);
      posX = (pos_x_max - pos_x_min) / 2 + pos_x_min;
      posY = (pos_y_max - pos_y_min) / 2 + pos_y_min;
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      return ctx.fillText(text, posX, posY);
    },
    graph_line: function(ctx) {
      var color, i, indice, item, width, x, _len, _results;
      _results = [];
      for (indice = 0, _len = node.length; indice < _len; indice++) {
        item = node[indice];
        _results.push((function() {
          var _len2, _len3, _ref, _results2;
          _ref = node[indice][3];
          _results2 = [];
          for (i = 0, _len2 = _ref.length; i < _len2; i++) {
            item = _ref[i];
            for (x = 0, _len3 = node.length; x < _len3; x++) {
              item = node[x];
              if (node[indice][3][i] === node[z][0]) break;
            }
            color = '#333';
            width = '4';
            if (node[indice][5][i] === 'green') {
              color = '#7FB24C';
              width = '5';
            }
            _results2.push(draw.line(ctx, indice, z, width, color, node[indice][4][i]));
          }
          return _results2;
        })());
      }
      return _results;
    },
    node: function(ctx, b, radius, type, node) {
      var i, item, _len, _results;
      _results = [];
      for (i = 0, _len = node.length; i < _len; i++) {
        item = node[i];
        ctx.beginPath();
        ctx.arc(engine.coordsX[i], engine.coordsY[i], radius, 0, 360, false);
        ctx.moveTo(engine.coordsX[i], engine.coordsY[i]);
        ctx.fillStyle = "#7FB24C";
        if (type === 'prim') {
          ctx.fillStyle = "#ccc";
          if (node[i][6] === 'ok') ctx.fillStyle = "#7FB24C";
          if (node[i][0] === node[b][0]) {
            ctx.fillStyle = "red";
            node[b][6] = 'ok';
          }
        }
        ctx.fill();
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        _results.push(ctx.fillText(node[i][0], engine.coordsX[i] - 4, engine.coordsY[i] + 6));
      }
      return _results;
    },
    nodeCp1x: function(i, z, ty) {
      var posX, pos_x_max, pos_x_min;
      pos_x_max = Math.max(engine.coordsX[i], engine.coordsX[z]);
      pos_x_min = Math.min(engine.coordsX[i], engine.coordsX[z]);
      posX = (pos_x_max - pos_x_min) / 2 + pos_x_min;
      if (ty === 3) posX -= engine.radius * 2;
      if (ty === 4) posX += engine.radius * 2;
      return posX;
    },
    nodeCp1y: function(i, z, ty) {
      var posY, pos_y_max, pos_y_min;
      pos_y_max = Math.max(engine.coordsY[i], engine.coordsY[z]);
      pos_y_min = Math.min(engine.coordsY[i], engine.coordsY[z]);
      posY = (pos_y_max - pos_y_min) / 2 + pos_y_min;
      if (ty === 1) posY -= engine.radius * 2;
      if (ty === 2) posY += engine.radius * 2;
      return posY;
    },
    text: function(text) {
      var div, p;
      div = d.getElementById('right-table');
      p = d.createElement('p');
      p.setAttribute('id', 'text-output');
      p.innerHTML = text;
      return div.appendChild(p);
    }
  };

}).call(this);

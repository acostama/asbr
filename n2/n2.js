var j_g = function(){
	var ctrl;

	
	var j_v = (function(){
		var wdt =0;
		var cid=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
		
		var p_fac = function (x, y, val){
			var n = document.createElement("div");
			n.className = "piece piece-"+val;
			n.innerHTML = val;
			
			var id = new Date().getTime();
			id="c"+id;
			n.setAttribute("id", id);	
			cid[x][y] = id;		
			n.style.width = wdt*.95+"px";
			n.style.height = wdt*.65+"px";
			n.style.paddingTop = wdt*.3+"px";
			n.style.borderRadius = wdt /2 + "px";	
			n.style.left=document.getElementById("cell-"+x+"-"+y).offsetLeft +"px";
			n.style.top=document.getElementById("cell-"+x+"-"+y).offsetTop +"px";
		
			document.getElementById("board").appendChild(n);
		
		};
		var resize=function(){
			wdt = document.getElementsByClassName('cell')[0].clientWidth;

			var cells = document.getElementsByClassName('cell');
			for (var i =0; i< cells.length; i++){cells[i].style.borderRadius = cells[i].offsetWidth/2 + "px";
		//	cells[i].style.width = wdt + "px";
			}
			var n ;
			document.getElementById("board").style.borderRadius = wdt/2+"px";
			for (var i in cid){
				for (var j in cid[i]){
					n = document.getElementById( cid[i][j]);
					if (n == undefined){continue;}
					n.style.width = wdt*.95+"px";
					n.style.height = wdt*.65+"px";
					n.style.paddingTop = wdt*.3+"px";
					n.style.borderRadius = wdt /2 + "px";	
					n.style.left=document.getElementById("cell-"+i+"-"+j).offsetLeft +"px";
					n.style.top=document.getElementById("cell-"+i+"-"+j).offsetTop +"px";
					
					
				}
			}
			
		};
		var destroy = function(x,y){
			var me = document.getElementById(cid[x][y]);
			cid[x][y] =0
			window.setTimeout(function(){me.remove();
			;},130);
		};
		
		
		var move = function(x,y, nx, ny){
			var me = document.getElementById(cid[x][y]);
			
			me.style.left=document.getElementById("cell-"+nx+"-"+ny).offsetLeft +"px";
			me.style.top=document.getElementById("cell-"+nx+"-"+ny).offsetTop+"px";
			me.style.transition = ".13s ease-out";
			cid[nx][ny]=cid[x][y];
			cid[x][y] =0 ;
			return me;

			
		};
		var upgrade = function(x,y, nx, ny,val){
			var me = move(x,y, nx, ny);
			me.className=me.className.replace(/piece\-[1-9]*/, "piece-"+val);
			me.innerHTML = val ;
			
		};
		
		
		var notif = function(msg){
			var x=0,y=1;
			if(/new/.test(msg['type'])){
				p_fac(msg['to'][x], msg['to'][y], msg['val']);
			}if(/delete/.test(msg['type'])){
				destroy(msg['to'][x], msg['to'][y]);
			}if(/move/.test(msg['type'])){
				move(msg['frm'][x], msg['frm'][y], msg['to'][x], msg['to'][y]);
			}if(/upgrade/.test(msg['type'])){
				upgrade(msg['frm'][x], msg['frm'][y], msg['to'][x], msg['to'][y], msg['val']);
			}
				
		
		};
		
		window.addEventListener('resize', resize);
		wdt = document.getElementsByClassName('cell')[0].clientWidth;
		return {notif:notif,
		resize:resize}
	})();
	
	var j_c = (function(){
		var brd = document.getElementById("board");
		var abs = function(n){return (n>0?n:-n);}
		var tx=-1, ty=-1;
		var upt;
		var mntf = function(msg){
			j_v.notif(msg);
		};

		var shift = function(dir){
			j_m.shift(dir)
		};
		window.setTimeout(j_v.resize, 0);
		window.addEventListener("keyup", function(e){ 
		if(e.keyCode == 38){shift('up');}
		if(e.keyCode == 37){shift('left');}
		if(e.keyCode == 39){shift('right');}
		if(e.keyCode == 40){shift('down');}
	});
		brd.addEventListener("touchstart", function(e){
			tx = e.touches[0].clientX;
			ty = e.touches[0].clientY;	});
		
		brd.addEventListener("touchmove", function(e){e.preventDefault();upt = e;});
		window.addEventListener("touchend", function(e){
			if 	(upt==undefined || upt.touches.length<1){return;}
			var x = upt.touches[0].clientX;
			var y = upt.touches[0].clientY;	
			
			if (tx <0 && ty<0){return;}
			
			var xa = tx-x;
			var ya = ty-y;
			
			if (abs(xa)> abs(ya) && xa>0){shift("left");}
			if (abs(xa)> abs(ya) && xa<0){shift("right");}
			if (abs(xa)< abs(ya) && ya>0){shift("up");}
			if (abs(xa)< abs(ya) && ya<0){shift("down");}
			
			
			tx=-1;
			ty=-1;
			});	
			
		brd.addEventListener("touchend", function(e){
			if 	(upt==undefined || upt.touches.length<1){return;}
			var x = upt.touches[0].clientX;
			var y = upt.touches[0].clientY;	
			
			if (tx <0 && tv<0){return;}
			
			var xa = tx-x;
			var ya = ty-y;
			
			if (abs(xa)> abs(ya) && xa>0){shift("left");}
			if (abs(xa)> abs(ya) && xa<0){shift("right");}
			if (abs(xa)< abs(ya) && ya>0){shift("up");}
			if (abs(xa)< abs(ya) && ya<0){shift("down");}
			
			
			tx=-1;
			ty=-1;
			
			});	
			
	window.addEventListener("resize", j_v.resize);
	
		return {mntf:mntf,
		shift:shift}
	})();


	var j_m = (function(){

		var startval = [2,4,8,16];
		var startweight = [85, 10, 4, 1]
		var tweight=0;
		var brd = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		var rand = function(btm, tp){
			var l= Math.random() *(tp-btm +1) +btm;
			return l;
		};
		var randNew = function(){
			var num = rand(0, tweight);
			var t=0;
			for (var i=0; i<startweight.length;i++){
				t=t+startweight[i];
				if (num <= t){
					return startval[i];
				}
			}
		};
				
		var newp = function(){
			var x = Math.floor(rand(0,3)),y = Math.floor(rand(0,3));
			while (brd[x][y] !=0){x = Math.floor(rand(0,3)),y = Math.floor(rand(0,3));}
			
			var val = randNew() || 2;
			brd[x][y] = val;
			pushn({type:"new", to:[x, y], val:val})
		};
			
		var pushn = function(msg){
			j_c.mntf(msg);
		};
		var move = function(x,y,nx,ny){
			var i =x+nx,j=y+ny;
			if (brd[x][y] == 0){return false;}
			if (brd[i][j] ==  brd[x][y]){
				brd[i][j] = brd[i][j] + brd[x][y];
				brd[x][y] =0;
				pushn({type:"delete", to:[i,j]});
				pushn({type:'upgrade', to:[i,j], frm:[x,y], val:brd[i][j]});
				return true;
			}else if(brd[i][j] == 0){ //&& !((x-nx) >=0 && (x-nx) < 4 && (y-ny) >=0 && (y-ny) < 4 && brd[x][y] == brd[x-nx][y-ny])){
				brd[i][j] = brd[x][y];
				brd[x][y] =0;
				pushn({type:'move', to:[i,j], frm:[x,y], val:brd[i][j]});
				return true;
			}
	
			return false;
		};
		
		var shift = function(dir){
			var n =false;
			for ( var i=1 ; i <4; i++){
				for (var j=0; j<4;j++){
					if (/up/i.test(dir)){
						if( move(i,j, -1, 0)){n=true;}
					}else if (/down/i.test(dir)){
						if( move(3-i,j, 1, 0)){n=true;}
					}else if (/left/i.test(dir)){
						if(move(j,i, 0, -1)){n=true;}
					}else if (/right/i.test(dir)){
						if(move(j,3-i, 0, 1)){n=true};
					}	

				}
			}
			if(n){newp();}
			
		};
		
		for (var i=0;i< startweight.length;i++){tweight+=startweight[i];}
		newp();
		newp();
		return {
		shift:shift};
	})();
	
};



window.onload = function(){
	j_g();
	
	
};

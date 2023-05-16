//création du canvas et la base du jeu
window.onload = function(){
		var canvasWidth = 900;
		var canvasHeight = 600;
		var blockSize = 30;
		var ctx;	// declaration du context ou le restangle dans le canvas
		var delai = 100; //declaration d'un delai qui controlera la vitesse de deplacement du rectangle;
		var snakee;
		var applee;
		var widthInBlock = canvasWidth/blockSize;
		var heightInBlock = canvasHeight/blockSize;
		var score;
		var timeout;
		init();

	function init(){ //fonction d'initialisation de la position
		var canvas = document.createElement('canvas'); //"canvas" est un element html pour dessiner
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "20px solid green";
		canvas.style.margin = "50px auto";
		canvas.style.display = "block";
		canvas.style.backgroundColor = "black";
		document.body.appendChild(canvas); //fonction qui fait accrocher un element créé dans un js dans un element de la html, ici, on a accroché le canvas au body
		ctx = canvas.getContext('2d'); //type de dessin
		snakee = new snake([[7,4],[6,4],[5,4],[4,4],[3,4]],"right");
		applee = new apple([10,10]);
		score = 0;
		actualiserCanvas();
	}

	function actualiserCanvas(){ //foncton actualisation de la postion par rapport au delai
		snakee.avancer();
		if (snakee.checkCollision()){ 
			gameOver();
		} else {
			if (snakee.isItEatingApple(applee)){
				score++;
				snakee.ateApple = true;
				do {
					applee.setNewPosition();
				}
				while (applee.isOnSnake(snakee));
			}
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			drawScore();

			snakee.draw();
			applee.draw();	
			timeout = setTimeout(actualiserCanvas,delai);
				
		}
		
	}
	function gameOver() {
		ctx.save();
		ctx.font = "bold 70px sans-serif";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		var centerX = canvasWidth /2;
		var centerY = canvasHeight/2;
		ctx.strokeText("Game Over", centerX, centerY - 180);
		ctx.fillText("Game Over", centerX, centerY - 180);
		ctx.font = "bold 30px sans-serif";
		ctx.strokeText("Appuiez sur la touche Espace pour rejouer", centerX, centerY - 120);
		ctx.fillText("Appuiez sur la touche Espace pour rejouer", centerX, centerY - 120);
		ctx.restore();
	}

	function restart() {
		snakee = new snake([[7,4],[6,4],[5,4],[4,4],[3,4]],"right");
		applee = new apple([10,10]);
		score = 0;
		clearTimeout(timeout);
		actualiserCanvas();
	}

	function drawScore() {
		ctx.save();
		ctx.font = "bold 200px sans-serif";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		var centerX = canvasWidth /2;
		var centerY = canvasHeight/2;
		ctx.fillText(score.toString(), centerX, centerY);
		ctx.restore();
	}

	function drawBlock(ctx, position) {
		var x = position[0]*blockSize;
		var y = position[1]*blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
	}

	function snake(body, direction) {
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = "MediumSeaGreen";
			for (var i = 0; i < this.body.length; i++){
				drawBlock(ctx, this.body[i]);
			}
			ctx.restore();
		};

		this.avancer = function () {
			var nextPosition = this.body[0].slice();
			switch(this.direction) {
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				case "up":
					nextPosition[1] -= 1;
					break;
				default : 
					throw("Direction invalide");

			}
			this.body.unshift(nextPosition);
			if(!this.ateApple)
				this.body.pop();
			else
				this.ateApple = false;
		};

		this.setDirection = function(newDirection) {
			var allowedDirections;
			switch(this.direction) {	
				case "left":
				case "right":
					allowedDirections = ["up", "down"];
					break;
				case "down":
				case "up":
					allowedDirections = ["left", "right"];
					break;
				default :
					throw("Direction invalide");
			}
			if(allowedDirections.indexOf(newDirection) > -1 ) {
				this.direction = newDirection;
			}
		};

		this.checkCollision = function() {
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0];
			var rest = this.body.slice(1);
			var snakeX = head[0];
			var snakeY = head[1];
			var minX = 0;
			var minY = 0;
			var maxX = widthInBlock - 1;
			var maxY = heightInBlock - 1;
			var notWallHorizontal = snakeX < minX || snakeX > maxX;
			var notWallVertical = snakeY < minY || snakeY > maxY;

			if (notWallVertical || notWallHorizontal) {
				wallCollision = true;
			}

			for (var i = 0; i < rest.length; i ++) {
				if(snakeX === rest[i][0] && snakeY === rest[i][1]) {
					snakeCollision = true;
				}
			}
			return wallCollision || snakeCollision;
		};

		this.isItEatingApple = function (appleToEat) {
			var head = this.body[0];
			if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
				return true;
			else 
				return false;
		};
	}
	

	function apple(position) {
		this.position = position;
		this.draw = function() {
			ctx.save();
			ctx.fillStyle = "#ff0000";
			ctx.beginPath();
			var radius = blockSize/2;
			var x = this.position[0]*blockSize + radius;
			var y = this.position[1]*blockSize + radius;
			ctx.arc(x,y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};

		this.setNewPosition = function () {
			var newX = Math.round(Math.random()*(widthInBlock - 1));
			var newY = Math.round(Math.random()*(heightInBlock - 1));
			this.position = [newX, newY];
		};

		this.isOnSnake = function(snakeToCheck) {
			var isOnSnake = false;
			for ( var i = 0; i<snakeToCheck.body.length; i++) {
				if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
					isOnSnake = true;
				}
			}
			return isOnSnake;
		};
	}

	document.onkeydown = function handleKeyDown(e) {
		var key = e.keyCode;
		var newDirection;
		switch(key) {
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;  
			case 40:
				newDirection = "down";
				break;
			case 32:
				restart();
				return;
			default:
				return;
		}
		snakee.setDirection(newDirection);
	}

}

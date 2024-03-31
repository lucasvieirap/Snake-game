const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

class GameObject {
	constructor(_x, _y, _color) {
		this.pos = {
			x: _x,
			y: _y,
		};
		this.color = _color;
	}
	draw () {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.pos.x*25, this.pos.y*25, 25, 25);
	}
}

class Player {
	constructor (_x, _y, _color, _startMov) {
		this.body = {
			head: {x: _x, y: _y},
			tail: [],
		}
		this.movement = _startMov;
		this.color = _color;
	};

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.body.head.x*25, this.body.head.y*25, 25, 25);
		this.body.tail.map(block => {
			ctx.fillRect(block.x*25, block.y*25, 25, 25);
		})
	};

	move () {
		for (let i = this.body.tail.length; i > 0; i--) {
			if (this.body.tail[i]) {
				this.body.tail[i].x = this.body.tail[i-1].x;
				this.body.tail[i].y = this.body.tail[i-1].y;
			}
		}
		if (this.body.tail[0]) {
			this.body.tail[0].x = this.body.head.x;
			this.body.tail[0].y = this.body.head.y;
		}

		switch (this.movement) {
		case "right":
			this.body.head.x += 1;
			break;
		case "left":
			this.body.head.x -= 1;
			break;
		case "up":
			this.body.head.y -= 1;
			break;
		case "down":
			this.body.head.y += 1;
			break;
		default:
			break;
		}
	}
	
};

let PlayerObj = new Player(0, 0, "green", "none");
let AppleObj = new GameObject(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20), "red");

document.addEventListener('keydown', (e) => {
	switch (e.keyCode) {
	case 83:
		PlayerObj.movement == "up" ? PlayerObj.movement = "up" : PlayerObj.movement = "down";
		break;
	case 68:
		PlayerObj.movement == "left" ? PlayerObj.movement = "left" : PlayerObj.movement = "right";
		break;
	case 87:
		PlayerObj.movement == "down" ? PlayerObj.movement = "down" : PlayerObj.movement = "up";
		break;
	case 65:
		PlayerObj.movement == "right" ? PlayerObj.movement = "right" : PlayerObj.movement = "left";
		break;
	}
})

setInterval(() => {
	PlayerObj.move();

	if (checkCollision(PlayerObj.body.head, AppleObj.pos)) {
		AppleObj.pos = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
		PlayerObj.body.tail.push({x: -1, y: -1});
	};

	PlayerObj.body.tail.map(block => {
		if (checkCollision(PlayerObj.body.head, block)) {
			PlayerObj.body.tail = [];
			PlayerObj.body.head = {x: 0, y: 0};
			PlayerObj.movement = "none";
			AppleObj.pos = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
		}
	})

	if (checkOutOfBoundaries(PlayerObj.body.head)) {
		PlayerObj.body.tail = [];
		PlayerObj.body.head = {x: 0, y: 0};
		PlayerObj.movement = "none";
		AppleObj.pos = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
	};

	render(PlayerObj, AppleObj);
}, 200);

function checkCollision(pos1, pos2) {
	if (pos1.x == pos2.x && pos1.y == pos2.y) {
		return true;
	}
	return false;
}

function render(...gameObjects) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameObjects.map(gameObject => gameObject.draw());
}

function checkOutOfBoundaries(pos) {
	if (pos.x > 20 || pos.y > 20 || pos.x < 0 || pos.y < 0) {
		return true;
	}
	return false;
}

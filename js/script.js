const colorAudio = {
	"red": document.getElementById("red"),
	"blue": document.getElementById("blue"),
	"green": document.getElementById("green"),
	"yellow": document.getElementById("yellow")
}

class Colors {
	constructor() {
		this.colors = ["red", "blue", "green", "yellow"];
		this.active = false;
		this.colorElems = document.getElementsByClassName("color");
		for(let colorElem of this.colorElems)
			colorElem.addEventListener("click", this.colorElemClick.bind(this));
	}

	clickActivate() {
		this.active = true;
		for(let colorElem of this.colorElems)
			colorElem.style.cursor = "pointer";
	}

	clickDeactivate() {
		this.active = false;
		for(let colorElem of this.colorElems)
			colorElem.style.cursor = "default";
	}

	clickIsActive() {
		return this.active;
	}
	colorElemClick(event) {
		let target = event.target;
		if(this.active && target.classList.contains("color")) {
			this.colorElemBlink(target);
		}
	}

	colorElemBlink(colorElem) {
		let color = colorElem.classList[0];
		if(colorAudio[color]) {
			colorElem.classList.replace(color, color + '-light');
			colorAudio[color].play();
			setTimeout(() => colorElem.classList.replace(color + '-light', color), 300);
		}
		else
			return;
	}

	getColorElem(color) {
		for(let colorElem of this.colorElems)
			if (colorElem.classList.contains(color) || colorElem.classList.contains(color + '-light'))
				return colorElem;
	}

	getRandomColor() {
		return this.colors[Math.floor(4*Math.random())];
	}
}


class Simon extends Colors{
	constructor() {
		super();
		this.colorSequence = [];
		this.userSequence = [];
		this.winnerSequence = ["red", "green", "yellow", "blue"];
		this.gameWon = false;
		this.winCount = 10;
		this.counter = 0;
		this.playerActivate = false;
		this.strict = false;
		this.counterView = document.getElementsByClassName('count')[0];
		this.counterView.textContent = this.counter;
		document.getElementsByClassName("start")[0].addEventListener("click", () => this.start());
		document.getElementsByClassName("strict")[0].addEventListener("click", (event) => this.toggleStrict(event));
	}

	reset() {
		this.colorSequence = [];
		this.userSequence = [];
		this.gameWon = false;
		this.counter = 0;
		this.counterView.textContent = this.counter;
		this.playerActivate = false;
	}

	start() {
		this.reset();
		this.changeTurn(true);
	}

	changeTurn(appendColor) {
		if(!this.playerActivate){
			if(appendColor)
				this.extendColorSequence();
			this.playColors();
		}
		else {
			this.userSequence = [];
			this.playerTurn();
		}
	}

	playerTurn() {
		this.clickActivate();
	}

	incrementCounter() {
		this.counter++;
		if(this.counter >= this.winCount)
			this.counterView.textContent = "WIN!";
		else
			this.counterView.textContent = this.counter;
	}

	extendColorSequence() {
		this.colorSequence.push(this.getRandomColor());
	}

	playColors() {
		let waitTime = 0;
		let pause = this.gameWon? 300 : 1000;
		for(let color of this.colorSequence) {
			let colorElem = this.getColorElem(color);
			setTimeout(() => this.colorElemBlink(colorElem), waitTime * pause + pause);
			waitTime++;
		}
		if(!this.gameWon) {
			this.playerActivate = true;
			setTimeout(()=>this.changeTurn(false),waitTime * 1000 + 500);
		}
	}

	colorElemClick(event) {
		let color;
		let matched;
		let target = event.target;
		if(this.clickIsActive()) {
			color = target.classList[0];
			this.clickDeactivate();
			this.playerActivate = false;
			this.colorElemBlink(target);
			this.userSequence.push(color);
			matched = this.sequenceMatch();
			if(matched && (this.userSequence.length === this.colorSequence.length)){
				this.incrementCounter();
				this.gameWon = this.checkWin();
				if(!this.gameWon)
					setTimeout(()=>this.changeTurn(true), 500);
				else {
					this.colorSequence = [...this.winnerSequence, ...this.winnerSequence, ...this.winnerSequence, ...this.winnerSequence, ...this.winnerSequence];
					setTimeout(()=>this.playColors(), 500);
				}
			}
			else if(matched)
				setTimeout(()=>this.playerTurn(), 350);
			else {
				this.warnPlayer();
				if(this.strict)
					setTimeout(()=>this.start(), 500);
				else
					this.changeTurn(false);
			}
		}
	}

	sequenceMatch() {
		return this.userSequence.every((color, index) =>color.includes(this.colorSequence[index]));
	}

	toggleStrict(event) {
		this.strict = !this.strict;
		if(this.strict)
			event.target.classList.replace("off", "on")
		else
			event.target.classList.replace("on", "off")
	}

	checkWin() {
		return this.counter >= this.winCount;
	}

	warnPlayer() {
		this.counterView.textContent = "!!";
		setTimeout(() => this.counterView.textContent = this.counter, 1000);
	}
}


x = new Simon();



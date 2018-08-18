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

	activate() {
		this.active = true;
		for(let colorElem of this.colorElems)
			colorElem.style.cursor = "pointer";
	}

	deactivate() {
		this.active = false;
		for(let colorElem of this.colorElems)
			colorElem.style.cursor = "default";
	}

	isActive() {
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
			alert("error occored");
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
		this.counter = 0;
		this.playerActivate = false;
		this.strict = false;
		this.counterView = document.getElementsByClassName('count')[0];
		this.counterView.textContent = this.counter;
		document.getElementsByClassName("start")[0].addEventListener("click", () => this.start());
		document.getElementsByClassName("strict")[0].addEventListener("click", (event) => this.toggleStrict(event));
	}

	incrementCounter() {
		this.counter++;
		this.counterView.textContent = this.counter;
	}

	extendColorSequence() {
		this.colorSequence.push(this.getRandomColor());
	}

	playColors() {
		let waitTime = 0;
		for(let color of this.colorSequence) {
			let colorElem = this.getColorElem(color);
			setTimeout(() => this.colorElemBlink(colorElem), waitTime * 1000 + 1000);
			waitTime++;
		}
		this.playerActivate = true;
		setTimeout(()=>this.changeTurn(false),waitTime * 1000 + 1000);
	}

	start() {
		this.colorSequence = [];
		this.userSequence = [];
		this.counter = 0;
		this.counterView.textContent = this.counter;
		this.playerActivate = false;
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
		this.activate();
	}

	colorElemClick(event) {
		let color;
		let matched;
		let target = event.target;
		if(this.isActive()) {
			color = target.classList[0];
			this.deactivate();
			this.playerActivate = false;
			this.colorElemBlink(target);
			this.userSequence.push(color);
			matched = this.match();
			if(matched && (this.userSequence.length === this.colorSequence.length)){
				this.incrementCounter();
				setTimeout(()=>this.changeTurn(true), 500);
			}
			else if(matched)
				setTimeout(()=>this.playerTurn(), 500);
			else {
				if(this.strict)
					this.start();
				else
					this.changeTurn(false);
			}
		}
	}

	match() {
		return this.userSequence.every((color, index) =>color.includes(this.colorSequence[index]));
	}

	toggleStrict(event) {
		this.strict = !this.strict;
		if(this.strict)
			event.target.classList.replace("off", "on")
		else
			event.target.classList.replace("on", "off")
	}
}

x = new Simon();



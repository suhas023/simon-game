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
			colorElem.addEventListener("click", this.colorClick.bind(this));
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

	colorClick(event) {
		let target = event.target;
		if(this.active && target.classList.contains("color")) {
			this.colorBlink(target);
		}
	}

	colorBlink(colorElem) {
		let color = colorElem.classList[0];
		colorElem.classList.replace(color, color + '-light');
		colorAudio[color].play();
		setTimeout(()=>colorElem.classList.replace(color + '-light', color), 300);
	}

	getColorElem(color) {
		for(let colorElem of this.colorElems)
			if (colorElem.classList.contains(color))
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
		this.counter = 0;
		this.counterView = document.getElementsByClassName('count')[0];
		this.counterView.textContent = this.counter;

		this.strict = false;
	}

	incrementCounter() {
		this.counter++;
		this.counterView.textContent = this.counter;
	}

}

x = new Simon();
x.activate();

// console.log(x.getColorElem("blue"))
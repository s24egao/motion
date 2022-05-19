const bg = p => {
	let objects = []
	let values = [
		{ v: 0, target: 0, random_max: 1000, colddown: 30},
		{ v: 0, target: 0, random_max: 1000, colddown: 30},
		{ v: 0, target: 0, random_max: 800, colddown: 30},
		{ v: 0, target: 0, random_max: p.HALF_PI, colddown: 30},
		{ v: 0, target: 0, random_max: p.PI, colddown: 30}
	]
	let colors = ['#E56399', '#0D2648', '#035E7B', '#93C6D6', '#eeeeee']
	let background
	let mouse_idle = 0

	class Particle {
		constructor() {
			this.x = p.random(values[0].v - 1200, values[0].v + 1200)
			this.y = p.random(values[1].v - 1200, values[1].v + 1200)
			this.z = p.random(values[2].v - 600, values[2].v - 200)
			this.s = p.random(5, 50)
			let n = p.floor(p.random(colors.length))
			this.c = colors[n]
			this.c2 = colors[(n + p.floor(p.random(1, colors.length))) % colors.length]
			this.life = p.random(150, 300)
			this.r = Math.floor(p.random(0, 4)) * p.HALF_PI
			this.offset = p.random(50, 2000)
		}

		update() {
			if(this.life < 30) this.s *= 0.9
			this.offset *= 0.95
			p.push()
			p.translate(this.x, this.y, this.z)
			p.rotateZ(this.r)
			if(this.c == background) {
				p.strokeWeight(3)
				p.fill(this.c2)
				p.square(this.offset, 0, this.s * 8)
			} else {
				p.fill(this.c)
				p.circle(this.offset, 0, this.s)
			}
			p.pop()
			this.life--
		}
	}

	class Ripple {
		constructor() {
			this.x = p.random(values[0].v - 1200, values[0].v + 1200)
			this.y = p.random(values[1].v - 1200, values[1].v + 1200)
			this.z = p.random(values[2].v - 600, values[2].v - 200)
			this.s = p.random(20, 30)
			this.s2 = p.random(200, 500)
			let n = p.floor(p.random(colors.length))
			this.c = (colors[n] != background)? colors[n] : colors[(n + p.floor(p.random(1, colors.length))) % colors.length]
			this.life = 30
		}

		update() {
			this.s = p.lerp(this.s, this.s2, 0.2)
			p.push()
			p.translate(this.x, this.y, this.z)
			p.stroke(this.c)
			p.strokeWeight(this.life / 3)
			p.ellipse(0, 0, this.s, this.s, 50)
			p.pop()
			this.life--
		}
	}

	class Line {
		constructor() {
			this.x = p.random(values[0].v - 1200, values[0].v + 1200)
			this.y = p.random(values[1].v - 1200, values[1].v + 1200)
			this.z = p.random(values[2].v - 600, values[2].v - 200)
			this.l = p.random(300, 1000)
			this.w = p.random(6, 12)
			let n = p.floor(p.random(colors.length))
			this.c = (colors[n] != background)? colors[n] : colors[(n + p.floor(p.random(1, colors.length))) % colors.length]
			this.life = 60
			this.r = Math.floor(p.random(0, 4)) * p.HALF_PI
		}

		update() {
			p.push()
			p.translate(this.x, this.y, this.z)
			p.rotateZ(this.r)
			p.stroke(this.c)
			p.strokeWeight(this.w)
			p.line(this.l * p.pow(0.85, p.max(30 - this.life / 2, 1)), 0,
			 this.l * p.pow(0.85, p.max(20 - this.life / 2, 1)), 0)
			p.pop()
			this.life--
		}
	}

	class Circle {
		constructor() {
			this.x = p.random(values[0].v - 1200, values[0].v + 1200)
			this.y = p.random(values[1].v - 1200, values[1].v + 1200)
			this.z = p.random(values[2].v - 600, values[2].v - 200)
			this.r = 0
			let n = p.floor(p.random(colors.length))
			this.c = (colors[n] != background)? colors[n] : colors[(n + p.floor(p.random(1, colors.length))) % colors.length]
			this.life = 300
		}

		update() {
			p.push()
			p.translate(this.x, this.y, this.z)
			p.rotateZ(this.r)
			p.fill(this.c)
			p.strokeWeight(this.w)
			for(let i = 0; i < 36; i++) {
				p.rect(1000 * (1 - p.pow(0.85, p.max(120 - this.life / 2, 0))), 0, 10, 100 * p.pow(0.85, p.max(30 - this.life, 0)))
				p.rotateZ(p.TWO_PI / 36)
			}
			p.pop()
			this.r += 0.01
			this.life--
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
		background = p.random(colors)
		p.noStroke()
		p.noFill()
		p.rectMode(p.CENTER)
		p.ellipseMode(p.CENTER)
		for(let i = 0; i < 60; i++) { objects.push(new Particle()) }
		objects.push(new Circle())
	}

	p.draw = () => {
		p.updateValues()
		if(!p.mouseIsPressed) p.background(background)
		p.rotateZ(values[3].v)
		p.rotateZ(values[4].v)
		p.translate(-values[0].v + (p.noise(p.frameCount / 180) - 0.5) * 1000, -values[1].v + (p.noise((p.frameCount + 10) / 180) - 0.5) * 1000, -values[2].v)
			
		for(let o of objects) { o.update() }

		objects.push(new Particle())
		objects.push(new Line())
		if(p.frameCount % 5 == 0) objects.push(new Ripple())
		if(p.frameCount % 120 == 0) objects.push(new Circle())

		objects = objects.filter(o => o.life > 0)

		if(p.movedX ==0 && p.movedY == 0) {
			mouse_idle++
			if(mouse_idle > 120) p.noCursor()
		} else {
			mouse_idle = 0
			p.cursor()
		}
	}

	p.updateValues = () => {
		for(let value of values) {
			value.v = p.lerp(value.v, value.target, 0.05)
			value.colddown--
			if(value.colddown <= 0) {
				value.target += p.random(-value.random_max, value.random_max)
				value.colddown = p.random(60, 300)
			}
		}
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}

new p5(bg, 'bg')
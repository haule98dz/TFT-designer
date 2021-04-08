class Elements {
    constructor(context, x, y, color = "#000000") {
        this.context = context
        this.x = x
        this.y = y
        this.color = color
        this.seleted = false
        this.firstCreated = true
        this.id = 0
        this.updatePos()
    }
    updatePos() {
        this.xdraw = scale * this.x + border.x
        this.ydraw = scale * this.y + border.y
    }
}

class Prop {
    constructor(name, value, type) {
        this.name = name
        this.value = value
        this.type = type
        if (this.type == "color" || this.type == "text") {
            this.value = '"' + this.value + '"'
        }
    }
}

class Pixel extends Elements {
    constructor(context, x, y, color = "#000000") {
        super(context, x, y, color)
    }

    draw() {
        this.updatePos()
        this.context.fillStyle = this.color
        this.context.fillRect(this.xdraw, this.ydraw, scale, scale)
        //this.context.fillRect(this.xdraw, this.ydraw, 1, 1)
    }

    getCode() {
        return "drawPixel(" + this.x + ", " + this.y + ", " + color24ToInt16(this.color) + ");"
    }

    getProperties() {
        return [
            new Prop("X", this.x, "number"),
            new Prop("Y", this.y, "number"),
            new Prop("Color", this.color, "color")
        ]
    }
    setProperties(arr) {
        this.x = arr[0]
        this.y = arr[1]
        this.color = arr[2]
    }
}

class Line extends Pixel {
    constructor(context, x, y, x2, y2, color = "#000000") {
        super(context, x, y, color)
        this.x2 = x2
        this.y2 = y2
    }

    draw() {
        if (this.firstCreated && mouse.left) {
            this.x2 = mouse.xscreen
            this.y2 = mouse.yscreen
        } else {
            this.firstCreated = false
        }
        if (currentLine == this.id)

        var x0 = this.x
        var y0 = this.y
        var x1 = this.x2
        var y1 = this.y2
        var dx = Math.abs(x1 - x0)
        var dy = Math.abs(y1 - y0)
        var sx, sy, err
        if (x0 < x1) sx = 1; else sx = -1;
        if (y0 < y1) sy = 1; else sy = -1;
        err = dx - dy
        this.updatePos()
        var r = 1.5 * scale
        if (this.seleted && !this.firstCreated) {
            context.beginPath()
            context.arc(this.xdraw + 0.5 * scale, this.ydraw + 0.5 * scale, r, 0, 2 * Math.PI)
            context.stroke()
        }

        while (true) {
            (new Pixel(this.context, x0, y0, this.color)).draw()
            if (x0 == x1 && y0 == y1) break
            var e2 = err << 1 //2*err
            if (e2 > -dy) {
                err = err - dy
                x0 = x0 + sx
            }
            if (e2 < dx) {
                err = err + dx
                y0 = y0 + sy
            }
        }
        if (this.seleted && !this.firstCreated) {
            context.beginPath()
            context.arc((this.x2 + 0.5) * scale + border.x, (this.y2 + 0.5) * scale + border.y, r, 0, 2 * Math.PI)
            context.stroke()
        }
    }

    getCode() {
        return "drawLine(" + this.x + ", " + this.y + ", " + this.x2 + ", " + this.y2 + ", " + color24ToInt16(this.color) + ");"
    }
}
document.getElementById("inputWidth").value = 32
document.getElementById("inputHeight").value = 32

canvas = document.getElementById("gc")
context = canvas.getContext("2d")
context.lineWidth = 1;

var tool = 'none'
$('#none').css('background-color', 'aquamarine')
var grid = false
var editing = false

var w, h
var lineNumber = 0
var currentLine = -1
var trans = {
    x: 0,
    y: 0,
    update(dx, dy) {
        this.x += dx
        this.y += dy
        context.translate(dx, dy)
    },
    default() {
        context.translate(-this.x, -this.y)
        this.x = 0;
        this.y = 0;
    }
}

var scale = 1;

var elements = new Array();
var mouse = {
    x: 0,
    y: 0,
    xdraw: 0,
    ydraw: 0,
    left: 0,
    middle: 0,
    right: 0,
    xold: 0,
    yold: 0,
    xscreen: 0,
    yscreen: 0,
    update() {
        this.xdraw = this.x - trans.x
        this.ydraw = this.y - trans.y
        this.xscreen = Math.floor((this.xdraw - border.x) / scale)
        this.yscreen = Math.floor((this.ydraw - border.y) / scale)
        document.getElementById("coordinate").innerText = "(x, y) = (" + this.xscreen + ", " + this.yscreen + " )"
    }
}

var border = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    wreal: 0,
    hreal: 0,
    updateRealPx() {
        border.w = border.wreal * scale
        border.h = border.hreal * scale
    },

    draw() {
        context.beginPath();
        context.rect(border.x, border.y, border.w, border.h);
        context.stroke();
        //draw grid ticks
        context.fillStyle = "#000000"
        context.textAlign = "center"
        context.textBaseline = "middle";
        var fsize = 0.4 * scale
        context.font = fsize + "px Arial"
        const ticklengfactor = 0.4
        if (fsize > 2) {
            context.beginPath()
            var ipx = 0, i = 0
            while (ipx < border.w) {
                if (grid)  {
                    context.moveTo(ipx + border.x, border.y + border.h)
                }
                else context.moveTo(ipx + border.x, border.y)
                context.lineTo(ipx + border.x, border.y - ticklengfactor * scale)

                if (i < border.wreal) context.fillText(i, ipx + border.x + scale * 0.5, border.y - ticklengfactor * scale);
                ipx += scale
                i++
            }
            ipx = i = 0
            while (ipx < border.h) {
                if (grid) {
                    context.moveTo(border.x + border.w, ipx + border.y)
                } else context.moveTo(border.x, ipx + border.y)
                context.lineTo(border.x - ticklengfactor * scale, ipx + border.y)

                if (i < border.hreal) context.fillText(i, border.x - ticklengfactor * scale, ipx + border.y + scale * 0.5);
                ipx += scale
                i++
            }
            context.stroke();
        }
    }
}

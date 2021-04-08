canvas.addEventListener('mousedown', e => {
    switch (e.button) {
        case 0:
            mouse.left = 1;
            addElement()
            break;
        case 1:
            mouse.middle = 1;
            break;
        case 2:
            mouse.right = 1;
    }
});

canvas.addEventListener('mousemove', e => {
    mouse.xold = mouse.x
    mouse.yold = mouse.y
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    if (mouse.middle) {
        var dx = mouse.x - mouse.xold
        var dy = mouse.y - mouse.yold
        trans.x += dx
        trans.y += dy
        context.translate(dx, dy)
    }
    mouse.update()
});

window.addEventListener('mouseup', e => {
    mouse.left = 0;
    mouse.middle = 0;
    mouse.right = 0;
});

function zoom(event) {
    event.preventDefault();
    var factor = 1.2
    mouse.update()
    if (event.deltaY < 0) {
        scale *= factor
        var dx = (mouse.xdraw) * (1 - factor)
        var dy = mouse.ydraw * (1 - factor)
        border.x *= factor
        border.y *= factor
        trans.update(dx, dy)
    } else {
        scale /= factor
        border.x /= factor
        border.y /= factor
        trans.update(mouse.xdraw * (1 - 1 / factor), mouse.ydraw * (1 - 1 / factor))
    }
    border.updateRealPx()

    // Restrict scale
    //scale = Math.min(scale, 10)
    //scale = Math.max(scale, 0.1)
}

document.querySelector('canvas').onwheel = zoom;
setResolution()
setInterval(loop, 40)

function loop() {
    context.fillStyle = "#ffffff"
    context.fillRect(-trans.x, -trans.y, canvas.width, canvas.height)
    border.draw()

    elements.forEach(element => {
        element.draw();
    });

}

function editElement(id) {
    if (currentLine != -1) {
        $('#codeline' + currentLine).css("color", "black")
        elements[id].selected = false
    }
    currentLine = id
    elements[id].selected = true
    showProperties(id)

}

function addElement() {
    var x = mouse.xscreen
    var y = mouse.yscreen
    var color =  $('#colorPicker').val()
    
    switch (tool) {
        case 'pixel':
            elements.forEach(element => {
                element.selected = false
            });
            elements.push(new Pixel(context, x, y, color))
            break
        case 'line':
            elements.forEach(element => {
                element.selected = false
            });
            elements.push(new Line(context, x, y, x, y, color))
            break
        default:
            return
    }

    var s = elements[elements.length - 1].getCode()
    $("#code").append('<p id="codeline' + lineNumber + '" >' + s + '</p>')
    with ($('#codeline' + lineNumber)) {
        click(function (event) {
            $(this).css("color", "blue")
            var id = event.target.id
            id = id.replace('codeline', '')
            editElement(parseInt(id))
        })
        css("color", "blue")
        css("cursor", "pointer")
    }
    editElement(lineNumber)
    lineNumber++
}

function updateCode(id) {
    $('#codeline' + id).text(elements[id].getCode())
}

/*
const inputHandler = function(e) {
    updateProperties(id)
}*/

function showProperties(id) {
    let props = elements[id].getProperties()
    let ht = $("#properties")
    ht.empty()
    ht.append('<legend>Properties of element ' + id + '</legend>')
    props.forEach((prop, i) => {
        ht.append('<label>' + prop.name + ':</label>')
        ht.append('</br>')
        ht.append('<input type="' + prop.type + '" id="inputprop' + i + '" value=' + prop.value + '></input>')
        ht.append('</br></br>')
        //document.getElementById('inputprop'+i).addEventListener('input', inputHandler)
        $("#inputprop" + i).on('change keydown paste input', function () {
            updateProperties(id, props.length);
        });
    });
}

function updateProperties(id, n) {
    var arr = new Array()
    for (i = 0; i < n; i++) {
        var v = $('#inputprop' + i).val()
        arr.push(v)
    }
    elements[id].setProperties(arr)
    updateCode(id);
}

function setResolution() {
    border.wreal = document.getElementById("inputWidth").value
    border.hreal = document.getElementById("inputHeight").value

    if (border.wreal / canvas.width > border.hreal / canvas.height) {
        scale = canvas.width / (border.wreal * 1.2)
    } else {
        scale = canvas.height / (border.hreal * 1.2)
    }
    border.updateRealPx()
    border.x = (canvas.width - border.w) / 2
    border.y = (canvas.height - border.h) / 2

    trans.default()
    mouse.update()
}

function toolClicked(id) {
    $('#'+tool).css('background-color', 'rgb(204, 204, 204')
    tool = id
    $('#'+tool).css('background-color', 'aquamarine')
}

function color24ToInt16(input) {
    let RGB888 = parseInt(input.replace(/^#/, ''), 16);
    let r = (RGB888 & 0xFF0000) >> 16;
    let g = (RGB888 & 0xFF00) >> 8;
    let b = RGB888 & 0xFF;

    r = (r * 249 + 1014) >> 11;
    g = (g * 253 + 505) >> 10;
    b = (b * 249 + 1014) >> 11;
    let RGB565 = 0;
    RGB565 = RGB565 | (r << 11);
    RGB565 = RGB565 | (g << 5);
    RGB565 = RGB565 | b;

    return "0x" + RGB565.toString(16);
}

function gridOnOff() {
    grid = $('#grid').is(':checked')
}


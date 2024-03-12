// Handle custom fonts
function loadFont(font) {
    const customFonts = ['Gotham Narrow']
    var text = canvas.getActiveObject()
    if (customFonts.includes(font)) {
        var myfont = new FontFaceObserver(font)
        myfont.load().then(function () {
            text.set("fontFamily", "");
            text.set("fontFamily", font);
            canvas.renderAll();
            $('#font-family').selectpicker('refresh')
        })
    } else {
        text.set("fontFamily", font);
        canvas.renderAll();
        $('#font-family').selectpicker('refresh')
    }
}

// Update edit methods values to the selected canvas text
function updateInputs() {
    var activeObject = canvas.getActiveObject()

    if (activeObject.get('type') == "text") {
        enableTextMethods()
        $('#text').val(activeObject.text)
        $('#font-family').val(activeObject.fontFamily).selectpicker('refresh')
        $('#text-color').val(activeObject.fill).selectpicker('refresh')
        $('#font-size').val(activeObject.fontSize)
        $(`input[value="${activeObject.textAlign}"]`).parent().trigger('update-status')
        $('#stroke-width').val(activeObject.strokeWidth)
        $('#shadow-depth').val(activeObject.shadow.blur)
        $('#bg-option').attr('data', activeObject.textBackgroundColor).trigger('update-status')
    }

    $('#opacity').val(parseInt(activeObject.opacity * 100))
    $('#scale').val(parseFloat(activeObject.scaleX))
}


function loadObjectHandlers() {
    // Interactive edit methods with canvas text 
    $('#text').off('input').on('input', function () {
        setValue("text", $(this).val())
    })

    $('#scale').off('input').on('input', function () {
        if (canvas.getActiveObject() != null) {
            var activeText = canvas.getActiveObject()
            activeText.scale(parseFloat(this.value)).setCoords();
            canvas.renderAll();
        }
    })


    $('#text-color').off('change').on('change', function () {
        $('#text-color').selectpicker('refresh')
        if (canvas.getActiveObject() != null) {
          setValue("fill", $(this).find(":selected").attr('value'))
        }
    })

    $('#font-family').off('change').on('change', function () {
        $('#font-family').selectpicker('refresh')
        if (canvas.getActiveObject() != null) {
            loadFont($(this).find(":selected").attr('value'))
        }
    })

    $('#font-size').off('input').on('input', function () {
        setValue("fontSize", $(this).val())
    })

    $('input[name="align"]').off('change').on('change', function () {
        setValue("textAlign", $(this).attr('id'))
    })

    $('#stroke-width').off('input').on('input', function () {
        var actualWidth=$(this).val()
        if (actualWidth == 0) {
            actualWidth = null
        }
        setValue("strokeWidth", actualWidth)
    })

    $('#shadow-depth').off('input').on('input', function () {
        setValue("shadow", createShadow('black', $('#shadow-depth').val()))
    })

    $('#opacity').off('input').on('input', function () {
        setValue("opacity", parseFloat($(this).val() / 100))
    })
}

/*****************************
 * Handle edit buttons style *
*****************************/

// Update style of font-style buttons
$('.edit-btn').on('update-status', function () {
    if ($(this).attr('data') == '') {
        $(this).removeClass('active')
    } else {
        $(this).addClass('active')
    }
})

//  Toggle font-style buttons
$('#font-style .btn').on('click', function () {
    if ($(this).attr('data') == '') {
        $(this).addClass('active')
        $(this).attr('data', $(this).attr('value'))
    } else {
        $(this).removeClass('active')
        $(this).attr('data', '')
    }
    $(this).trigger('change-value')
})

// Update style of text align buttons
$('.align').on('update-status', function () {
    $('.align').removeClass('active')
    $(this).addClass('active')
})
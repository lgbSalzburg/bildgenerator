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
            jQuery('#font-family').selectpicker('refresh')
        })
    } else {
        text.set("fontFamily", font);
        canvas.renderAll();
        jQuery('#font-family').selectpicker('refresh')
    }
}

// Update edit methods values to the selected canvas text
function updateInputs() {
    var activeObject = canvas.getActiveObject()

    if (activeObject.get('type') == "text") {
        enableTextMethods()
        jQuery('#text').val(activeObject.text)
        jQuery('#font-family').val(activeObject.fontFamily).selectpicker('refresh')
        jQuery('#text-color').val(activeObject.fill).selectpicker('refresh')
        jQuery('#font-size').val(activeObject.fontSize)
        jQuery(`input[value="${activeObject.textAlign}"]`).parent().trigger('update-status')
        jQuery('#stroke-width').val(activeObject.strokeWidth)
        jQuery('#shadow-depth').val(activeObject.shadow.blur)
        jQuery('#bg-option').attr('data', activeObject.textBackgroundColor).trigger('update-status')
    }

    jQuery('#opacity').val(parseInt(activeObject.opacity * 100))
    jQuery('#scale').val(parseFloat(activeObject.scaleX))
}


function loadObjectHandlers() {
    // Interactive edit methods with canvas text 
    jQuery('#text').off('input').on('input', function () {
        setValue("text", jQuery(this).val())
    })

    jQuery('#scale').off('input').on('input', function () {
        if (canvas.getActiveObject() != null) {
            var activeText = canvas.getActiveObject()
            activeText.scale(parseFloat(this.value)).setCoords();
            canvas.renderAll();
        }
    })


    jQuery('#text-color').off('change').on('change', function () {
        jQuery('#text-color').selectpicker('refresh')
        if (canvas.getActiveObject() != null) {
          setValue("fill", jQuery(this).find(":selected").attr('value'))
        }
    })

    jQuery('#font-family').off('change').on('change', function () {
        jQuery('#font-family').selectpicker('refresh')
        if (canvas.getActiveObject() != null) {
            loadFont(jQuery(this).find(":selected").attr('value'))
        }
    })

    jQuery('#font-size').off('input').on('input', function () {
        setValue("fontSize", jQuery(this).val())
    })

    jQuery('input[name="align"]').off('change').on('change', function () {
        setValue("textAlign", jQuery(this).attr('id'))
    })

    jQuery('#stroke-width').off('input').on('input', function () {
        var actualWidth=jQuery(this).val()
        if (actualWidth == 0) {
            actualWidth = null
        }
        setValue("strokeWidth", actualWidth)
    })

    jQuery('#shadow-depth').off('input').on('input', function () {
        setValue("shadow", createShadow('black', jQuery('#shadow-depth').val()))
    })

    jQuery('#opacity').off('input').on('input', function () {
        setValue("opacity", parseFloat(jQuery(this).val() / 100))
    })
}

/*****************************
 * Handle edit buttons style *
*****************************/

// Update style of font-style buttons
jQuery('.edit-btn').on('update-status', function () {
    if (jQuery(this).attr('data') == '') {
        jQuery(this).removeClass('active')
    } else {
        jQuery(this).addClass('active')
    }
})

//  Toggle font-style buttons
jQuery('#font-style .btn').on('click', function () {
    if (jQuery(this).attr('data') == '') {
        jQuery(this).addClass('active')
        jQuery(this).attr('data', jQuery(this).attr('value'))
    } else {
        jQuery(this).removeClass('active')
        jQuery(this).attr('data', '')
    }
    jQuery(this).trigger('change-value')
})

// Update style of text align buttons
jQuery('.align').on('update-status', function () {
    jQuery('.align').removeClass('active')
    jQuery(this).addClass('active')
})
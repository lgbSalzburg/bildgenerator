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
        jQuery('#text-color').val(activeObject.fill).selectpicker('refresh')
        jQuery(`input[value="${activeObject.textAlign}"]`).parent().trigger('update-status')
        updateScale(activeObject)
    }
}

function updateScale(activeObject) {
    scale = Number(parseFloat(activeObject.scaleX)).toFixed(2)
    // jQuery('#scale-value').val(scale)
    jQuery('#scale').val(scale)
}


function loadObjectHandlers() {
    // Interactive edit methods with canvas text 
    jQuery('#text').off('input').on('input', function () {
        setValue("text", jQuery(this).val())
    })

    jQuery('#scale').off('input').on('input', function () {
        var activeObject = canvas.getActiveObject()
        if (activeObject != null && activeObject != contentImage) {
            activeObject.scale(parseFloat(this.value)).setCoords();
            canvas.renderAll();
            updateScale(activeObject)
        }
    })

    jQuery('#text-color').off('change').on('change', function () {
        jQuery('#text-color').selectpicker('refresh')
        if (canvas.getActiveObject() != null && canvas.getActiveObject().get('type') == "text") {
            setValue("fill", jQuery(this).find(":selected").attr('value'))
        }
    })

    jQuery('input[name="align"]').off('change').on('change', function () {
        setValue("textAlign", jQuery(this).attr('id'))
    })

    jQuery('#stroke-width').off('input').on('input', function () {
        var actualWidth = jQuery(this).val()
        if (actualWidth == 0) {
            actualWidth = null
        }
        setValue("strokeWidth", actualWidth)
    })

    jQuery('#shadow-depth').off('input').on('input', function () {
        setValue("shadow", createShadow('black', jQuery('#shadow-depth').val()))
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
// Update attribute of the current canvas object
function setValue(key, value) {
    if (canvas.getActiveObject() != null) {
        var activeText = canvas.getActiveObject()
        activeText.set(key, value)
        canvas.renderAll();
    }
}

// Return current background color
function getBackgroundColor(color) {
    if (jQuery('#bg-option').hasClass('active')) {
        return color
    } else {
        return ''
    }
}

function disableTextMethods() {
    jQuery('.text-method').attr('disabled', 'disabled')
    jQuery('#font-family').selectpicker('refresh')
    jQuery('.align').addClass('disabled')
}

function enableTextMethods() {
    jQuery('.text-method').attr('disabled', false)
    jQuery('#font-family').selectpicker('refresh')
    jQuery('.align').removeClass('disabled')
}

function createShadow(color, width) {
    return `${color} 2px 2px ${width}`
}

function setBackgroundColor(color) {
    setValue("textBackgroundColor", getBackgroundColor(color))
}

function isImage(fileType) {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (validImageTypes.includes(fileType)) {
        return true
    }
    return false
}

// Generate a random 6-character name
function createImgName() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var format = jQuery('#image-format').find(":selected").attr('value')
    return `${result}.${format}`;
}

// Show alert message
function showAlert(message) {
    jQuery('.alert-container')
        .html(`<p class="text-center mb-0"><strong>${message}</strong></p>`)
        .fadeIn('normal', function () {
            setTimeout(function () {
                jQuery('.alert-container').fadeOut('normal', function () {
                    jQuery('.alert-container').html('')
                })
            }, 3000)
        })
}
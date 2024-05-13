jQuery(function () {
    // Eevnt: Choice meme from top 100
    jQuery('.memes-container').delegate('img', 'click', function () {
        var $img = jQuery(this)
        var imgInfo = {
            url: $img.attr('src'),
            height: $img.attr('img-height'),
            width: $img.attr('img-width'),
        }

        jQuery('.choice-section').trigger('choice-done', imgInfo)
    })

    // Event: Upload local image
    jQuery('#meme-input').on('change', function () {
        const file = this.files[0];
        const fileType = file['type'];

        // Reset file input
        jQuery('#meme-input').val('')

        // Validate this is image
        if (!isImage(fileType)) {
            showAlert('Error! Invalid Image')
            return
        }

        const reader = new FileReader()
        reader.onload = function () {
            var meme = new Image()
            meme.src = reader.result
            meme.onload = function () {
                var imgInfo = {
                    url: reader.result,
                    height: meme.height,
                    width: meme.width,
                }
                // jQuery('.choice-section').trigger('choice-done', imgInfo)
                processMeme(imgInfo)
            }
        }
        reader.readAsDataURL(file)
    })
})
var canvas;
// Meme process

var contentRect;
var contentImage;

function replaceCanvas() {
    template = $('#canvas-template').find(":selected").attr('value')
    if (canvas != null) {
        canvas.dispose();
    }
    var width;
    var height;
    var topBorderMultiplier = 1;
    var border = 10;
    var logoTop;
    switch (template) {
        case 'story':
            width = 1080
            height = 1920;
            topBorderMultiplier = 2;
            logoTop = 0.827;
            break;
        case 'post':
            width = 1080
            height = 1080;
            topBorderMultiplier = 1;
            border = 20;
            logoTop = 0.787;
            break;
        case 'event':
            width = 1200
            height = 628;
            topBorderMultiplier = 1;
            border = 20;
            logoTop = 0.678;
            break;
        case 'facebook_header':
            width = 820
            height = 312;
            topBorderMultiplier = 1;
            border = 20;
            logoTop = 0.588;
            break;
        default:
            console.log("error")
    }

    $(window).resize(resizeCanvas)
    function resizeCanvas() {
        var wrapperWidth = $('.fabric-canvas-wrapper').width()
        $('.canvas-container').css('width', wrapperWidth)
        $('.canvas-container').css('height', wrapperWidth * height / width)
    }

    // Intialize fabric canvas
    canvas = new fabric.Canvas('meme-canvas', {
        width: width,
        height: height,
        selection: false,
        allowTouchScrolling: true,
        // objectCaching: false,
        backgroundColor: "rgba(138, 180, 20)",
        preserveObjectStacking: true,
    });

    $('#scale').attr('max', canvas.width * 0.0025)
    $('#scale').val(canvas.width * 0.0025 / 2)

    resizeCanvas();
    canvas.renderAll();

    topDistance = (canvas.width / border) * topBorderMultiplier
    borderDistance = (canvas.width / border)

    contentRect = new fabric.Rect({
        top: topDistance,
        left: borderDistance,
        width: canvas.width - borderDistance * 2,
        height: canvas.height - (topDistance + borderDistance),
        fill: 'rgba(83,132,48)',
        selectable: false,
    });

    canvas.add(contentRect)
    enableSnap();
    enablePictureMove();

    fabric.Image.fromURL("/resources/images/gruene_logo.svg", function (image) {
        // if (contentRect.width < contentRect.height) {
            image.scaleToWidth((contentRect.width + contentRect.height) / 10);
        // } else {
        //     image.scaleToHeight(contentRect.height / 5);
        // }
        image.lockMovementX = true;
        image.lockMovementY = true;
        image.top = canvas.height * logoTop;
        canvas.add(image);
        canvas.centerObjectH(image);
        canvas.bringToFront(image);
    });
}

function enablePictureMove() {
    canvas.on('object:moving', function (options) {
        if (options.target === contentImage) {


            // Relation between uploaded picture and canvas rect as image width/height are unscaled in calculations
            imageRelatedHeight = options.target.height * (contentRect.width / contentImage.width)
            imageRelatedWidth = options.target.width * (contentRect.height / contentImage.height)

            // Max top and left minus values before images are snapped
            maxTop = contentImage.top - contentRect.top - contentRect.height
            maxLeft = contentImage.left - contentRect.left - contentRect.width

            // If image is dragged beyond top, but only if its larger than the height snap it to top
            if (options.target.top > contentRect.to ** imageRelatedHeight > contentRect.height) {
                options.target.set({
                    top: contentRect.top,
                }).setCoords();
            }

            // If image is dragged beyond left, but only if its wider than the width snap it to left
            if (options.target.left > contentRect.left && imageRelatedWidth > contentRect.width) {
                options.target.set({
                    left: contentRect.left,
                }).setCoords();
            }

            // Snap images to Max Top/Left if they get dragged to top or left so the image wouldn't fit anymore
            // First if check is so they aren't triggered accidentally when dragging in the other direction
            if (imageRelatedHeight > contentRect.height && imageRelatedHeight < maxTop * -1) {
                options.target.set({
                    top: contentRect.height - imageRelatedHeight + contentRect.top,
                }).setCoords();
            }

            if (imageRelatedWidth > contentRect.width && imageRelatedWidth < maxLeft * -1) {
                options.target.set({
                    left: contentRect.width - imageRelatedWidth + contentRect.left,
                }).setCoords();
            }


        }
    });
}

function enableSnap() {
    var snapZone = 20;
    canvas.on('object:moving', function (options) {
        var objectWidth = options.target.getBoundingRect().width
        var objectMiddle = options.target.left + objectWidth / 2;
        if (objectMiddle > canvas.width / 2 - snapZone &&
            objectMiddle < canvas.width / 2 + snapZone) {
            options.target.set({
                left: canvas.width / 2 - objectWidth / 2,
            }).setCoords();
        }
    });
}

replaceCanvas();

$('#canvas-template').off('change').on('change', function () {
    $('#canvas-template').selectpicker('refresh');
    replaceCanvas();
})

$('#add-text').off('click').on('click', function () {
    if ($('#text').val() == '') {
        showAlert('Error! Text field is empty')
        return
    }

    // Create new text object
    var text = new fabric.Text($('#text').val(), {
        top: 200,
        minWidth: canvas.width,
        fontFamily: $('#font-family').find(":selected").attr('value'),
        fontSize: parseInt($('#font-size').val()),
        fontStyle: 'normal',
        textAlign: 'center',
        fill: $('#text-color').find(":selected").attr('value'),
        stroke: '#000000',
        strokeWidth: parseInt($('#stroke-width').val()),
        shadow: createShadow('#000000', $('#shadow-depth').val()),
        objectCaching: false
    })

    text.scaleToWidth(canvas.width / 3)
    $('#scale').val(text.scaleX)

    canvas.add(text).setActiveObject(text);
    loadFont(text.fontFamily);
    canvas.centerObject(text);

})

$('#generate-meme').off('click').on('click', function () {
    var dataURL = canvas.toDataURL({ format: $('#image-format').find(":selected").attr('value'), quality: parseFloat($('#image-quality').find(":selected").attr('value')) });
    var link = document.createElement('a');
    link.href = dataURL;
    link.download = createImgName();
    link.click();
})


$('#add-image').off('input').on('input', function () {
    const file = this.files[0];
    const fileType = file['type'];
    $('#add-image').val('')

    if (!isImage(fileType)) {
        showAlert('Error! Invalid Image')
        return
    }

    const reader = new FileReader()
    reader.onload = function () {
        var image = new Image()
        image.src = reader.result
        image.onload = function () {
            fabric.Image.fromURL(reader.result, function (image) {
                image.scaleToWidth(canvas.width / 2)
                canvas.add(image).setActiveObject(image);
                $('#scale').val(image.scaleX)
            }, {
                opacity: $('#opacity').val()
            })
        }
    }
    reader.readAsDataURL(file)
})

$('#remove-element').off('click').on('click', function () {
    if (canvas.getActiveObject() != contentImage) {
        canvas.remove(canvas.getActiveObject())
    }
})

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'yellow',
    borderColor: 'rgba(88,42,114)',
    cornerSize: parseInt(canvas.width) * 0.03,
    cornerStrokeColor: '#000000',
    borderScaleFactor: 2,
    padding: 4,
});

// add event listener handlers to edit methods
loadObjectHandlers()

// Update edit methods values to the selected canvas text
canvas.on({
    'selection:created': updateInputs,
    'selection:updated': updateInputs,
    'selection:cleared': enableTextMethods,
})

function processMeme(memeInfo) {
    canvas.remove(contentRect);
    if (contentImage != null) {
        canvas.remove(contentImage);
    }
    // Add meme template as canvas background
    fabric.Image.fromURL(`${memeInfo.url}`, function (meme) {
        widthRelation = contentRect.width / meme.width
        originalHeight = meme.height;
        contentImage = meme;
        meme.selectable = true;
        meme.top = contentRect.top;
        meme.left = contentRect.left;


        let clipRect = new fabric.Rect({
            left: contentRect.left,
            top: contentRect.top,
            width: contentRect.width,
            height: contentRect.height,
            absolutePositioned: true
        });

        switch ($('#scale-direction').find(":selected").attr('value')) {
            case 'width':
                meme.scaleToWidth(contentRect.width);
                meme.lockMovementX = true;
                break;
            case 'height':
                meme.scaleToHeight(contentRect.height);
                meme.lockMovementY = true;
                break;
            default:
                console.log("error")
        }
        meme.clipPath = clipRect;
        canvas.add(meme);
        canvas.sendToBack(meme);
        canvas.centerObjectH(meme);
    }, {
        crossOrigin: "anonymous"
    });
}

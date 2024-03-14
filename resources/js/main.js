var canvas;
// Meme process

var contentRect;
var contentImage;
var logo;

var template_values = {
    story: {
        width: 1080,
        height: 1920,
        topBorderMultiplier: 2,
        border: 10,
        logoTop: 0.830,
    },
    post: {
        width: 1080,
        height: 1080,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.789,
    }
    , event: {
        width: 1200,
        height: 628,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.678,
    },
    facebook_header: {
        width: 820,
        height: 312,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.6,
    },
    a3: {
        width: 3508,
        height: 4961,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.823,
    },
    a3_quer: {
        width: 4961,
        height: 3508,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
    },
    a4: {
        width: 2480,
        height: 3508,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.823,
    },
    a4_quer: {
        width: 3508,
        height: 2480,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
    },
    a5: {
        width: 1748,
        height: 2480,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.823,
    },
    a5_quer: {
        width: 2480,
        height: 1748,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
    }
}

function currentTemplate() {
    return template_values[$('#canvas-template').find(":selected").attr('value')]
}

function replaceCanvas() {
    template = $('#canvas-template').find(":selected").attr('value')
    if (canvas != null) {
        canvas.dispose();
    }
    current_template = currentTemplate();
    var width = current_template.width;
    var height = current_template.height;
    var topBorderMultiplier = current_template.topBorderMultiplier;
    var border = current_template.border;

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
    addLogo();
}

function addLogo() {
    if (logo != null) {
        canvas.remove(logo);
    }

    scaleTo = (contentRect.width + contentRect.height) / 10
    logoFilename = $('#logo-selection').find(":selected").attr('value')
    if (scaleTo < 121) {
        logoFilename = logoFilename.replace('245', '120').replace('248', '121').replace('268','131')
    }

    fabric.Image.fromURL("resources/images/logos/" + logoFilename, function (image) {
        image.scaleToWidth(scaleTo);
        image.lockMovementX = true;
        image.lockMovementY = true;
        image.top = canvas.height * currentTemplate().logoTop;
        disableScalingControls(image)
        canvas.add(image);
        canvas.centerObjectH(image);
        canvas.bringToFront(image);
        logo = image;
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
            if (options.target.top > contentRect.top && imageRelatedHeight > contentRect.height) {
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

function disableScalingControls(object) {
    object.setControlsVisibility({
        mt: false, // middle top disable
        mb: false, // midle bottom
        ml: false, // middle left
        mr: false, // I think you get it
        bl: false,
        br: false,
        tl: false,
        tr: false,
        mtr: false
    });
}

function enableSnap() {
    var snapZone = canvas.width / 20;
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

$('#logo-selection').off('change').on('change', function () {
    $('#logo-selection').selectpicker('refresh');
    addLogo();
})

$('#scale-direction').off('change').on('change', function () {
    $('#scale-direction').selectpicker('refresh');
    positionBackgroundImage();
})

$('#add-text').off('click').on('click', function () {
    if ($('#text').val() == '') {
        showAlert('Error! Text field is empty')
        return
    }

    // Create new text object
    var text = new fabric.Text($('#text').val(), {
        top: 200,
        fontFamily: "Gotham Narrow", //$('#font-family').find(":selected").attr('value'),
        fontSize: canvas.width/2,
        fontStyle: 'normal',
        textAlign: 'center',
        fill: $('#text-color').find(":selected").attr('value'),
        stroke: '#000000',
        strokeWidth: 0,
        shadow: '#000000 0px 0px 3px',
        objectCaching: false,
        lineHeight: 0.7,
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
                canvas.centerObject(image)
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

$('#add-circle').off('click').on('click', function () {
    console.log('ádding circle')
    $('#circle-radius').selectpicker('refresh');
    var active_image = canvas.getActiveObject();
    size = parseInt($('#circle-radius').find(":selected").attr('value'))
    console.log(size)
    if (active_image != contentImage) {
        var radius = Math.min(active_image.height, active_image.width)/size
        console.log('radius')
        console.log(radius)
        var clipPath = new fabric.Circle({
            radius: radius,
            top: radius * -1,
            left: radius * -1
        });
        if (active_image.clipPath != null) {
            active_image.clipPath = null;
        }else {
            active_image.clipPath = clipPath;
        }
        canvas.renderAll();
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
    // Add meme template as canvas background
    fabric.Image.fromURL(`${memeInfo.url}`, function (meme) {
        if (contentImage != null) {
            canvas.remove(contentImage);
        }    
        contentImage = meme;
        positionBackgroundImage();
    }, {
        crossOrigin: "anonymous"
    });
}

function positionBackgroundImage(){
    if (contentImage != null) {
        canvas.remove(contentRect);
        canvas.remove(contentImage);
        widthRelation = contentRect.width / contentImage.width
        originalHeight = contentImage.height;
        contentImage = contentImage;
        contentImage.selectable = true;
        contentImage.top = contentRect.top;
        contentImage.left = contentRect.left;
        disableScalingControls(contentImage);


        let clipRect = new fabric.Rect({
            left: contentRect.left,
            top: contentRect.top,
            width: contentRect.width,
            height: contentRect.height,
            absolutePositioned: true
        });

        switch ($('#scale-direction').find(":selected").attr('value')) {
            case 'width':
                contentImage.scaleToWidth(contentRect.width);
                contentImage.lockMovementX = true;
                contentImage.lockMovementY = false;
                break;
            case 'height':
                contentImage.scaleToHeight(contentRect.height);
                contentImage.lockMovementY = true;
                contentImage.lockMovementX = false;
                break;
            default:
                console.log("error")
        }
        contentImage.clipPath = clipRect;
        canvas.add(contentImage);
        canvas.sendToBack(contentImage);
        canvas.centerObjectH(contentImage);
    }
}

function addLogoSelection(groupName, groupNameOptGroup){
    $.getJSON("resources/images/logos/index/" + groupName + "-logos.json", function (data) {
        var items = [];
        $.each(data, function (index, logo) {
            items.push("<option value=" + groupName + "/" + logo.file + ">" + logo.name + "</option>");
        });
    
        $("#logo-selection").append('<optgroup label="' + groupNameOptGroup + '">' + items.join("") + '</optgroup>');
        $('#logo-selection').selectpicker('refresh');
    });
}

addLogoSelection('bundeslaender', 'Bundesländer')
addLogoSelection('domains', 'Domains')
addLogoSelection('gemeinden', 'Gemeinden & Bezirke')



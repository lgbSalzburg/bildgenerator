var canvas;
// Meme process

var contentRect;
var contentImage;
var logo;
var logoName;
var logoText
var scaleMax;

if (typeof generatorApplicationURL == 'undefined') {
    var generatorApplicationURL = "";
}

var template_values = {
    story: {
        width: 1080,
        height: 1920,
        topBorderMultiplier: 2,
        border: 10,
        logoTop: 0.830,
        logoTextTop: 0.9423
    },
    post: {
        width: 1080,
        height: 1080,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.789,
        logoTextTop: 0.947
    },
    horizontal: {
        width: 1920,
        height: 1080,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.75,
        logoTextTop: 0.963
    },
    vertical: {
        width: 1080,
        height: 1920,
        topBorderMultiplier: 1,
        border: 10,
        logoTop: 0.84,
        logoTextTop: 0.958
    },
    event: {
        width: 1200,
        height: 628,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.678,
        logoTextTop: 0.9
    },
    facebook_header: {
        width: 820,
        height: 312,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.6,
        logoTextTop: 0.862
    },
    a2: {
        width: 4961,
        height: 7016,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.826,
        logoTextTop: 0.964
    },
    a2_quer: {
        width: 7016,
        height: 4961,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
        logoTextTop: 0.9257
    },
    a3: {
        width: 3508,
        height: 4961,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.826,
        logoTextTop: 0.964
    },
    a3_quer: {
        width: 4961,
        height: 3508,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
        logoTextTop: 0.9257
    },
    a4: {
        width: 2480,
        height: 3508,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.826,
        logoTextTop: 0.964
    },
    a4_quer: {
        width: 3508,
        height: 2480,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
        logoTextTop: 0.9257
    },
    a5: {
        width: 1748,
        height: 2480,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.826,
        logoTextTop: 0.964
    },
    a5_quer: {
        width: 2480,
        height: 1748,
        topBorderMultiplier: 1,
        border: 20,
        logoTop: 0.739,
        logoTextTop: 0.9257
    }
}

function currentTemplate() {
    return template_values[jQuery('#canvas-template').find(":selected").attr('value')]
}

function replaceCanvas() {
    template = jQuery('#canvas-template').find(":selected").attr('value')
    if (canvas != null) {
        canvas.dispose();
    }
    current_template = currentTemplate();
    var width = current_template.width;
    var height = current_template.height;
    var topBorderMultiplier = current_template.topBorderMultiplier;
    var border = current_template.border;

    jQuery(window).resize(resizeCanvas)
    function resizeCanvas() {
        var wrapperWidth = jQuery('.fabric-canvas-wrapper').width()
        jQuery('.canvas-container').css('width', wrapperWidth)
        jQuery('.canvas-container').css('height', wrapperWidth * height / width)
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

    scaleMax = canvas.width * 0.0020
    jQuery('#scale').attr('max', scaleMax)

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
    enableScalingUpdates();
    addLogo();
}

function addLogo() {
    if (logo != null) {
        canvas.remove(logo);
        canvas.remove(logoName)
    }


    scaleTo = (contentRect.width + contentRect.height) / 10
    logoText = (jQuery('#logo-selection').find(":selected").attr('value') || "").trim().toUpperCase()

    if (logoText.length > 16 || logoText.lastIndexOf('%') > 0) {
        var logoFilename = "Gruene_Logo_245_268.png"
        lastSpace = logoText.lastIndexOf('%')
        if (lastSpace < 0) {
            lastSpace = logoText.lastIndexOf(' ')
        }
        logoText = logoText.substring(0, lastSpace) + '\n' + logoText.substring(lastSpace + 1)
        textScaleTo = 4.8
    } else {
        var logoFilename = "Gruene_Logo_245_248.png"
        textScaleTo = 6
    }

    if (scaleTo < 121) {
        logoFilename = logoFilename.replace('245', '120').replace('248', '121').replace('268', '131')
    }

    logo_image = fabric.Image.fromURL(generatorApplicationURL + "resources/images/logos/" + logoFilename, function (image) {
        image.scaleToWidth(scaleTo);
        image.lockMovementX = true;
        image.lockMovementY = true;
        image.top = canvas.height * currentTemplate().logoTop;
        disableScalingControls(image)
        image.selectable = false;
        canvas.add(image);
        canvas.centerObjectH(image);
        canvas.bringToFront(image);
        // canvas.sendToBack(image);
        logo = image;

        logoName = new fabric.Text(logoText, {
            top: canvas.height * currentTemplate().logoTextTop,
            fontFamily: "Gotham Narrow Bold",
            fontSize: Math.floor(image.getScaledWidth() / 10),
            fontStyle: 'normal',
            textAlign: 'right',
            fill: 'rgb(255,255,255)',
            stroke: '#000000',
            strokeWidth: 0,
            // shadow: createShadow('#000000', jQuery('#shadow-depth').val()),
            objectCaching: false,
            lineHeight: 0.8,
            angle: -5.5,
            selectable: false
        })

        canvas.add(logoName)

        linebreak = logoText.lastIndexOf('\n')
        if (linebreak > 17 || logoText.length - linebreak > 17) {
            logoName.scaleToWidth(image.getScaledWidth() * 0.95)
            topAdd = Math.floor((logoName.height - logoName.getScaledHeight()) / 2)
            logoName.top = logoName.top + topAdd
        } else {
            logoName.width = image.getScaledWidth() * 0.95
        }
        // logoName.scaleToHeight(image.height/textScaleTo)

        // disableScalingControls(logoName)
        canvas.centerObjectH(logoName);
        logo_to_front()
        canvas.renderAll()
    });
}

function logo_to_front(params) {
    canvas.bringToFront(logo);
    canvas.bringToFront(logoName);
}

function enableScalingUpdates() {
    canvas.on('object:scaling', function (options) {
        console.log("isScaling")
        updateScale(options.target)
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

function relativeScalingControlsOnly(object) {
    object.setControlsVisibility({
        mt: false, // middle top disable
        mb: false, // midle bottom
        ml: false, // middle left
        mr: false, // I think you get it
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mtr: true
    });
}

function enableSnap() {
    var snapZone = canvas.width / 20;
    canvas.on('object:moving', function (options) {
        if (options.target != contentImage) {
            var objectWidth = options.target.getBoundingRect().width
            var objectMiddle = options.target.left + objectWidth / 2;
            if (objectMiddle > canvas.width / 2 - snapZone &&
                objectMiddle < canvas.width / 2 + snapZone) {
                options.target.set({
                    left: canvas.width / 2 - objectWidth / 2,
                }).setCoords();
            }
        }
    });
}

replaceCanvas();
jQuery('#canvas-template').off('change').on('change', function () {
    jQuery('#canvas-template').selectpicker('refresh');
    replaceCanvas();
})
jQuery('#logo-selection').off('change').on('change', function () {
    jQuery('#logo-selection').selectpicker('refresh');
    addLogo();
})
jQuery('#scale-direction').off('change').on('change', function () {
    jQuery('#scale-direction').selectpicker('refresh');
    positionBackgroundImage();
})
jQuery('#add-text').off('click').on('click', function () {
    if (jQuery('#text').val() == '') {
        showAlert('Error! Text field is empty')
        return
    }

    // Create new text object
    var text = new fabric.Text(jQuery('#text').val(), {
        top: 200,
        fontFamily: "Gotham Narrow", //jQuery('#font-family').find(":selected").attr('value'),
        fontSize: canvas.width / 2,
        fontStyle: 'normal',
        textAlign: jQuery('input[name="align"]:checked').val(),
        fill: jQuery('#text-color').find(":selected").attr('value'),
        stroke: '#000000',
        strokeWidth: 0,
        shadow: createShadow('#000000', jQuery('#shadow-depth').val()),
        objectCaching: false,
        lineHeight: 0.7,
        centeredScaling: false
    })

    relativeScalingControlsOnly(text);
    text.scaleToWidth(canvas.width / 2)


    canvas.add(text).setActiveObject(text);
    loadFont(text.fontFamily);
    canvas.centerObject(text);
    updateScale(text)
})
jQuery('#generate-meme').off('click').on('click', function () {
    if (logoText != "") {
        if (confirm("Hast du das Copyright bei Fotos überprüft und angegeben und das Impressum wo notwendig hinzugefügt?")) {
            var dataURL = canvas.toDataURL({ format: jQuery('#image-format').find(":selected").attr('value'), quality: parseFloat(jQuery('#image-quality').find(":selected").attr('value')) });
            var link = document.createElement('a');
            link.href = dataURL;
            link.download = createImgName();
            link.click();
        }
    } else {
        alert("Wähle bitte ein Logo aus vor dem Download!")
    }
})

jQuery('#add-image').off('input').on('input', function () {
    const file = this.files[0];
    const fileType = file['type'];
    jQuery('#add-image').val('')

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
                relativeScalingControlsOnly(image);
                canvas.add(image).setActiveObject(image);
                canvas.centerObject(image);
                updateScale(image);
                logo_to_front()
            }, {
                opacity: jQuery('#opacity').val()
            })
        }
    }
    reader.readAsDataURL(file)
})
jQuery('#remove-element').off('click').on('click', function () {
    if (canvas.getActiveObject() != contentImage && canvas.getActiveObject() != logo) {
        canvas.remove(canvas.getActiveObject())
    }
})

jQuery('#add-circle').off('click').on('click', function () {
    jQuery('#circle-radius').selectpicker('refresh');
    var active_image = canvas.getActiveObject();
    size = parseInt(jQuery('#circle-radius').find(":selected").attr('value'))
    if (active_image != contentImage) {
        var radius = Math.min(active_image.height, active_image.width) / size
        var clipPath = new fabric.Circle({
            radius: radius,
            top: radius * -1,
            left: radius * -1
        });
        if (active_image.clipPath != null) {
            active_image.clipPath = null;
        } else {
            active_image.clipPath = clipPath;
        }
        canvas.renderAll();
    }
})

jQuery('#add-pink-circle').off('click').on('click', function () {
    radius = contentRect.width / 4
    var pinkCircle = new fabric.Circle({
        top: contentRect.height / 3,
        left: contentRect.width / 3,
        radius: radius,
        fill: "rgb(225,0,120)"
    });
    relativeScalingControlsOnly(pinkCircle)
    canvas.add(pinkCircle)
    for (object of canvas.getObjects()) {
        console.log(object)
        console.log(object.get('type'))
        if (object.get('type') == 'text') {
            console.log('Front')
            canvas.bringToFront(object)
        }
    }
    canvas.renderAll()
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

function positionBackgroundImage() {
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

        if (contentRect.width > contentRect.height) {
            contentImage.scaleToWidth(contentRect.width);
            contentImage.lockMovementX = true;
            contentImage.lockMovementY = false;
        } else if (contentRect.width < contentRect.height || contentImage.width > contentImage.height) {
            contentImage.scaleToHeight(contentRect.height);
            contentImage.lockMovementY = true;
            contentImage.lockMovementX = false;
        }
        else {
            contentImage.scaleToWidth(contentRect.width);
            contentImage.lockMovementX = true;
            contentImage.lockMovementY = false;
        }
        contentImage.clipPath = clipRect;
        canvas.add(contentImage);
        canvas.sendToBack(contentImage);
        canvas.centerObjectH(contentImage);
    }
}

function addLogoSelection() {
    jQuery.getJSON(generatorApplicationURL + "resources/images/logos/index.json", function (data) {
        jQuery.each(data, function (index, names) {
            var items = [];
            jQuery.each(names.sort(), function (index, name) {
                items.push('<option value="' + name.toUpperCase() + '">' + name.replace('%', ' ').toUpperCase() + "</option>");
            });
            jQuery("#logo-selection").append('<optgroup label="' + index + '">' + items.join("") + '</optgroup>');
            jQuery('#logo-selection').selectpicker('refresh');
        });
    });
}

addLogoSelection()


function autoPlayYouTubeModal() {
    var trigger = jQuery("body").find('[data-toggle="modal"]');
    trigger.click(function () {
        var theModal = jQuery(this).data("target"),
            videoSRC = jQuery(this).attr("data-theVideo"),
            videoSRCauto = videoSRC + "?autoplay=1";
        jQuery(theModal + ' iframe').attr('src', videoSRCauto);
        jQuery(theModal + ' button.close').click(function () {
            jQuery(theModal + ' iframe').attr('src', videoSRC);
        });
    });
}
jQuery(document).ready(function () {
    autoPlayYouTubeModal();
});

document.addEventListener('keydown', function(event){
    //Delete
    if(event.which == 46) {
        if (canvas.getActiveObject() != contentImage && canvas.getActiveObject() != logo) {
            canvas.remove(canvas.getActiveObject())
        }
    }

    //Arrow Left
    if(event.which == 38) {
        if (canvas.getActiveObject() != contentImage && canvas.getActiveObject() != logo) {
            
            var xCoord = canvas.getActiveObject().aCoords.tl.x;
            var yCoord = canvas.getActiveObject().aCoords.tl.y;

            var pt = new fabric.Point(xCoord, yCoord - 10);
            canvas.getActiveObject().setPositionByOrigin(pt, 'left', 'top');
            canvas.renderAll();
        }
    }

    //Arrow Up
    if(event.which == 37) {
        if (canvas.getActiveObject() != contentImage && canvas.getActiveObject() != logo) {
            
            var xCoord = canvas.getActiveObject().aCoords.tl.x;
            var yCoord = canvas.getActiveObject().aCoords.tl.y;

            var pt = new fabric.Point(xCoord - 10, yCoord);
            canvas.getActiveObject().setPositionByOrigin(pt, 'left', 'top');
            canvas.renderAll();
        }
    }

    //Arrow Right
    if(event.which == 39) {
        if (canvas.getActiveObject() != contentImage && canvas.getActiveObject() != logo) {
            
            var xCoord = canvas.getActiveObject().aCoords.tl.x;
            var yCoord = canvas.getActiveObject().aCoords.tl.y;

            var pt = new fabric.Point(xCoord + 10, yCoord);
            canvas.getActiveObject().setPositionByOrigin(pt, 'left', 'top');
            canvas.renderAll();
        }
    }
    
    //Arrow Down
    if(event.which == 40) {
        if (canvas.getActiveObject() != contentImage && canvas.getActiveObject() != logo) {
            
            var xCoord = canvas.getActiveObject().aCoords.tl.x;
            var yCoord = canvas.getActiveObject().aCoords.tl.y;

            var pt = new fabric.Point(xCoord, yCoord + 10);
            canvas.getActiveObject().setPositionByOrigin(pt, 'left', 'top');
            canvas.renderAll();
        }
    }
});

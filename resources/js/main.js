var canvas;
// Meme process
function processMeme(memeInfo) {
    // Responsive canvas
    $(window).resize(resizeCanvas)
    function resizeCanvas() {
        var width = $('.fabric-canvas-wrapper').width()
        $('.canvas-container').css('width', width)
        $('.canvas-container').css('height', width * memeInfo.height / memeInfo.width)
    }

    // Intialize fabric canvas
    canvas = new fabric.Canvas('meme-canvas', {
        width: memeInfo.width,
        height: memeInfo.height,
        selection: false,
        allowTouchScrolling: true,
        objectCaching: false
    });

    // Scale is a range input allow small screen users to scale the object easily
    $('#scale').attr('max', canvas.width * 0.0025)
    $('#scale').val(canvas.width * 0.0025 / 2)

    resizeCanvas()

    // Add meme template as canvas background
    fabric.Image.fromURL(`${memeInfo.url}`, function (meme) {
        canvas.setBackgroundImage(meme, canvas.renderAll.bind(canvas))
    }, {
        crossOrigin: "anonymous"
    });

    var strokeWidth = canvas.width / 10;

    var rectangle = new fabric.Rect({
        width: canvas.width - strokeWidth,
        height: canvas.height - strokeWidth,
        fill: '',
        stroke: 'rgba(138,180,20)',
        strokeWidth: strokeWidth,
        selectable: false,
    });
    
    canvas.add(rectangle);
    canvas.centerObject(rectangle);

    var snapZone = 20;
    canvas.on('object:moving', function (options) {
        var objectWidth = options.target.getBoundingRect().width
        // objectWidth = objectWidth * 1.25
        // console.log(options.target.width)
        var objectMiddle = options.target.left + objectWidth / 2;
        if (objectMiddle > canvas.width / 2 - snapZone &&
            objectMiddle < canvas.width / 2 + snapZone) {
            options.target.set({
                left: canvas.width / 2 - objectWidth / 2,
            }).setCoords();
        }
    });

    // Event: Add new text
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

    // Event: Add new image
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

    // Custom control
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

    $('#generate-meme').off('click').on('click', function () {
        var dataURL = canvas.toDataURL({format: $('#image-format').find(":selected").attr('value'), quality: parseFloat($('#image-quality').find(":selected").attr('value'))});
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = createImgName();
        link.click();
    })
}

// Helpers

var getElem = function (selector) {
    return document.querySelector(selector);
};
var getElems = function (selector) {
    return document.querySelectorAll(selector);
};

// End Helpers

let myVideo, canvas, capturer, rescanvas, originalPhoto, image, isEditable = false,
    isCapture = false,
    cropX = 0,
    cropY = 0,
    cropWidth, cropHeight, rect;
canvas = document.getElementById("canvas");
cropWidth = canvas.width;
cropHeight = canvas.height;
rescanvas = canvas.getContext("2d");

function showModule() {
    document.getElementById("module").classList.remove("hidden");
    document.getElementById("welcome").classList.add("hidden");
    display_video();
}

function display_video() {

    myVideo = document.getElementById("myVideo");
    capturer = document.getElementById("capturer");

    capturer.addEventListener("click", capture);


    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true,
        }, success, error);

    } else {
        console.log("Le navigateur ne supporte pas l'interface multimédia");
        var source = document.createElement('source');
        source.setAttribute('src', 'default_video.mp4');
        myVideo.appendChild(source);
        myVideo.play();
        document.getElementById("errors").innerHTML = "Le navigateur ne supporte pas l'interface multimédia";
    }


}

function error(error) {
    console.log("error : " + error);
    var source = document.createElement('source');
    source.setAttribute('src', 'default_video.mp4');
    myVideo.appendChild(source);
    myVideo.play();
    document.getElementById("errors").innerHTML = "Le navigateur ne supporte pas l'interface multimédia";
}

function success(stream) {
    myVideo.srcObject = stream;
}

function capture() {
    countDown = document.getElementById("countDown");
    let i = 0;
    var myVar = setInterval(function () {
        if (i < 0) {
            isCapture = true;
            console.log("Button is clicked");
            rescanvas.drawImage(myVideo, 0, 0, canvas.width, canvas.height);
            originalPhoto = rescanvas.getImageData(0, 0, canvas.width, canvas.height);
            image = new Image();
            image.src = canvas.toDataURL();
            clearInterval(myVar);
            return;
        }
        countDown.innerText = i;
        i--;
    }, 0);
}

function download() {
    var download = document.getElementById("download");
    var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

function changeContrast(contrastValue) {
    rescanvas.putImageData(contrastImage(originalPhoto, contrastValue), 0, 0);
}

function contrastImage(imgData, contrast) {
    var d = imgData.data;
    contrast = (contrast / 100) + 1;
    var intercept = 128 * (1 - contrast);
    for (var i = 0; i < d.length; i += 4) {
        d[i] = d[i] * contrast + intercept;
        d[i + 1] = d[i + 1] * contrast + intercept;
        d[i + 2] = d[i + 2] * contrast + intercept;
    }

    return imgData;
}

function brightness(x) {
    var iD = rescanvas.getImageData(0, 0, canvas.width, canvas.height);
    var dA = iD.data;

    var brightnessMul = x;

    for (var i = 0; i < dA.length; i += 4) {
        var red = dA[i];
        var green = dA[i + 1];
        var blue = dA[i + 2];

        brightenedRed = brightnessMul * red;
        brightenedGreen = brightnessMul * green;
        brightenedBlue = brightnessMul * blue;

        dA[i] = brightenedRed;
        dA[i + 1] = brightenedGreen;
        dA[i + 2] = brightenedBlue;
    }
    rescanvas.putImageData(iD, 0, 0);
}
//////////
let resizeBtn = getElem("#resize");
let cancelResizeBtn = getElem("#cancelResize");
let cropBtn = getElem("#crop");
resizeBtn.addEventListener("click", function () {
    isEditable = !isEditable;
    init();
    draw();
    resizeBtn.style.display = "none";
    cancelResizeBtn.style.display = "block";
    cancelResizeBtn.classList.remove("hidden");

    cropBtn.style.display = "block";
    cropBtn.classList.remove("hidden");


});
cancelResizeBtn.addEventListener("click", function () {
    isEditable = false;
    canvas.removeEventListener('mousedown', mouseDown, false);
    canvas.removeEventListener('mouseup', mouseUp, false);
    canvas.removeEventListener('mousemove', mouseMove, false);
    resizeBtn.style.display = "block";
    cancelResizeBtn.style.display = "none";
    cancelResizeBtn.classList.add("hidden");
    cropBtn.style.display = "none";
    cropBtn.classList.add("hidden");
    rescanvas.clearRect(0, 0, canvas.width, canvas.height);
    rescanvas.drawImage(image, 0, 0);
});
cropBtn.addEventListener("click", function () {
    isEditable = false;
    canvas.removeEventListener('mousedown', mouseDown, false);
    canvas.removeEventListener('mouseup', mouseUp, false);
    canvas.removeEventListener('mousemove', mouseMove, false);
    resizeBtn.style.display = "block";
    resizeBtn.classList.remove("hidden");
    cancelResizeBtn.style.display = "none";
    cancelResizeBtn.classList.add("hidden");
    cropBtn.style.display = "none";
    cropBtn.classList.add("hidden");
    rescanvas.clearRect(0, 0, canvas.width, canvas.height);
    rescanvas.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, 235, 220);
    image = new Image();
    image.width = 235;
    image.height = 220;
    image.src = canvas.toDataURL();
    cropX = cropY = 0;
    cropWidth = canvas.width;
    cropHeight = canvas.height;
    rect = {
        x: 10,
        y: 10,
        w: canvas.width - 20,
        h: canvas.height - 20
    }
});
rect = {
        x: 10,
        y: 10,
        w: canvas.width - 20,
        h: canvas.height - 20
    },
    handlesSize = 8,
    currentHandle = false,
    drag = false;

function init() {
    if (isEditable) {
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);
    }
}

function point(x, y) {
    return {
        x: x,
        y: y
    };
}

function dist(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

function getHandle(mouse) {
    if (dist(mouse, point(rect.x, rect.y)) <= handlesSize) return 'topleft';
    if (dist(mouse, point(rect.x + rect.w, rect.y)) <= handlesSize) return 'topright';
    if (dist(mouse, point(rect.x, rect.y + rect.h)) <= handlesSize) return 'bottomleft';
    if (dist(mouse, point(rect.x + rect.w, rect.y + rect.h)) <= handlesSize) return 'bottomright';
    if (dist(mouse, point(rect.x + rect.w / 2, rect.y)) <= handlesSize) return 'top';
    if (dist(mouse, point(rect.x, rect.y + rect.h / 2)) <= handlesSize) return 'left';
    if (dist(mouse, point(rect.x + rect.w / 2, rect.y + rect.h)) <= handlesSize) return 'bottom';
    if (dist(mouse, point(rect.x + rect.w, rect.y + rect.h / 2)) <= handlesSize) return 'right';
    return false;
}

function mouseDown(e) {
    if (currentHandle) drag = true;
    draw();
}

function mouseUp() {
    drag = false;
    currentHandle = false;
    draw();
}

function mouseMove(e) {
    var previousHandle = currentHandle;
    if (!drag) currentHandle = getHandle(point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
    if (currentHandle && drag) {
        var mousePos = point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        switch (currentHandle) {
            case 'topleft':
                rect.w += rect.x - mousePos.x;
                rect.h += rect.y - mousePos.y;
                rect.x = mousePos.x;
                rect.y = mousePos.y;
                break;
            case 'topright':
                rect.w = mousePos.x - rect.x;
                rect.h += rect.y - mousePos.y;
                rect.y = mousePos.y;
                break;
            case 'bottomleft':
                rect.w += rect.x - mousePos.x;
                rect.x = mousePos.x;
                rect.h = mousePos.y - rect.y;
                break;
            case 'bottomright':
                rect.w = mousePos.x - rect.x;
                rect.h = mousePos.y - rect.y;
                break;

            case 'top':
                rect.h += rect.y - mousePos.y;
                rect.y = mousePos.y;
                break;

            case 'left':
                rect.w += rect.x - mousePos.x;
                rect.x = mousePos.x;
                break;

            case 'bottom':
                rect.h = mousePos.y - rect.y;
                break;

            case 'right':
                rect.w = mousePos.x - rect.x;
                break;
        }
    }
    if (drag || currentHandle != previousHandle) draw();
}

function draw() {
    rescanvas.clearRect(0, 0, canvas.width, canvas.height);
    rescanvas.drawImage(image, 0, 0);
    rescanvas.fillStyle = 'white';
    rescanvas.globalAlpha = 0.5;
    rescanvas.fillRect(rect.x, rect.y, rect.w, rect.h);
    rescanvas.globalAlpha = 1.0;
    if (currentHandle) {
        var posHandle = point(0, 0);
        switch (currentHandle) {
            case 'topleft':
                posHandle.x = rect.x;
                posHandle.y = rect.y;
                cropX = rect.x;
                cropY = rect.y;
                break;
            case 'topright':
                posHandle.x = rect.x + rect.w;
                posHandle.y = rect.y;
                cropY = rect.y;
                break;
            case 'bottomleft':
                posHandle.x = rect.x;
                posHandle.y = rect.y + rect.h;
                cropX = rect.x;
                break;
            case 'bottomright':
                posHandle.x = rect.x + rect.w;
                posHandle.y = rect.y + rect.h;
                break;
            case 'top':
                posHandle.x = rect.x + rect.w / 2;
                posHandle.y = rect.y;
                cropY = rect.y;
                break;
            case 'left':
                posHandle.x = rect.x;
                posHandle.y = rect.y + rect.h / 2;
                cropX = rect.x;
                break;
            case 'bottom':
                posHandle.x = rect.x + rect.w / 2;
                posHandle.y = rect.y + rect.h;
                break;
            case 'right':
                posHandle.x = rect.x + rect.w;
                posHandle.y = rect.y + rect.h / 2;
                break;
        }
        cropWidth = rect.w;
        cropHeight = rect.h;
        rescanvas.globalCompositeOperation = 'xor';
        rescanvas.beginPath();
        rescanvas.arc(posHandle.x, posHandle.y, handlesSize, 0, 2 * Math.PI);
        rescanvas.fill();
        rescanvas.globalCompositeOperation = 'source-over';
    }
}

init();
draw();
// Helpers

var getElem = function (selector) {
    return document.querySelector(selector);
};
var getElems = function (selector) {
    return document.querySelectorAll(selector);
};
function htmlToNode(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
}
function replaceNode(newNodeHTML, oldNode){
    var parent = oldNode.parentNode;
    parent.replaceChild(htmlToNode(newNodeHTML), oldNode);
}
// End Helpers

// Init
let oldVideo = getElem('#myVideo');
let newVideo = `<div class="left ecran">
                    ${oldVideo.outerHTML}
                    <div class="countDown">
                        <span>Be ready : </span><span id="countDown">3</span>
                    </div>
                </div>`;
                /////
oldVideo.parentNode.insertAdjacentHTML("afterend",
`<div class="row clear">
    <div id="errors"></div>
</div>`
);
replaceNode(newVideo, oldVideo);
/////
let oldCanvas = getElem('#canvas');
let newCanvas = `
<div class="left result">
    <div class="imgContainer">
        ${oldCanvas.outerHTML}
    </div>
    <div id="btns">
        <button class="btn" id="capturer">Capture</button>
        <button class="btn hidden" id="resize">recadrer</button>
        <button class="btn hidden" id="crop">crop</button>
        <button class="btn hidden" id="cancelResize">cancel</button>
        <a class="hidden" id="download" download="image.png"><button class="btn" type="button" onClick="download()">Download</button></a>
    </div>
    <div class="controles hidden">
        <div>
            <span>- contraste</span>
            <input class="slider" type="range" onchange="changeContrast(this.value)" min="0" max="200" step="1" value="100">
        </div>
        <div>
            <span>- Brightness</span>
            <input class="slider" type="range" onchange="changeBrightness(this.value)" min="0" max="200" step="1" value="100">
        </div>
        <div>
            <span>- Saturate</span>
            <input class="slider" type="range" onchange="changeSaturate(this.value)" min="0" max="200" step="1" value="100">
        </div>
        <div>
            <span>- Grayscale</span>
            <input class="slider" type="range" onchange="changeGrayscale(this.value)" min="0" max="100" step="1" value="0">
        </div>
    </div>
</div>`;
replaceNode(newCanvas, oldCanvas);
/////

// End Init

let myVideo, canvas, capturer, rescanvas, originalPhoto, image, isEditable = false,
    isCapture = false,
    cropX = 0,
    cropY = 0,
    cropWidth, cropHeight, rect;
canvas = document.getElementById("canvas");
cropWidth = canvas.width;
cropHeight = canvas.height;
rescanvas = canvas.getContext("2d");

function showModule(startButton) {
    document.getElementById("module").classList.remove("hidden");
    if(startButton)
        document.getElementById("welcome").classList.add("hidden");
    display_video();
}
function cropInit(startButton){
    if(!startButton){
        showModule(false);
    }
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
            getElem("#resize").classList.remove("hidden");
            getElem("#download").classList.remove("hidden");
            getElem(".controles").classList.remove("hidden");
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
    rescanvas.filter = "contrast("+contrastValue+"%)";
    rescanvas.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
}

function changeBrightness(brightnessValue) {
    rescanvas.filter = "contrast("+brightnessValue+"%)";
    rescanvas.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
}

function changeSaturate(saturateValue) {
    rescanvas.filter = "saturate("+saturateValue+"%)";
    rescanvas.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
}

function changeGrayscale(grayscaleValue) {
    rescanvas.filter = "grayscale("+grayscaleValue+"%)";
    rescanvas.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
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
    rescanvas.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
    image = new Image();
    image.width = canvas.width;
    image.height = canvas.height;
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
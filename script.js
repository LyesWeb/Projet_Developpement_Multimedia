let myVideo, canvas, capturer, rescanvas, originalPhoto, isCapture = false;

function showModule(){
    document.getElementById("module").classList.remove("hidden");
    document.getElementById("welcome").classList.add("hidden");
    display_video();
}

function display_video() {

    myVideo = document.getElementById("myVideo");
    canvas = document.getElementById("canvas");
    capturer = document.getElementById("capturer");


    rescanvas = canvas.getContext("2d");

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
    let i = 3;
    var myVar = setInterval(function(){
        if(i<0){
            isCapture = true;
            console.log("Button is clicked");
            rescanvas.drawImage(myVideo, 0, 0, canvas.width, canvas.height);
            originalPhoto = rescanvas.getImageData(0, 0, canvas.width, canvas.height)
            clearInterval(myVar);
            return;
        }
        countDown.innerText = i;
        i--;
    }, 1000);
}

function download(){
    var download = document.getElementById("download");
    var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

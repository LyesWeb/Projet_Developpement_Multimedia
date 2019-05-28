![takepic](https://user-images.githubusercontent.com/19781935/57959274-9c3a5c80-78f2-11e9-8670-06653b6bab24.png)

# TakePicJs
**TakePicJs** is a camera solution for your Web app. It lets your users take, crop, edit and save pictures. As a developer you get notified of all the user interactions and get the beautiful UI for free.

# features!
  - Take picture
  - Edit and add filters (Contraste, Brightness, Saturate, Grayscale)
  - Crop and adjust
  - Download the final result

### Tech
For development no external framework was used, we used this language :
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - only VanillaJs : `getUserMedia()`, `<video>`, `<canvas>`

### Installation
Several quick start options are available:
Install with npm :
```sh
$ npm i @ilyas.ariba/takepicjs
```

You can also use CDN :
```text
https://takepicjs.netlify.com/style.css
https://takepicjs.netlify.com/script.js
```
```html
<html>
<head>
    <link rel="stylesheet" type="text/css" href="style.min.css">
</head>
<body>
    <div id="cropContainer">
        <!-- put this div if you want to start after button click -->
        <div class="container welcome" id="welcome">
            <button id="showModule" onclick="showModule(true)">tacke picture</button>
        </div>
        <!-- / put this div if you want to start after button click -->
        <div class="container all hidden" id="module">
            <div class="row">
                <video autoplay="true" loop id="myVideo" width="480" height="320"></video>
                <canvas id="canvas" width="300" height="300"></canvas>
            </div>
        </div>
    </div>

    <script src="script.min.js"></script>
    <script>
        cropInit(
            // show start button
            true
        );
    </script>
</body>
</html>
```

### Demo

You can test the module online : [TakePicJs](https://takepicjs.netlify.com)

### Todos

 - User can rotate the picture
 - User can customize the UI

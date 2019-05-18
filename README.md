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

The user can add button to start the module :

<img src="https://user-images.githubusercontent.com/19781935/57962574-0dd0d580-7908-11e9-846a-c2f5d77dce47.PNG">

if the device dosn't support camera a default video display :

<img src="https://user-images.githubusercontent.com/19781935/57962624-a9fadc80-7908-11e9-9c5d-7ab8151523c7.PNG">

the user can take picture ,add filters and download it :

<img src="https://user-images.githubusercontent.com/19781935/57962655-3a392180-7909-11e9-9c89-364f3f9becea.PNG">

the user can crop and resize the picture :

<img src="https://user-images.githubusercontent.com/19781935/57962689-b3d10f80-7909-11e9-9652-23c10063deb3.PNG">

### Diagram
![v1](https://user-images.githubusercontent.com/19781935/57969316-5f5b7d80-7965-11e9-937c-7fff65637766.PNG)

### Todos

 - User can rotate the picture
 - User can customize the UI

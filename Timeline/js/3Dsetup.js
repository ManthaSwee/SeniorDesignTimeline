var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;

    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

  var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        // A program is a bit of code that lives on the WebGL side of the system
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

  var cubeIndex = 0;
  var cubeVertexPositionBuffer = [];
  var cubeVertexColorBuffer = [];
  var cubeVertexIndexBuffer = [];


function initCube(offset){
    cubeVertexPositionBuffer[cubeIndex] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer[cubeIndex]);
    vertices = [
      // Front face
      -1.0 + offset, -1.0,  1.0,
      1.0 + offset, -1.0,  1.0,
      1.0 + offset,  1.0,  1.0,
      -1.0 + offset,  1.0,  1.0,

      // Back face
      -1.0 + offset, -1.0, -10.0,
      -1.0 + offset,  1.0, -10.0,
      1.0 + offset,  1.0, -10.0,
      1.0 + offset, -1.0, -10.0,

      // Top face
      -1.0 + offset,  1.0, -10.0,
      -1.0 + offset,  1.0,  1.0,
      1.0 + offset,  1.0,  1.0,
      1.0 + offset,  1.0, -10.0,

      // Bottom face
      -1.0 + offset, -1.0, -10.0,
      1.0 + offset, -1.0, -10.0,
      1.0 + offset, -1.0,  1.0,
      -1.0 + offset, -1.0,  1.0,

      // Right face
      1.0 + offset, -1.0, -10.0,
      1.0 + offset,  1.0, -10.0,
      1.0 + offset,  1.0,  1.0,
      1.0 + offset, -1.0,  1.0,

      // Left face
      -1.0 + offset, -1.0, -10.0,
      -1.0 + offset, -1.0,  1.0,
      -1.0 + offset,  1.0,  1.0,
      -1.0 + offset,  1.0, -10.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer[cubeIndex].itemSize = 3;
  cubeVertexPositionBuffer[cubeIndex].numItems = 24;
  if(cubeIndex == 0){
     cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        colors = [
          [1.0, 0.0, 0.0, 1.0],     // Front face
          [1.0, 1.0, 0.0, 1.0],     // Back face
          [0.0, 1.0, 0.0, 1.0],     // Top face
          [1.0, 0.5, 0.5, 1.0],     // Bottom face
          [1.0, 0.0, 1.0, 1.0],     // Right face
          [0.0, 0.0, 1.0, 1.0],     // Left face
        ];
        var unpackedColors = [];
        for (var i in colors) {
          var color = colors[i];
          for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
          }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        cubeVertexColorBuffer.itemSize = 4;
        cubeVertexColorBuffer.numItems = 24;
    }

    cubeVertexIndexBuffer[cubeIndex] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer[cubeIndex]);
    var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer[cubeIndex].itemSize = 1;
  cubeVertexIndexBuffer[cubeIndex].numItems = 36;
  cubeIndex++;
}

  var axonIndex = 0;
  var axonVertexPositionBuffer = [];
  var axonVertexColorBuffer = [];
  var axonVertexIndexBuffer = [];


function initAxon(offset){
    cubeVertexPositionBuffer[cubeIndex] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer[cubeIndex]);
    vertices = [
      // Front face
      -1.0 + offset, -1.0,  1.0,
      1.0 + offset, -1.0,  1.0,
      1.0 + offset,  1.0,  1.0,
      -1.0 + offset,  1.0,  1.0,

      // Back face
      -1.0 + offset, -1.0, -10.0,
      -1.0 + offset,  1.0, -10.0,
      1.0 + offset,  1.0, -10.0,
      1.0 + offset, -1.0, -10.0,

      // Top face
      -1.0 + offset,  1.0, -10.0,
      -1.0 + offset,  1.0,  1.0,
      1.0 + offset,  1.0,  1.0,
      1.0 + offset,  1.0, -10.0,

      // Bottom face
      -1.0 + offset, -1.0, -10.0,
      1.0 + offset, -1.0, -10.0,
      1.0 + offset, -1.0,  1.0,
      -1.0 + offset, -1.0,  1.0,

      // Right face
      1.0 + offset, -1.0, -10.0,
      1.0 + offset,  1.0, -10.0,
      1.0 + offset,  1.0,  1.0,
      1.0 + offset, -1.0,  1.0,

      // Left face
      -1.0 + offset, -1.0, -10.0,
      -1.0 + offset, -1.0,  1.0,
      -1.0 + offset,  1.0,  1.0,
      -1.0 + offset,  1.0, -10.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer[cubeIndex].itemSize = 3;
  cubeVertexPositionBuffer[cubeIndex].numItems = 24;
  if(cubeIndex == 0){
     cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        colors = [
          [1.0, 0.0, 0.0, 1.0],     // Front face
          [1.0, 1.0, 0.0, 1.0],     // Back face
          [0.0, 1.0, 0.0, 1.0],     // Top face
          [1.0, 0.5, 0.5, 1.0],     // Bottom face
          [1.0, 0.0, 1.0, 1.0],     // Right face
          [0.0, 0.0, 1.0, 1.0],     // Left face
        ];
        var unpackedColors = [];
        for (var i in colors) {
          var color = colors[i];
          for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
          }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        cubeVertexColorBuffer.itemSize = 4;
        cubeVertexColorBuffer.numItems = 24;
    }

    cubeVertexIndexBuffer[cubeIndex] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer[cubeIndex]);
    var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer[cubeIndex].itemSize = 1;
  cubeVertexIndexBuffer[cubeIndex].numItems = 36;
  cubeIndex++;
}

function initBuffers() {
  for(var i = -15; i <= 15; i++){
    if(i%3 == 0){
      initCube(i);
    }
  }
}

  var xRot = 0;
  var xSpeed = 0;

  var yRot = 0;
  var ySpeed = 0;

  var z = -25.0;
  var filter = 0;

function drawScene() {
    var canvas = document.getElementById("c");
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //http://stackoverflow.com/questions/11819768/webgl-gl-viewport-change
    var width = canvas.clientWidth;
    var height = Math.max(1, canvas.clientHeight);  // prevent divide by 0
    mat4.perspective(45, width / height, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0.0, 0.0, z]);

    mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);

    for(var i = 0; i < cubeIndex; i++){
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer[i]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer[i]);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
    }
}

var currentlyPressedKeys = {};

function handleKeyDown(event) {
currentlyPressedKeys[event.keyCode] = true;

if (String.fromCharCode(event.keyCode) == "F") {
    filter += 1;
        if (filter == 3) {
            filter = 0;
        }
    }
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[33]) {
    // Page Up
    z -= 0.05;
    }
    if (currentlyPressedKeys[34]) {
    // Page Down
    z += 0.05;
    }
    if (currentlyPressedKeys[37]) {
    // Left cursor key
    ySpeed -= 1;
    }
    if (currentlyPressedKeys[39]) {
    // Right cursor key
    ySpeed += 1;
    }
    if (currentlyPressedKeys[38]) {
    // Up cursor key
    xSpeed -= 1;
    }
    if (currentlyPressedKeys[40]) {
    // Down cursor key
    xSpeed += 1;
    }
}

var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        xRot += (xSpeed * elapsed) / 1000.0;
        yRot += (ySpeed * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}


function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();
}

function webGLStart(){
    var canvas = document.getElementById("c");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
}
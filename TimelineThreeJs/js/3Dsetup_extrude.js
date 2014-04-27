if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
// standard global variables
var container, camera, controls, scene, renderer, splineCamera, cameraHelper, cameraEye;

// custom global variables
var projector, mouse = { x: 0, y: 0 }, INTERSECTED, INTERSECTED_SELECTED;
var targetRotation = 0, targetRotationOnMouseDown = 0;
var mouseX = 0, mouseXOnMouseDown = 0;
var sprite1, canvas1, context1, texture1;
var s_f = .5;

var WIDTH = window.innerWidth;
var HEIGHT = (window.innerHeight - 175) + 2;
var $network = $('#network');

var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

// Keep a dictionary of Curve instances
var splines = {
  cylinder : getTheFuckingSpline(1)
};

var parent;
var tube, tubeMesh;
var animation = false, lookAhead = false;
var scale = 1;
var been_member_for;
var showCameraHelper = false;

function setScale() {
    tubeMesh.scale.set(scale, scale, scale);
}

function addGeometry(geometry, color, child_bool, rank) {
    var calc_opac = rank * 0.01;
    if(calc_opac > 1) calc_opac = 1.0;
    console.log(calc_opac);
    tubeMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        // vertexColors: THREE.VertexColors,
        color: new THREE.Color(getRandomHexColor()),
        side:THREE.DoubleSide,
        opacity: calc_opac,
        wireframe: true
    }));
    //if (geometry.debug) tubeMesh.add(geometry.debug);
    
    parent.add(tubeMesh);
}

function animateCamera(toggle) {
    if (toggle) {
        animation = !animation;
        document.getElementById('animation').value = 'Camera Spline Animation View: ' + (animation? 'ON': 'OFF');
    }
}

function setUpWithFriends(friendlist, user, response){
  init(friendlist, user, response);
}

function init(friendlist, user, response) {
  generateJSON(friendlist, user, response, function(json){
    //SCENE
    scene = new THREE.Scene();
    var num_friends = 2;
    //var num_friends = Object.keys(friendlist).length;

    //CAMERA
    camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 20000 );
    camera.position.set(0,0,-800);
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();

    splineCamera = new THREE.PerspectiveCamera(84, WIDTH / HEIGHT, 0.01, 1000);
    cameraHelper = new THREE.CameraHelper(splineCamera);
    console.log(splineCamera, cameraHelper);
    cameraHelper.visible = false;
    //LIGHTING
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    //PARENT OBJECT
    parent = new THREE.Object3D();
    parent.position.y = 100;
    scene.add(parent);

    cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({ color: 0xdddddd }));
    cameraEye.visible = false;
    parent.add(cameraEye);

    cameraHelper.scale.multiplyScalar(0.1);
    splineCamera.add(cameraHelper);
    parent.add(splineCamera);

    //TRACKBALL CONTROLLER
    var container = document.getElementById( 'container' );
    controls = new THREE.TrackballControls( camera, container);
    controls.rotateSpeed = 1.0; controls.zoomSpeed = 1.2; controls.panSpeed = 0.8;
    controls.noZoom = false; controls.noPan = false;
    controls.staticMoving = true; controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ]; controls.addEventListener( 'change', render );

    //PROJECTOR
    projector = new THREE.Projector();

    //CANVAS ELEMENT
    canvas1 = document.createElement('canvas');
    context1 = canvas1.getContext('2d');
    context1.font = "Bold 20px Arial";
    context1.fillStyle = "rgba(0,0,0,0.95)";
    context1.fillText('Hello, world!', 0, 20);
    texture1 = new THREE.Texture(canvas1);
    texture1.needsUpdate = true;
      
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true} );
    sprite1 = new THREE.Sprite( spriteMaterial );
    sprite1.scale.set(200,100,1.0);
    sprite1.position.set( 50, 50, 0 );
    scene.add( sprite1 );

    //ORIGIN CYLINDER SET UP
    var angle = 0.0;
    var angleIncrement = Math.round(360.0 / num_friends);
    // var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshBasicMaterial( { color: 0x63ad44 }));
    // cylinder.overdraw = true;
    // scene.add(cylinder);

    been_member_for = Date.daysBetween(json[0].joined_date, new Date());
    addTube(false, 0x0f92bd, getTheFuckingSpline(1), 100);
    scene.network = tubeMesh;
    scene.network.friends = [];
    
    //CYLINDER CHILD
    for(var i = 1; i < (num_friends+1); i++){
      var rank = json[i].friend[0].rank;
      addTube(true, 0xca3092, getTheFuckingSplineInteractions(rank, json[i].friend[0].interactions, new Date(json[i].friend[0].startdate)), rank);
      var cylinderChild = tubeMesh; 
      cylinderChild.person = json[i].friend[0];
      cylinderChild.name = json[i].friend[0].fbid;
      scene.network.friends[i] = cylinderChild;
        
      //cylinderChild.applyMatrix( new THREE.Matrix4().makeTranslation( 100, 0, 0));
      cylinderChild.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
      angle += angleIncrement;
    }
    tubeMesh = scene.network;
    tube = tubeMesh.geometry;

    //RENDERER
    renderer = new THREE.WebGLRenderer( { 
     alpha: true,
     canvas: document.getElementById('network'),
     antialias: true } );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.setClearColor( 0xbdc3c7, 1);
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
    renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);

    scene.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -400, 0));

    animate();

function getTheFuckingSplineInteractions(rank, interactions, start){
    var dates = [];
    dates[0] = start;
    for(var i = 1; i < interactions.length; i++){
        var date = new Date(interactions[i].date);
        dates[i] = date;
    }
    dates[i++] = new Date();

    var vertices = getVerticesFromDates(rank, json[0].joined_date, dates);

    //SPLINE
    var numPoints = 100;
    var factor = 3;

    var spline = new THREE.SplineCurve3(vertices);
    return spline;
}

function getVerticesFromDates(rank, point_a, dates){
    var vertices = [];
    var value = rank;
    vertices[0] = new THREE.Vector3(15, Math.floor(Date.daysBetween(point_a, dates[0])*s_f), 0);
    for (var i = 1; i < dates.length; i++){
        var v = Math.floor(Date.daysBetween(point_a, dates[i])*s_f);
        vertices[i] = new THREE.Vector3(value, v, 0);
        if(i%2 == 1 && i != 0) value+=100;
    }
    return vertices;
}

  });
}

function getTheFuckingSpline(f){
    var cylinder = new THREE.SplineCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, Math.floor(been_member_for*s_f), 0)]);
    return cylinder;
}

function getRandomHexColor(){
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}








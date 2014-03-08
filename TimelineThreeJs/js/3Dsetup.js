  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var camera, controls, scene, renderer, container;
  var WIDTH = window.innerWidth;
  var HEIGHT = (window.innerHeight - 175) + 2;
  var $network = $('#network');

  function setUpWithFriends(friendlist){
    init(friendlist);
    animate();
  }

  function init(friendlist) {
    var num_friends = 8;
    //var num_friends = Object.keys(friendlist).length;
    camera = new THREE.PerspectiveCamera( 45, $network.width() / $network.height(), 1, 10000 );
    camera.position.z = 700;
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    
    container = document.getElementById( 'container' );

    controls = new THREE.TrackballControls( camera, container );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    // world
    scene = new THREE.Scene();

    // smooth my curve over this many points
    var numPoints = 100;
    var factor = 0.25;

    var spline = new THREE.SplineCurve3([
       new THREE.Vector3(0, 0, 0),
       new THREE.Vector3(0, 100*factor, 0),
       new THREE.Vector3(100*factor, 100*factor, 0),
       new THREE.Vector3(100*factor, 200*factor, 0),
       new THREE.Vector3(200*factor, 200*factor, 0),
       new THREE.Vector3(200*factor, 300*factor, 0),
       new THREE.Vector3(300*factor, 300*factor, 0),
       new THREE.Vector3(300*factor, 400*factor, 0),
       new THREE.Vector3(400*factor, 400*factor, 0)
    ]);

    var material = new THREE.LineBasicMaterial({
        color: 0xff00f0,
    });

    var spline_geometry = new THREE.Geometry();
    var splinePoints = spline.getPoints(numPoints);

    for(var i = 0; i < splinePoints.length; i++){
        spline_geometry.vertices.push(splinePoints[i]);  
    }

    var angle = 0.0;
    var angleIncrement = Math.round(360.0 / num_friends);

    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
    cylinder.overdraw = true;
    scene.add(cylinder);

    for(var i = 0; i < num_friends; i++){
      var cylinderChild = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
      cylinderChild.overdraw = true;
      cylinder.add(cylinderChild);

      var line = new THREE.Line(spline_geometry, material);
      cylinder.add(line);
      line.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
      
      cylinderChild.applyMatrix( new THREE.Matrix4().makeTranslation( 100, 0, 0));
      cylinderChild.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
      console.log(angle);
      angle += angleIncrement;
    }

    // renderer
    renderer = new THREE.WebGLRenderer( { 
     alpha: true,
     canvas: document.getElementById('network'),
     antialias: true } );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.setClearColor( 0x222222, 1);
    window.addEventListener( 'resize', onWindowResize, false );
  }

  function render() {
    renderer.render( scene, camera );
  }

  function onWindowResize() {
    WIDTH = window.innerWidth;
    HEIGHT = (window.innerHeight - 175) + 2;
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize( WIDTH, HEIGHT );

    controls.handleResize();

    render();
  }

  function animate() {
    requestAnimationFrame( animate );
    controls.update();
  }
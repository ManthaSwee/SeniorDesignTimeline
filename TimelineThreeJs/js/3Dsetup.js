  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var camera, controls, scene, renderer, container;
  var WIDTH = window.innerWidth;
  var HEIGHT = (window.innerHeight - 175) + 2;
  var $network = $('#network');

  function setUpWithFriends(friendlist){
    console.log(friendlist);
    init(friendlist);
    animate();
  }

  function init(friendlist) {
    var num_friends = Object.keys(friendlist).length;
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

    var angle = 0.0;
    var angleIncrement = Math.round(num_friends / 360.0 * 100) / 100 - .01;
    console.log(angleIncrement);

    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
    cylinder.overdraw = true;
    scene.add(cylinder);

    for(var i = 0; i < num_friends; i++){
      var cylinderChild = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
      cylinderChild.overdraw = true;
      cylinder.add(cylinderChild);
      cylinderChild.applyMatrix( new THREE.Matrix4().makeTranslation( 1000, 0, 0));
      cylinderChild.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
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
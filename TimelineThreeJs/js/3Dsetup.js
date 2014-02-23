//needed for document.body to load
window.onload = function() {
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var camera, controls, scene, renderer;
  var $network = $('#network');

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera( 45, $network.width() / $network.height(), 1, 1000 );
    camera.position.z = 700;

    controls = new THREE.TrackballControls( camera );
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

    var angle = 0;

    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
    cylinder.overdraw = true;
    scene.add(cylinder);

    for(var i = 0; i < 10; i++){
      var cylinderChild = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
      cylinderChild.overdraw = true;
      cylinder.add(cylinderChild);
      cylinderChild.applyMatrix( new THREE.Matrix4().makeTranslation( 100, 0, 0));
      cylinderChild.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
      angle += 36;
    }

    // renderer
    renderer = new THREE.WebGLRenderer( { 
     alpha: true,
     canvas: document.getElementById('network'),
     antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    window.addEventListener( 'resize', onWindowResize, false );
  }

  function render() {
    renderer.render( scene, camera );
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();

    render();
  }

  function animate() {
    requestAnimationFrame( animate );
    controls.update();
  }
}
























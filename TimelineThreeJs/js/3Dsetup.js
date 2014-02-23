//needed for document.body to load
window.onload = function() {
      // revolutions per second
      var angularSpeed = 0.2; 
      var lastTime = 0;
      var $network = $("#network");
 
      // this function is executed on each animation frame
      function animate(){
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;
        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
        cylinder.rotation.x += angleChange;
        lastTime = time;
 
        // render
        renderer.render(scene, camera);
 
        // request new frame
        requestAnimationFrame(function(){
            animate();
        });
      }
 
      // renderer
      var renderer = new THREE.WebGLRenderer( {
                         canvas: document.getElementById("network"),
                         antialias: true
                     } );
      renderer.setSize($network.width(), $network.height());
 
      // camera
      var camera = new THREE.PerspectiveCamera(45, $network.width() / $network.height(), 1, 1000);
      camera.position.z = 700;
 
      // scene
      var scene = new THREE.Scene();
                
      // cylinder
      // API: THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight)
      var distX = -450;

      var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
      cylinder.overdraw = true;
      scene.add(cylinder);
      
      for(var i = 0; i < 10; i++){
        var cylinderChild = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshNormalMaterial());
        cylinderChild.overdraw = true;
        cylinder.add(cylinderChild);
        cylinderChild.applyMatrix( new THREE.Matrix4().makeTranslation( distX, 0, 0));
        distX+=100;
      }
 
      // start animation
      animate();
}

























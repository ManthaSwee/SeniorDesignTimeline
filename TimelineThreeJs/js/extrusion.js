
    var container;

    var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;

    var text, plane;

    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;

    var mouseX = 0;
    var mouseXOnMouseDown = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();

    var formula = 'cos(2*t) * (1 + 0.4*cos(7*t) + 0.485*cos(9*t)), sin(2*t) * (1 + 0.4*cos(7*t) + 0.485*cos(9*t)), 0.3*sin(9*t)';
    var range = '0, Math.PI*2';

    var customCurve, customTorus;

    function processFormula() {
      var xyz = formula.split(',');
      xyz[0] = 'x = ' + xyz[0] + ';';
      xyz[1] = 'y = ' + xyz[1] + ';';
      xyz[2] = 'z = ' + xyz[2] + ';';


      var code = 'splines.CustomCurve = new (THREE.Curve.create( function(s) { this.scale = (s === undefined) ? 40 : s; }, function(t) { t = scaleTo(0, Math.PI*2, t); var x, y, z; '
        + xyz.join('') + 'return new THREE.Vector3(x, y, z).multiplyScalar(this.scale); } ) );';
      eval(code);
    }

    var pipeSpline = new THREE.SplineCurve3([
        new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10), new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10), new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30), new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30), new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30), new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30), new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10), new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10), new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10), new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10), new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10), new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10), new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0), new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)]);

    // Keep a dictionary of Curve instances
    var splines = {
      PipeSpline: pipeSpline
    };

    processFormula();

    extrudePath = new THREE.Curves.TrefoilKnot();

    var dropdown = '<select id="dropdown" onchange="addTube(this.value)">';

    var s;
    for ( s in splines ) {
      dropdown += '<option value="' + s + '"';
      dropdown += '>' + s + '</option>';
    }

    dropdown += '</select>';

    var closed2 = true;
    var debug = true;
    var parent;
    var tube, tubeMesh;
    var animation = false, lookAhead = false;
    var scale;
    var showCameraHelper = false;

    function setScale() {

      scale = parseInt(document.getElementById('scale').value);
      tubeMesh.scale.set(scale, scale, scale);

    }


    function addGeometry(geometry, color) {

        // 3d shape
        tubeMesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
          new THREE.MeshLambertMaterial({
              color: color,
              opacity: (geometry.debug) ? 0.2 : 0.8,
              transparent: true
          }),
         new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.5,
            wireframe: true
        })]);

        if (geometry.debug) tubeMesh.add(geometry.debug);

        //mesh.children[0].doubleSided = true;
        parent.add(tubeMesh);

    }

    function animateCamera(toggle) {

      if (toggle) {
        animation = !animation;
        document.getElementById('animation').value = 'Camera Spline Animation View: ' + (animation? 'ON': 'OFF');
      }
      
      lookAhead = document.getElementById('lookAhead').checked;

      showCameraHelper = document.getElementById('cameraHelper').checked;

      cameraHelper.children[0].visible = showCameraHelper;
      cameraEye.visible = showCameraHelper;
    }

window.onload = function() {
    init();
    animate();

    function init() {

      container = document.createElement('div');
      console.log(document.body);
      document.body.appendChild(container);

      var info = document.createElement('div');
      info.style.position = 'absolute';
      info.style.top = '10px';
      info.style.width = '100%';
      info.style.textAlign = 'center';
      info.innerHTML = 'Spline Extrusion Examples by <a href="http://www.lab4games.net/zz85/blog">zz85</a><br/>Select spline:';

      info.innerHTML += dropdown;

      info.innerHTML += '<br/>Scale: <select id="scale" onchange="setScale()"><option>1</option><option>2</option><option selected>4</option><option>6</option><option>10</option></select>';
      info.innerHTML += '<br/>Extrusion Segments: <select onchange="addTube()" id="segments"><option>50</option><option selected>100</option><option>200</option><option>400</option></select>';
      info.innerHTML += '<br/>Radius Segments: <select id="radiusSegments" onchange="addTube()"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option><option>8</option><option>12</option></select>';
      info.innerHTML += '<br/>Debug normals: <input id="debug" type="checkbox" onchange="addTube()"  /> Closed:<input id="closed" onchange="addTube()" type="checkbox" checked />';

      info.innerHTML += '<br/><br/><input id="animation" type="button" onclick="animateCamera(true)" value="Camera Spline Animation View: OFF"/><br/> Look Ahead <input id="lookAhead" type="checkbox" onchange="animateCamera()" /> Camera Helper <input id="cameraHelper" type="checkbox" onchange="animateCamera()" />';

      container.appendChild(info);

      scene = new THREE.Scene();

      // 
      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
      splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
      cameraHelper = new THREE.CameraHelper(splineCamera);

      camera.position.set(0, 80, 500);
      
      scene.add(camera);

      
      var light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 0, 1);
      scene.add(light);

      parent = new THREE.Object3D();
      parent.position.y = 100;
      scene.add(parent);

      addTube();

      // Debug point
      cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({
          color: 0xdddddd
      }));

      parent.add(cameraEye);

      cameraHelper.scale.multiplyScalar(0.1);
      splineCamera.add(cameraHelper);
      parent.add(splineCamera);

      //
      var canvas = document.getElementById("helper_canvas");
      renderer = new THREE.WebGLRenderer({
          antialias: true,
          canvas: canvas
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(renderer.domElement);

      renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
      renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
      renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);

    }

    //

    function onDocumentMouseDown(event) {

      event.preventDefault();

      renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
      renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);

      mouseXOnMouseDown = event.clientX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;

    }

    function onDocumentMouseMove(event) {

      mouseX = event.clientX - windowHalfX;

      targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

    }

    function onDocumentMouseUp(event) {

      renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
      renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);

    }

    function onDocumentMouseOut(event) {

      renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
      renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);

    }

    function onDocumentTouchStart(event) {

      if (event.touches.length == 1) {

          event.preventDefault();

          mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
          targetRotationOnMouseDown = targetRotation;

      }

    }

    function onDocumentTouchMove(event) {

      if (event.touches.length == 1) {

          event.preventDefault();

          mouseX = event.touches[0].pageX - windowHalfX;
          targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

      }

    }

    //

    function animate() {

      requestAnimationFrame(animate);

      render();

    }

    function render() {

      // Try Animate Camera Along Spline
      var time = Date.now();
      var looptime = 20 * 1000;
      var t = (time % looptime) / looptime;

      var pos = tube.path.getPointAt(t);
      pos.multiplyScalar(scale);

      // interpolation
      var segments = tube.tangents.length;
      var pickt = t * segments;
      var pick = Math.floor(pickt);
      var pickNext = (pick + 1) % segments;

      binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
      binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);


      var dir = tube.path.getTangentAt(t);

      var offset = 15;

      normal.copy(binormal).cross(dir);

      // We move on a offset on its binormal
      pos.add(normal.clone().multiplyScalar(offset));

      splineCamera.position = pos;
      cameraEye.position = pos;


      // Camera Orientation 1 - default look at
      // splineCamera.lookAt(lookAt);

      // Using arclength for stablization in look ahead.
      var lookAt = tube.path.getPointAt((t + 30/tube.path.getLength()) % 1).multiplyScalar(scale);
      
      // Camera Orientation 2 - up orientation via normal
      if (!lookAhead)
      lookAt.copy(pos).add(dir);
      splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
      splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix);

      cameraHelper.update();

      parent.rotation.y += (targetRotation - parent.rotation.y) * 0.05;

      if (animation) {

        renderer.render(scene, splineCamera);

      } else {

        renderer.render(scene, camera);

      }

      
      
    }
}

    function addTube() {

      var value = document.getElementById('dropdown').value;

      if (value=='CustomCurve') {
         
        var tmp = prompt('Enter curve formula eg. sin(t),cos(t),cos(t/2)', formula);
        if (tmp && tmp!=formula) {
          formula = tmp;
          processFormula();
        }
      } else if (value == 'CustomTorus') {
        
        var p = prompt('p value', 2);
        if (p!== undefined) {
          splines.CustomTorus.p = parseFloat(p);
        }

        var q = prompt('q value', 3);
        if (q!== undefined) {
          splines.CustomTorus.q = parseFloat(q);
        }

        var r = prompt('r value', 0.5);
        if (r!== undefined) {
          splines.CustomTorus.r = parseFloat(r);
        }


      }
      
      var segments = parseInt(document.getElementById('segments').value);
      closed2 = document.getElementById('closed').checked;
      debug = document.getElementById('debug').checked;

      var radiusSegments = parseInt(document.getElementById('radiusSegments').value);

      console.log('adding tube', value, closed2, debug, radiusSegments);
      if (tubeMesh) parent.remove(tubeMesh);

      extrudePath = splines[value];
      
      tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2, debug);

      addGeometry(tube, 0xff00ff);
      setScale();
    
    }

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      // standard global variables
      var camera, controls, scene, renderer;

      // custom global variables
      var projector, mouse = { x: 0, y: 0 }, INTERSECTED, INTERSECTED_SELECTED;
      var sprite1;
      var canvas1, context1, texture1;

      var WIDTH = window.innerWidth;
      var HEIGHT = (window.innerHeight - 175) + 2;
      var $network = $('#network');
  function setUpWithFriends(friendlist, response){
    init(friendlist, response);
  }

  function init(friendlist, response) {
    generateJSON(friendlist, response, function(json){
      //SCENE
      scene = new THREE.Scene();
      //console.log(json);
      var num_friends = 10;
      //var num_friends = Object.keys(friendlist).length;

      //CAMERA
      camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 20000 );
      camera.position.set(0,0,700);
      camera.lookAt(scene.position);
      camera.updateProjectionMatrix();

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
      
      // canvas contents will be used for a texture
      texture1 = new THREE.Texture(canvas1);
      texture1.needsUpdate = true;
      
      var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true} );
      sprite1 = new THREE.Sprite( spriteMaterial );
      sprite1.scale.set(200,100,1.0);
      sprite1.position.set( 50, 50, 0 );
      scene.add( sprite1 );   

      //SPLINE
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

      //ORIGIN CYLINDER SET UP
      var angle = 0.0;
      var angleIncrement = Math.round(360.0 / num_friends);

      var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshBasicMaterial( { color: 0x63ad44 }));
      cylinder.overdraw = true;
      scene.add(cylinder);

      //CYLINDER CHILD
      for(var i = 0; i < num_friends; i++){
        var cylinderChild = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 20, 20, false), new THREE.MeshBasicMaterial( { color: 0x9b59b6 }));
        cylinderChild.overdraw = true;
        cylinderChild.person = json[i];
        cylinderChild.name = json[i].name;
        cylinder.add(cylinderChild);

        //var line = new THREE.Line(spline_geometry, material);
        //cylinder.add(line);
        //line.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
        
        cylinderChild.applyMatrix( new THREE.Matrix4().makeTranslation( 100, 0, 0));
        cylinderChild.applyMatrix( new THREE.Matrix4().makeRotationY(angle));
        angle += angleIncrement;
      }

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

      animate();
    });
  }

      function render() {
        renderer.render( scene, camera );
      }
      
      function onDocumentMouseMove( event ) {
          // the following line would stop any other event handler from firing (such as the mouse's TrackballControls)
          // event.preventDefault();

          sprite1.position.set( 0, 0, 0 );
          mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
          mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;
      }

      function onDocumentMouseDown( event ) {
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector.unprojectVector( vector, camera );
        
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        var intersects = ray.intersectObjects( scene.children[1].children );

        if ( intersects.length > 0 ) {
            // if the closest object intersected is not the currently stored intersection object
            if ( intersects[ 0 ].object != INTERSECTED_SELECTED ) {
                // restore previous intersection object (if it exists) to its original color
                if ( INTERSECTED_SELECTED ) {
                    INTERSECTED_SELECTED.material.color.setHex( INTERSECTED_SELECTED.currentHex );
                }
                // store reference to closest object as current intersection object
                INTERSECTED_SELECTED = intersects[ 0 ].object;
                // set a new color for closest object
                INTERSECTED_SELECTED.material.color.setHex( 0x5944ad );
            }
            else {
                INTERSECTED_SELECTED.material.color.setHex( INTERSECTED_SELECTED.currentHex );
                INTERSECTED_SELECTED = null;
                update();
            }
        } 
        controls.update();
      }

      function selectObjectViaList( name ) {
        // restore previous intersection object (if it exists) to its original color
        if ( INTERSECTED_SELECTED ) {
            INTERSECTED_SELECTED.material.color.setHex( INTERSECTED_SELECTED.currentHex );
        }
        for(var i = 0; i < scene.children[1].children.length; i++){
          if(name === scene.children[1].children[i].person.name){
            INTERSECTED_SELECTED = scene.children[1].children[i];
            INTERSECTED_SELECTED.currentHex = INTERSECTED_SELECTED.material.color.getHex();
            INTERSECTED_SELECTED.material.color.setHex( 0x5944ad );
          }
        }
        // store reference to closest object as current intersection object
        //INTERSECTED_SELECTED = intersects[ 0 ].object;
        // set a new color for closest object
        //INTERSECTED_SELECTED.material.color.setHex( 0x3c3c3c );
      }

      function onWindowResize() {
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize( WIDTH, HEIGHT );

        controls.handleResize();

        render();
      }

      function animate() {
        requestAnimationFrame( animate );
        render();
        controls.update();       
        update();
      }

      function update() {
          // create a Ray with origin at the mouse position
          //   and direction into the scene (camera direction)
          var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
          projector.unprojectVector( vector, camera );
          
          var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

          // create an array containing all objects in the scene with which the ray intersects
          var intersects = ray.intersectObjects( scene.children[1].children );
          // INTERSECTED = the object in the scene currently closest to the camera 
          //      and intersected by the Ray projected from the mouse position    
        
          // if there is one (or more) intersections
          if ( intersects.length > 0 ) {
              // if the closest object intersected is not the currently stored intersection object
              if ( intersects[ 0 ].object != INTERSECTED) {
                // restore previous intersection object (if it exists) to its original color
                if ( INTERSECTED  && INTERSECTED != INTERSECTED_SELECTED) {
                    INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                }
                // store reference to closest object as current intersection object
                INTERSECTED = intersects[ 0 ].object;
                // store color of closest object (for later restoration)
                if( INTERSECTED != INTERSECTED_SELECTED) {
                  INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                  // set a new color for closest object
                  INTERSECTED.material.color.setHex( 0xad4498 );
                }
                // update text, if it has a "name" field.
                if ( intersects[ 0 ].object.name ) {
                    context1.clearRect(0,0,640,480);
                    var message = intersects[ 0 ].object.name;
                    var metrics = context1.measureText(message);
                    var width = metrics.width;
                    context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
                    context1.fillRect( 0,0, width+8,20+8);
                    context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                    context1.fillRect( 2,2, width+4,20+4 );
                    context1.fillStyle = "rgba(0,0,0,1)"; // text color
                    context1.fillText( message, 4,20 );
                    texture1.needsUpdate = true;
                }
                else {
                    context1.clearRect(0,0,300,300);
                    texture1.needsUpdate = true;
                }
            } else if (INTERSECTED != INTERSECTED_SELECTED) {
              INTERSECTED.material.color.setHex( 0xad4498 );
            }
          } 
          // there are no intersections 
          else{
               // restore previous intersection object (if it exists) to its original color
             if ( INTERSECTED &&  INTERSECTED != INTERSECTED_SELECTED) 
                  INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
              // remove previous intersection object reference
              //     by setting current intersection object to "nothing"
              INTERSECTED = null;
              context1.clearRect(0,0,300,300);
              texture1.needsUpdate = true;
          }
        controls.update();
      }
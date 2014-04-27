function render() {

  // Try Animate Camera Along Spline
  var time = Date.now();
  var looptime = 20 * 1000;
  var t = (time % looptime) / looptime;

  var pos = tube.parameters.path.getPointAt(t);
  pos.multiplyScalar(scale);

      // interpolation
  var segments = tube.tangents.length;
  var pickt = t * segments;
  var pick = Math.floor(pickt);
  var pickNext = (pick + 1) % segments;

  binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
  binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);

  var dir = tube.parameters.path.getTangentAt(t);
  var offset = 15;

  normal.copy(binormal).cross(dir);

  // We move on a offset on its binormal
  pos.add(normal.clone().multiplyScalar(offset));

  splineCamera.position = pos;
  cameraEye.position = pos;
  // Camera Orientation 1 - default look at
  // splineCamera.lookAt(lookAt);

  // Using arclength for stablization in look ahead.
  var lookAt = tube.parameters.path.getPointAt((t + 30/tube.parameters.path.getLength()) % 1).multiplyScalar(scale);
      
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
  } }
function onDocumentMouseMove( event ) {
  mouseX = event.clientX - WIDTH/2;
  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
  sprite1.position.set( 0, 0, 0 );
  mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
  mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;}
function onDocumentMouseDown( event ) {
  event.preventDefault();
  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  projector.unprojectVector( vector, camera );
  
  renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
  renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);

  mouseXOnMouseDown = event.clientX - (WIDTH/2);
  targetRotationOnMouseDown = targetRotation;
  
  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
  var intersects = ray.intersectObjects( scene.network.friends );

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
          updateSelectedInfo();
      }
      else {
          INTERSECTED_SELECTED.material.color.setHex( INTERSECTED_SELECTED.currentHex );
          INTERSECTED_SELECTED = null;
          update();
      }
  } 
  controls.update();}
function onDocumentMouseUp(event) {
  renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
  renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);}
function onDocumentMouseOut(event) {
  renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
  renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);}
function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
  }}
function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
  }}
function selectObjectViaList( name ) {
  // restore previous intersection object (if it exists) to its original color
  if ( INTERSECTED_SELECTED ) {
      INTERSECTED_SELECTED.material.color.setHex( INTERSECTED_SELECTED.currentHex );
  }
  for(var i = 0; i < scene.network.friends.length; i++){
    if(name === scene.network.friends[i].person.name){
      INTERSECTED_SELECTED = scene.network.friends[i];
      INTERSECTED_SELECTED.currentHex = INTERSECTED_SELECTED.material.color.getHex();
      INTERSECTED_SELECTED.material.color.setHex( 0x5944ad );
    }
  }
  updateSelectedInfo();
}
function updateSelectedInfo(){
  var $selected = $('#selected_info');
  $selected.empty();
  $selected.append("name : " + INTERSECTED_SELECTED.person.name);
  $selected.append("<br>");
  $selected.append("fbid : " + INTERSECTED_SELECTED.person.fbid);
  $selected.append("<br>");
  $selected.append("likes : " + INTERSECTED_SELECTED.person.likes);
  $selected.append("<br>");
  $selected.append("photo : " + INTERSECTED_SELECTED.person.photo);
  $selected.append("<br>");
  $selected.append("likes : " + INTERSECTED_SELECTED.person.startdate);
  $selected.append("<br>mutual friends : <br>");
  for(var i = 0; i < INTERSECTED_SELECTED.person.mutualfriends.length; i++){
    $selected.append("&nbsp;&nbsp;&nbsp;&nbsp;" + INTERSECTED_SELECTED.person.mutualfriends[i].name + " , " + INTERSECTED_SELECTED.person.mutualfriends[i].id + "<br>");
  }
  $selected.append("photos : <br>");
  for(var k = 0; k < INTERSECTED_SELECTED.person.photos.length; k++){
    $selected.append("&nbsp;&nbsp;&nbsp;&nbsp;" + INTERSECTED_SELECTED.person.photos[k].date + "<br>");
    $selected.append("&nbsp;&nbsp;&nbsp;&nbsp;" + INTERSECTED_SELECTED.person.photos[k].id + "<br>");
    for(var j = 0; j < INTERSECTED_SELECTED.person.photos[k].tags.length; j++){
      // console.log(INTERSECTED_SELECTED.person.photos[k].tags[j].name);
      $selected.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + INTERSECTED_SELECTED.person.photos[k].tags[j].name.name + "<br>");
    }
  }}
function update() {
  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  projector.unprojectVector( vector, camera );
  
  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects( scene.network.friends);
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
            var message = intersects[ 0 ].object.person.name;
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
  controls.update();}
function onWindowResize() {
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize( WIDTH, HEIGHT );
  controls.handleResize();
  render();}
function animate() {
  requestAnimationFrame( animate );
  render();
  controls.update();     
  update();
}
function addTube(child_bool, color, spline, rank) {
  if (tubeMesh && !child_bool) parent.remove(tubeMesh);
  extrudePath = spline;

  //path, segments, _ , radiusSegments, closed, debug
  tube = new THREE.TimelineGeometry(extrudePath, been_member_for , 1, 4, false);
  console.log(tube);
  addGeometry(tube, color, child_bool, rank);}
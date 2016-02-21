
/*  Show a cube with six differently colored sides using Three.js.
 *  The cube can be rotated using the arrow keys.  The home key
 *  or the return key will reset the rotation to zero.  WebGL
 *  will be used if available.  If not, the program will attempt
 *  to use the canvas 2D API.
 */
// The variables renderer, scene, and camera are the basic requirements
// for making an image using three.js.
var renderer;  // A three.js WebGL or Canvas renderer.
var scene;     // The 3D scene that will be rendered, containing the cube.
var camera;    // The camera that takes the picture of the scene.
var parent;
var target;
var cube; // The three.js object that represents the cube.
var rotateX = 0.4;   // rotation of cube about the x-axis
var rotateY = -0.5;  // rotation of cube about the y-axis
/*  This function is called by the init() method.  Its purpose is
 *  to add objects to the scene.  The scene, camera, and renderer
 *  objects have already been created.
 */
function createWorld() {

  // Parent
  parent = new THREE.Object3D();
  scene.add(parent);

  // PLY Model
  var loader = new THREE.PLYLoader();
  loader.load( 'models/epic.ply', function ( geometry ) {

    geometry.computeFaceNormals();

    var material = new THREE.MeshStandardMaterial( { color: 0x0055ff } );
    var mesh = new THREE.Mesh( geometry, material );

    mesh.position.y = -5;
    mesh.scale.set(1200,1200,1200);

    mesh.scale.multiplyScalar( 0.001 );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    //parent.add( mesh );

  } );

  // OBJMTL model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load( 'models/KingdomKey.mtl', function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.load( 'models/KingdomKey.obj', function ( object ) {
      object.rotation.set(0.2,0.2,0);  // set initial rotation
      object.scale.set(0.6,0.6,0.6);
      object.position.y = -5;
      //parent.add( object );
    }, onProgress, onError );
  });

  // OBJ Model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
    cube.rotation.set(rotateX,rotateY,0);
  };
  var onError = function ( xhr ) {
  };
  var loader = new THREE.OBJLoader();
  loader.load( 'models/mouse.obj', function ( object ) {
    object.rotation.set(0.2,0.2,0);  // set initial rotation
    object.scale.set(4,4,4);
    object.position.y = -5;
    parent.add( object );
  }, onProgress, onError );

  // Cube
  var cubeGeometry = new THREE.CubeGeometry(10,10,10);
  var cubeMaterial = new THREE.MeshFaceMaterial( [  // one material for each face
    new THREE.MeshLambertMaterial( { color: "green" } ),   // +x face of cube
    new THREE.MeshLambertMaterial( { color: "magenta" } ), // -x face of cube
    new THREE.MeshLambertMaterial( { color: "blue" } ),    // +y face of cube
    new THREE.MeshLambertMaterial( { color: "yellow" } ),  // -y face of cube
    new THREE.MeshLambertMaterial( { color: "red" } ),     // +z face of cube
    new THREE.MeshLambertMaterial( { color: "cyan" } )     // -z face of cube
  ] );
  cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  cube.rotation.set(rotateX,rotateY,0);  // set initial rotation
  //scene.add(cube);

  var light = new THREE.HemisphereLight( 0x0a0a0a, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );

}
/**
 *  The render fucntion creates an image of the scene from the point of view
 *  of the camera and displays it in the canvas.  This is called at the end of
 *  init() to produce the initial view of the cube, and it is called each time
 *  the user presses an arrow key, return, or home.
 */
function render() {
  renderer.render(scene, camera);
}
/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 */
function doKey(evt) {
  var id = window.setTimeout(function() {}, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
  var duration = 1000;
  for (i = 0; i < duration; i++) {
    window.setTimeout(function(which) {
      var degree = (duration - which)/duration;
      degree = Math.exp(degree)-1;
      doMove(evt, degree);
    }, 5*i, i);
  }
}
/**
 *  Move the mouse in a direction
 */
function doMove(evt, degree) {
  var rotationChanged = true;
  var amount = 0.02*degree;
  switch (evt.keyCode) {
    case 37: rotateY -= amount; break;        // left arrow
    case 39: rotateY += amount; break;       // right arrow
    case 38: rotateX -= amount; break;        // up arrow
    case 40: rotateX += amount; break;        // down arrow
    case 13: rotateX = rotateY = 0; break;  // return
    case 36: rotateX = rotateY = 0; break;  // home
    default: rotationChanged = false;
  }
  if (rotationChanged) {
    parent.rotation.set(rotateX,rotateY,0);
    cube.rotation.set(rotateX,rotateY,0);
    render();
    evt.preventDefault();
  }
}
/**
 *  This function is called by the onload event so it will run after the
 *  page has loaded.  It creates the renderer, canvas, and scene objects,
 *  calls createWorld() to add objects to the scene, and renders the
 *  initial view of the scene.  If an error occurs, it is reported.
 */
function init() {
  try {
    var theCanvas = document.getElementById("cnvs");
    if (!theCanvas || !theCanvas.getContext) {
      document.getElementById("message").innerHTML = 
        "Sorry, your browser doesn't support canvas graphics.";
      return;
    }
    try {  // try to create a WebGLRenderer
      if (window.WebGLRenderingContext) {
        renderer = new THREE.WebGLRenderer( { 
          canvas: theCanvas, 
          antialias: true
        } );
      } 
    }
    catch (e) {
    }
    if (!renderer) { // If the WebGLRenderer couldn't be created, try a CanvasRenderer.
      renderer = new THREE.CanvasRenderer( { canvas: theCanvas } );
      renderer.setSize(theCanvas.width,theCanvas.height);
      document.getElementById("message").innerHTML =
        "WebGL not available; falling back to CanvasRenderer.";
    }
    renderer.setClearColor(0xffffff);  // dark violet background
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, theCanvas.width/theCanvas.height, 0.1, 100);
    camera.position.z = 25;
    createWorld();
    render();
    document.addEventListener("keydown", doKey, false);
  }
  catch (e) {
    document.getElementById("message").innerHTML = "Sorry, an error occurred: " + e;
  }
}

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GameController } from './GameController.js';

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.controller == null

        this.restart = false;
    }
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;

        this.aspect = window.innerWidth / window.innerHeight;


        this.controller = new GameController(this);

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(5,5,20)
        this.cameras['Perspective'] = perspective1        
        

        const perspectiveCar = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        //perspectiveCar.position.set(0,0.5,-4);
        perspectiveCar.lookAt(10, 10, 55);    
        this.cameras['PerspectiveCar'] = perspectiveCar   

        const mainMenu = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        mainMenu.position.set(-15, -20, 10);
        mainMenu.lookAt(-15, -20, 10);
        this.cameras['MainMenu'] = mainMenu;

        const pausedMenu = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        pausedMenu.position.set(0, 5, 0);
        pausedMenu.lookAt(0, 5, 0);
        this.cameras['PausedMenu'] = pausedMenu;

        const parkingLot = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        parkingLot.position.set(0,7,10);
        parkingLot.lookAt(0, 0, 0);
        this.cameras['ParkingLot'] = parkingLot;

        const obstaclesPark = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        obstaclesPark.position.set(17,0.5,0);
        obstaclesPark.lookAt(20, 1, 0);
        this.cameras['ObstaclesPark'] = obstaclesPark;

        const trackView = new THREE.PerspectiveCamera( 115, aspect, 0.1, 1000 );
        trackView.position.set(2.5,10,16);
        trackView.lookAt(2.5, 1, 16);
        trackView.rotation.z = -Math.PI/2
        this.cameras['trackView'] = trackView;

        const endMenu = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        endMenu.position.set(0, 0, 17);
        endMenu.lookAt(0, 0, 0);
        this.cameras['endMenu'] = endMenu;


    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    getActiveCamera() {
        return this.cameras[this.activeCameraName]
    }

    updateCameraIfRequired() {

        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            this.onResize()

            if(this.activeCameraName === 'PerspectiveCar'){
                return;
            }

            if(this.activeCameraName === 'MainMenu'){
                return;
            }

            if(this.activeCameraName === 'PausedMenu'){
                return;
            }

            if(this.activeCameraName === 'ParkingLot'){
                return;
            }

            if(this.activeCameraName === 'ObstaclesPark'){
                return;
            }

            if(this.activeCameraName === 'trackView'){
                return;
            }

            if(this.activeCameraName === 'endMenu'){
                return;
            }

            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    setRestart() {
        // this.setActiveCamera('Perspective')
        this.controller = new GameController(this);
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.controller.update()
        }

        
        // required if controls.enableDamping or controls.autoRotate are set to true
        if(this.activeCameraName !== 'PerspectiveCar' && this.activeCameraName !== 'MainMenu' && this.activeCameraName !== 'PausedMenu' && this.activeCameraName !== 'ParkingLot' && this.activeCameraName !== 'ObstaclesPark' && this.activeCameraName !== 'endMenu' && this.activeCameraName !== 'trackView') {
            this.controls.update();
        }


        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()

    }
}


export { MyApp };
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        
        //adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera');
        let cameraNames = [];
        for(var cam in this.app.cameras){
            cameraNames.push(cam);
        }
        cameraFolder.add(this.app, 'activeCameraName', cameraNames ).name("active camera");
        cameraFolder.open();


        const lightsFolder = this.datgui.addFolder('Lights');
        for(var light in this.app.lights){
            lightsFolder.add(this.app.lights[light], 'visible' ).name(light);
        }
        lightsFolder.open();

        const parameters = {
            wireframeMode: false,
        };
          
        // Add a checkbox to the GUI
        this.datgui.add(parameters, 'wireframeMode').name("Wireframe Mode").onChange( (value) =>  {
            // Toggle wireframe mode for all objects in the scene
            this.app.scene.traverse((object) => {
              if (object instanceof THREE.Mesh) {
                object.material.wireframe = value;
              }
            });
        });


    }
}

export { MyGuiInterface };
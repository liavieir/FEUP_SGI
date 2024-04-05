import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';


class LoadObject {
    constructor(app, path, callback) {
        this.app = app;
        this.loadedObject = null;

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        mtlLoader.load(
            path+'.mtl',
            (materials) => {
                materials.preload();
                // Load the OBJ model with the loaded materials
                objLoader.setMaterials(materials);
                objLoader.load(
                    path+'.obj',
                    (object) => {
                        // Add the loaded object to the scene
                        this.loadedObject = object;
                        this.app.scene.add(object);
                        // console.log(this.loadedObject.position);
                        if (typeof callback === 'function') {
                            callback(this.loadedObject);
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading OBJ model', error);
                    }
                );
            },
            undefined,
            (error) => {
                console.error('Error loading MTL file', error);
            }
        );
    }

    getLoadedObject() {
        console.log(this.loadedObject); 
        return this.loadedObject;
    }

}

export { LoadObject };
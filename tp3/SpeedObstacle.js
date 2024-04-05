import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class SpeedObstacle {

	constructor(app, path) {
		this.app = app;
        this.path = path;

        var group = new THREE.Group();
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => {
                const model = gltf.scene.children[0];
                model.rotation.y = Math.PI/2;
                group.add(model);
                resolve(group);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
                }
            );
        });
	}
	
}

export { SpeedObstacle };
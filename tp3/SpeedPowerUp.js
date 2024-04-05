import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';


class SpeedPowerUp  {

    constructor() {
		return this.buildPowerUp()
	}

	buildPowerUp(){
		this.powerUpBox = new THREE.PlaneGeometry(0.5, 0.5);
		this.powerUpTexture = new THREE.TextureLoader().load("images/speedUpRainbow.png");
		this.powerUpTexture.wrapS = THREE.RepeatWrapping;
        this.powerUpTexture.wrapT = THREE.RepeatWrapping;
        this.powerUpMaterial = new THREE.MeshPhongMaterial({ emissive: "#000000", side: THREE.DoubleSide, map: this.powerUpTexture  })
        this.powerUp = new THREE.Mesh(this.powerUpBox, this.powerUpMaterial);
		this.powerUp.rotation.set(Math.PI/2, 0, Math.PI/6);
		this.powerUp.scale.set(1.8, 1.8, 1);
        return this.powerUp;
	}
}

export { SpeedPowerUp };
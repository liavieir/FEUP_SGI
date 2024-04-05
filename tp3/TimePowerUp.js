import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';


class TimePowerUp  {

    constructor() {

        this.time = new THREE.Clock();
        this.time.start();

        this.vertexShader = `
        // varying vec2 vUv;
        uniform float time;
        void main() {
            
            float pulsationFrequency = 3.0; 
            float pulsationAmplitude = 0.2; 
            // vUv = uv;
        
            float pulsationOffset = 1.0 + sin(time * pulsationFrequency) * pulsationAmplitude;
            vec4 modelViewPosition = modelViewMatrix * vec4(position * pulsationOffset, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }`

        this.fragmentShader = `
        // varying vec2 vUv;
        uniform sampler2D text;
        varying vec3 vNormal;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            // gl_FragColor = texture2D(text, vUv);
        }
        `
	}

    

	buildPowerUp(){
		this.powerUpBox = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		this.powerUpTextureShader = new THREE.TextureLoader().load("images/powerUpBox.png");
		this.powerUpTextureShader.wrapS = THREE.RepeatWrapping;
        this.powerUpTextureShader.wrapT = THREE.RepeatWrapping;
        
        if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            this.shader = new THREE.ShaderMaterial({
                uniforms: {
                    texture: { type: 't', value: this.powerUpTextureShader },
                    time: { type: 'f', value: 0.0}
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            });
        }
		


        // this.powerUpMaterial = new THREE.MeshPhongMaterial({ emissive: "#000000", side: THREE.DoubleSide, map: this.powerUpTexture  })
        this.powerUp = new THREE.Mesh(this.powerUpBox, this.shader);
		this.powerUp.rotation.y = Math.PI/4;
		this.powerUp.rotation.z = Math.PI/4;
        return this.powerUp;
	}

    update() {
        if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            if(this.shader.uniforms.time) {
                this.shader.uniforms.time.value = this.time.getElapsedTime();
            }
            
        }
    }
}

export { TimePowerUp };
import * as THREE from 'three';
import { MyTrack } from './Track.js';
import { SpeedObstacle } from './SpeedObstacle.js';
import { ToggleObstacle } from './ToggleObstacle.js';
import { SpeedPowerUp} from './SpeedPowerUp.js'
import { TimePowerUp} from './TimePowerUp.js'
import { Outdoor } from './Outdoor.js';
import { AdditionalOutdoor } from './AdditionalOutdoor.js';

class Reader {
    constructor(app) {
        this.app = app;

        this.speedObstacles = [];
        this.toggleObstacles = [];
        this.speedPowerUps = [];
        this.timePowerUps = [];
        this.timePowerUpsMesh =[];

        this.timeWater = new THREE.Clock();
        this.timeWater.start();
        
    }

    readTrack() {
        const track = new MyTrack(this.app);
        const plano = new THREE.PlaneGeometry(100, 100);
        const sea = new THREE.TextureLoader().load("images/sea.jpg");
        const material = new THREE.MeshBasicMaterial({ map: sea, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(plano, material);
        plane.rotateX(Math.PI / 2);
        plane.position.set(2, 0, 20);
        this.app.scene.add(plane);
        return track;
    }

    readSpeedObstacles() {

        const speedObstaclesPositions = [
            new THREE.Vector3(5, 0.5, 16),
            new THREE.Vector3(5, 0.5, 30.5),
            new THREE.Vector3(2, 0.5, 29),
            new THREE.Vector3(0, 0.5, 31),
            new THREE.Vector3(-5, 0.5, 16)
        ]

        for(const position of speedObstaclesPositions){
            const obstacle = new SpeedObstacle(this.app, 'models/snail_obstacle/PK22NN9V1ETF8MWR0I26Q0YVZ.gltf');
            obstacle.then((group) => {
                group.scale.set(0.25, 0.25, 0.25);
                group.position.copy(position);
                this.app.scene.add(group);
                this.speedObstacles.push(group);
            });   
        }

        return this.speedObstacles;

    }

    readToggleObstacles() {

        const toggleObstaclesPositions = [
            new THREE.Vector3(-4, 0.4, 8),
            new THREE.Vector3(-6, 0.4, 8),
            new THREE.Vector3(12, 0.4, 20)
        ]

        for(const position of toggleObstaclesPositions){
            const obstacle = new ToggleObstacle(this.app, 'models/crab_obstacle/CE2UVTBFPTMTA7LU1N2T22NNX.gltf');
            obstacle.then((group) => {
                group.scale.set(0.25, 0.25, 0.25);
                group.rotation.set(0, Math.PI, 0);
                group.position.copy(position);
                this.app.scene.add(group);
                this.toggleObstacles.push(group);
            });   
        }

        return this.toggleObstacles;
    }

    readSpeedPowerUps() {
        const speedPowerUpsPositions = [
            new THREE.Vector3(8, 0.2, 18),
            new THREE.Vector3(-8, 0.2, 25),
            new THREE.Vector3(4, 0.2, 12)
        ]

        for(const position of speedPowerUpsPositions){
            const powerUp = new SpeedPowerUp();
            powerUp.position.copy(position);
            this.app.scene.add(powerUp);
            this.speedPowerUps.push(powerUp);
        }

        return this.speedPowerUps;
    }

    readTimePowerUpsMesh() {
        const timePowerUpsPositions = [
            new THREE.Vector3(-2, 0.5, 1),
            new THREE.Vector3(-9, 0.5, 20),
            new THREE.Vector3(15, 0.5, 26)
        ]

        for(const position of timePowerUpsPositions){
            const powerUp = new TimePowerUp();
            this.timePowerUps.push(powerUp);
            const powerUpMesh = powerUp.buildPowerUp();
            powerUpMesh.position.copy(position);
            this.app.scene.add(powerUpMesh);
            this.timePowerUpsMesh.push(powerUpMesh);
        }

        return this.timePowerUpsMesh;
    }

    getTimePowerUps(){
        return this.timePowerUps;
    }

    readOutdoor() {
        const outdoor = new Outdoor(this.app);
        return outdoor;
    }

    readAdditionalOutdoor() {
        const outdoor = new AdditionalOutdoor(this.app);
        this.additionalOutdoor = outdoor.buildOutdoor();
        return outdoor;
    }

    readPalmTrees() {

        const palmTreesPositions = [
            new THREE.Vector3(10, 0.8, 5),
            new THREE.Vector3(10, 0.8, 40),
            new THREE.Vector3(0, 0.8, 20),
            new THREE.Vector3(-10, 0.8, 8),
            new THREE.Vector3(-10, 0.8, 30),
            new THREE.Vector3(0, 0.8, 5),
            new THREE.Vector3(-2, 0.8, 35),
            new THREE.Vector3(-15, 0.8, 25),
            new THREE.Vector3(-2, 0.8, 23)
        ]

        for(const position of palmTreesPositions){
            const palmTree = new ToggleObstacle(this.app, 'models/palm_tree/GY2JMYDR046M4O1LRW2EUEAWS.gltf');
            palmTree.then((group) => {
                group.scale.set(0.5, 0.5, 0.5);
                group.position.copy(position);
                this.app.scene.add(group);
            });   
        }
    }

    readRock() {

        const rocksPositions = [
            new THREE.Vector3(0, 0, -5),
            new THREE.Vector3(20, 0, 40)
        ]

        for(const position of rocksPositions){
            const rock = new ToggleObstacle(this.app, 'models/rock/7NVD901GRSYZM8C705GUZDDPI.gltf');
            rock.then((group) => {
                group.scale.set(2, 2, 2);
                group.position.copy(position);
                this.app.scene.add(group);
            });
        }
    }

    readSkyBox() {
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const bottom = new THREE.TextureLoader().load("images/sea.jpg");
        const left = new THREE.TextureLoader().load("images/sky.jpg");
        const right = new THREE.TextureLoader().load("images/sky.jpg");
        const up = new THREE.TextureLoader().load("images/sky.jpg");
        const front = new THREE.TextureLoader().load("images/sky.jpg");
        const back = new THREE.TextureLoader().load("images/sky.jpg");

        const skyboxMaterials = [
            new THREE.MeshBasicMaterial({ map: right, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: left, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: up, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: bottom, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: front, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: back, side: THREE.BackSide }),
        ];

        const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        skyboxMesh.position.set(0, 499.5, 0);
        this.app.scene.add(skyboxMesh);
        return skyboxMesh;
    }

    readWater() {

        // Vertex Shader
        this.vertexShader = `
        
        attribute vec3 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        uniform mat4 uNMatrix;
        uniform float time;

        uniform sampler2D waterMap;

        varying vec2 vTextureCoord;

        void main() {

            vTextureCoord = aTextureCoord;

            vec2 animation = vec2(time * 0.01, time * 0.01);
            vec3 offsetNormal = aVertexNormal * texture2D(waterMap, vTextureCoord + animation).b;

            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offsetNormal * 0.03, 1.0);
        }
      
        
        `;

        this.fragmentShader = `
        precision highp float;
        
        varying vec2 vTextureCoord;
        
        uniform sampler2D waterTex;
        uniform sampler2D waterMap;
        uniform float time;
        
        void main() {
            vec2 animation = vec2(time * 0.01, time * 0.01);
            vec4 color = texture2D(waterTex, vTextureCoord + animation);
            vec4 filtro = texture2D(waterMap, vTextureCoord + animation);
            
            gl_FragColor = vec4(color.r + filtro.r * 0.1, color.g + filtro.g * 0.1, color.b + filtro.b *0.1, 1.0);
        }
        
        `;

        const plano = new THREE.PlaneGeometry(50, 50);
        const seaTex = new THREE.TextureLoader().load("images/water.jpg");
        const seaMap = new THREE.TextureLoader().load("images/waterMap.jpg");

        if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            console.log("shaderrr")
            this.shaderWater = new THREE.ShaderMaterial({
                uniforms: {
                    time: { type: 'f', value: 0.0},
                    waterTex: { value: seaTex }, 
                    waterMap: { value: seaMap }
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            });
        }
        // else {
        //     this.shaderWater = new THREE.MeshPhongMaterial({ map: this.waterTex });
        // }

        this.water = new THREE.Mesh(plano, this.shaderWater);


        // const material = new THREE.MeshBasicMaterial({ map: sea, side: THREE.DoubleSide });
        // const plane = new THREE.Mesh(plano, material);
        this.water.rotateX(-Math.PI / 2);
        this.water.position.set(2, 10, 20);
        this.app.scene.add(this.water);
        return this.water;
    }

    update() {
        if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            if(this.shaderWater.uniforms.time) {
                this.shaderWater.uniforms.time.value = this.timeWater.getElapsedTime();
            }
            
        }
    }

}

export { Reader };
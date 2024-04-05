import * as THREE from "three";
import { MyAxis } from './MyAxis.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Vehicle } from "./Vehicle.js";
import { MyFirework } from "./Firework.js";

class EndMenu {
    constructor(app){
        this.explosionNumber = 0;
        this.app = app;
        this.fireworks = []
        this.endMenuGroup = new THREE.Group();
    }

    init(opponentTime, playerTime, playerCar='car1', opponentCar='car2', playerName, difficulty) {
        this.opponentTime = opponentTime;
        this.playerTime = playerTime;
        this.playerCar = playerCar;
        this.playerName = playerName;
        this.difficulty = difficulty;
        this.opponentCar = opponentCar;
        this.axis = new MyAxis(this);
        this.app.setActiveCamera('endMenu');
        this.app.scene.add(this.axis);  
        this.createPodium();
        this.createPanel();
        this.loadCars();
        this.buildRestartButton();
        this.createBackground();
        this.buildNames();
        this.app.scene.add(this.endMenuGroup);   

        this.whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.redMaterial = new THREE.MeshBasicMaterial({ color: 0xc30010 });
    }

    createPodium() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.endMenuGroup.add(ambientLight);

        const podiumFirstGeometry = new THREE.BoxGeometry(12, 3, 10);
        const podiumMaterial = new THREE.MeshPhongMaterial({ color: "#800000", emissive: 0x000000,side: THREE.DoubleSide });
        const podiumFirstPlace = new THREE.Mesh(podiumFirstGeometry, podiumMaterial);
        podiumFirstPlace.position.set(-6, -6, -2);
        this.endMenuGroup.add(podiumFirstPlace);

        const podiumSecondGeometry = new THREE.BoxGeometry(12, 1.5, 10);
        const podiumSecondPlace = new THREE.Mesh(podiumSecondGeometry, podiumMaterial);
        podiumSecondPlace.position.set(6, -6.75, -2);
        this.endMenuGroup.add(podiumSecondPlace);

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const firstGeometry = new TextGeometry('1', {
                font: font, size: 0.9, height: 0.3, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const first = new THREE.Mesh(firstGeometry, this.whiteMaterial);
            first.position.set(-6, -6.5, 2.9);
            first.name = "firstPlace"

            this.endMenuGroup.add(first);
            
        });

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const secondGeometry = new TextGeometry('2', {
                font: font, size: 0.9, height: 0.3, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const second = new THREE.Mesh(secondGeometry, this.whiteMaterial);
            second.position.set(6, -6.7, 2.9);
            second.name = "secondPlace"

            this.endMenuGroup.add(second);

            
        });

    }

    createPanel() {
        const playerTimeString = this.playerTime.toFixed(2).toString(); 
        const opponentTimeString = this.opponentTime.toFixed(2).toString();
        
        const panelGeometry = new THREE.PlaneGeometry(30, 13);
        const panelMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(0, 5.5, 0);
        this.endMenuGroup.add(panel);

        const insidePanelGeometry = new THREE.PlaneGeometry(29, 12);
        const insidePanelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const insidePanel = new THREE.Mesh(insidePanelGeometry, insidePanelMaterial);
        insidePanel.position.set(0, 5.5, 0.05);
        this.endMenuGroup.add(insidePanel);

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const firstGeometry = new TextGeometry('1st', {
                font: font, size: 0.7, height: 0.1, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const st = new THREE.Mesh(firstGeometry, this.whiteMaterial);
            st.position.set(-4, 7, 2.9);
            st.name = "1st"

            this.endMenuGroup.add(st);
            
        });

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const firstGeometry = new TextGeometry('2nd', {
                font: font, size: 0.7, height: 0.1, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const nd = new THREE.Mesh(firstGeometry, this.whiteMaterial);
            nd.position.set(4, 7, 2.9);
            nd.name = "2nd"

            this.endMenuGroup.add(nd);
            
        });

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const playerTimeGeometry = new TextGeometry('Time', {
                font: font, size: 0.7, height: 0, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const playerTimeText = new THREE.Mesh(playerTimeGeometry, this.whiteMaterial);
            playerTimeText.position.set(-10, 3, 2.9);

            this.endMenuGroup.add(playerTimeText);
            
        });

        const winnerPosition = new THREE.Vector3(-4, 3, 2.9);
        const loserPosition = new THREE.Vector3(4, 3, 2.9);
        if(this.playerTime <= this.opponentTime) {
            this.playerTimePosition = winnerPosition;
            this.opponentTimePosition = loserPosition;
        }
        else {
            this.playerTimePosition = loserPosition;
            this.opponentTimePosition = winnerPosition;
        }

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const playerTimeGeometry = new TextGeometry(playerTimeString, {
                font: font, size: 0.5, height: 0, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const playerTimeText = new THREE.Mesh(playerTimeGeometry, this.whiteMaterial);
            playerTimeText.position.set(this.playerTimePosition.x, this.playerTimePosition.y, this.playerTimePosition.z);
            playerTimeText.name = "playerTime"

            this.endMenuGroup.add(playerTimeText);
            
        });

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            const opponentTimeGeometry = new TextGeometry(opponentTimeString, {
                font: font, size: 0.5, height: 0, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const opponentTimeText = new THREE.Mesh(opponentTimeGeometry, this.whiteMaterial);
            opponentTimeText.position.set(this.opponentTimePosition.x, this.opponentTimePosition.y, this.opponentTimePosition.z);
            opponentTimeText.name = "opponentTime"

            this.endMenuGroup.add(opponentTimeText);
            
        });

        switch(this.difficulty) {
            case 1:
                this.difficultyText = "Easy";
                break;
            case 2:
                this.difficultyText = "Medium";
                break;
            case 3:
                this.difficultyText = "Hard";
                break;
        }

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            const difficultyGeometry = new TextGeometry(this.difficultyText, {
                font: font, size: 0.5, height: 0, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const difficultyText = new THREE.Mesh(difficultyGeometry, this.whiteMaterial);
            difficultyText.position.set(0, 1, 2.9);
            difficultyText.name = "difficulty"

            this.endMenuGroup.add(difficultyText);
            
        });

    }

    buildNames(){
        const winnerPosition = new THREE.Vector3(-4, 5, 2.9);
        const loserPosition = new THREE.Vector3(4, 5, 2.9);
        if(this.playerTime <= this.opponentTime) {
            this.playerNamePosition = winnerPosition;
            this.opponentNamePosition = loserPosition;
        }
        else {
            this.playerNamePosition = loserPosition;
            this.opponentNamePosition = winnerPosition;
        }

        if(this.playerName == "") {
            this.playerName = "Player";
        }

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {

            const playerText = new TextGeometry(this.playerName, {
                font: font, size: 0.5, height: 0, curveSegments: 8, bevelEnabled: false, bevelThickness: 0, bevelSize: 0.1, bevelSegments: 1,
            });

            const playerName = new THREE.Mesh(playerText, this.redMaterial);
            playerName.position.set(this.playerNamePosition.x, this.playerNamePosition.y, this.playerNamePosition.z);
            playerName.name = "playerName"

            this.endMenuGroup.add(playerName);

        });

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {

            const enemyText = new TextGeometry('Enemy', {
                font: font,
                size: 0.5,
                height: 0,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const enemy = new THREE.Mesh(enemyText, this.whiteMaterial);
            enemy.position.set(this.opponentNamePosition.x, this.opponentNamePosition.y, this.opponentNamePosition.z);
            enemy.name = "enemy"

            this.endMenuGroup.add(enemy);

        });

    }

    createBackground() {
        const backgroundGeometry = new THREE.PlaneGeometry(120, 60); 
        const backgroundTexture = new THREE.TextureLoader().load('images/sea.jpg');

        const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff , map: backgroundTexture});
        this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        
        this.background.position.set(0, 0, -20);

        this.endMenuGroup.add(this.background)

    }

    getCarModel(carOption) {
        switch(carOption){
            case 'car1':
                return 'models/audi_car/CTZKCN1GJAU5KE5XYBXPWEQTQ.gltf';
            case 'car2':
                return 'models/cadillac_car/YUQZG80W41TON5XS1UHM3LE7K.gltf';
        }
    }


    async loadCars() {
        
        const winnerPosition = new THREE.Vector3(-4, -2.2, 6);
        const winnerRotation = new THREE.Vector3(0, Math.PI/5, 0);
        const loserPosition = new THREE.Vector3(4, -2.5, 6);
        const loserRotation = new THREE.Vector3(0, -Math.PI/5, 0);
        if(this.playerTime <= this.opponentTime) {
            this.playerPosition = winnerPosition;
            this.playerRotation = winnerRotation;
            this.opponentPosition = loserPosition;
            this.opponentRotation = loserRotation;
        }
        else {
            this.playerPosition = loserPosition;
            this.playerRotation = loserRotation;
            this.opponentPosition = winnerPosition;
            this.opponentRotation = winnerRotation;
        }

        this.playerCarGroup = new Vehicle(this.app, this.getCarModel(this.playerCar));
        this.playerCarGroup.then((group) => {
            group.scale.set(4, 4, 4);
            group.rotation.set(this.playerRotation.x, this.playerRotation.y, this.playerRotation.z);
            group.position.set(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z);
            this.endMenuGroup.add(group);
        });

        this.opponentCarGroup = new Vehicle(this.app, this.getCarModel(this.opponentCar));
        this.opponentCarGroup.then((group) => {
            group.scale.set(4, 4, 4);
            group.rotation.set(this.opponentRotation.x, this.opponentRotation.y, this.opponentRotation.z);
            group.position.set(this.opponentPosition.x, this.opponentPosition.y, this.opponentPosition.z);
            this.endMenuGroup.add(group);
        });


    }

    buildRestartButton() {
        this.restartMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const restartGeometry = new TextGeometry('Restart', {
                font: font,
                size: 0.7,
                height: 0, 
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const restartMesh = new THREE.Mesh(restartGeometry, this.restartMaterial);
            restartMesh.position.set(-1, -9, 3);
            restartMesh.name = "restart"
            this.endMenuGroup.add(restartMesh);
        });
    }

    handleMouseClicks(intersects) {
        console.log(intersects);
        for(var i = 0; i < intersects.length; i++) {
            const obj = intersects[0].object;
            const objParent = obj.parent;
            if(obj.name == "restart") {
                this.app.scene.remove(this.endMenuGroup);
                this.app.setRestart();
            }

        }
    }

    handleKeyDown(event) {

    }

    handleKeyUp(event) {

    }

    update() {

        if(Math.random()  < 0.01) {
            const name = "explosion" + this.explosionNumber;
            this.explosionNumber++;
            this.fireworks.push(new MyFirework(this.app, name))

            setTimeout(() => {
                this.objectsToRemove = [];
                this.app.scene.children.forEach((child) => {
                    if (child.name === name) {
                        this.objectsToRemove.push(child);
                }
            });

            // Remove the objects from the scene
            this.objectsToRemove.forEach((object) => {
                this.app.scene.remove(object);
                // Dispose the geometry and material to free up resources
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
            }, 5000); 



        }


        for( let i = 0; i < this.fireworks.length; i++ ) {
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i,1) 
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }
}

export { EndMenu };
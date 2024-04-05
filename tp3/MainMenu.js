import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Sprites } from './Sprites.js'


class MainMenu {

    constructor(app, buildParkingLot, setDifficulty){
        this.app = app;
        this.buildParkingLot = buildParkingLot; 
        this.setDifficulty = setDifficulty;
        this.playerCars = [];
        this.opponentCars = [];
        this.selectedPlayerCar = null;
        this.selectedEnemyCar = null;
        this.playerNameInput = "";
        this.difficulty = 1;
        
        this.group = new THREE.Group();
        

    }

    init() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.group.add(this.ambientLight);
        this.app.setActiveCamera('MainMenu');
        this.buildBackground();
        this.buildStartButton();
        this.buildDifficultyButton();
        this.buildNames();   


        this.app.scene.add(this.group); 

    }


    handleMouseClicks(intersects) {
        for(var i = 0; i < intersects.length; i++) {
            const obj = intersects[0].object;
            const objParent = obj.parent;
            if(obj.name == "start") {
                this.app.scene.remove(this.group);
                this.app.scene.remove("background")
                this.setDifficulty(this.difficulty);
                this.buildParkingLot();
            }
            if(obj.name == "upDifficulty") {
                if(this.difficulty < 3) {
                    this.difficulty++;
                    this.changeDifficulty();
                }
            }
            if(obj.name == "downDifficulty") {
                if(this.difficulty > 1) {
                    this.difficulty--;
                    this.changeDifficulty();
                }
            }
        }
    }

    handleKeyUp(event) {}

    handleKeyDown(event) {
        if (/^[a-zA-Z ]$/.test(event.key) && this.playerNameInput.length < 15) {
            this.playerNameInput += event.key;
            this.updatePlayerName();

        } 
        else if (event.key === 'Backspace' && this.playerNameInput.length > 0) {
            this.playerNameInput = this.playerNameInput.slice(0, -1);
            this.updatePlayerName();
        }
    }

    updatePlayerName() {
        const existingNameMesh = this.group.getObjectByName("playerName");
        if (existingNameMesh) {
            this.group.remove(existingNameMesh);
        }

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            const playerNameText = new TextGeometry(this.playerNameInput, {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const playerNameMaterial = new THREE.MeshBasicMaterial({ color: 0x00008B });
            const playerNameMesh = new THREE.Mesh(playerNameText, playerNameMaterial);
            playerNameMesh.position.set(-16, -20, 0);
            playerNameMesh.name = "playerName";

            this.group.add(playerNameMesh);
        });
    
    }

    getPlayerName() {
        return this.playerNameInput;
    }

    buildBackground() {

        const backgroundGeometry = new THREE.PlaneGeometry(65, 45); 
        const backgroundTexture = new THREE.TextureLoader().load('images/mainMenuBackground2.jpg');

        const backgroundMaterial = new THREE.MeshPhongMaterial({ map: backgroundTexture});
        const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        
        background.position.set(-15, -20, -10);
        background.name = "background"

        this.group.add(background);
    }

    buildStartButton() {
        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            
            const startGeometry = new TextGeometry('Start', {
                font: font,
                size: 0.7,
                height: 0.1, 
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const startMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const startMesh = new THREE.Mesh(startGeometry, startMaterial);
            startMesh.position.set(-17, -26, 0);
            startMesh.name = "start"

            this.group.add(startMesh);
        });

    }
      

    buildDifficultyButton() {

        const triangleUpGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([ 0, 0.5, 0, -1, -1, 0, 1, -1, 0 ]);
        triangleUpGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const triangleUpMesh = new THREE.Mesh(triangleUpGeometry, triangleMaterial);
        triangleUpMesh.position.set(-13 , -23.5, 0);    
        triangleUpMesh.scale.set(0.5,0.5,0.5);
        triangleUpMesh.name = "upDifficulty"

        const triangleDownGeometry = new THREE.BufferGeometry();
        triangleDownGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const triangleMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const triangleDownMesh = new THREE.Mesh(triangleDownGeometry, triangleMaterial2);
        triangleDownMesh.rotation.z = Math.PI;
        triangleDownMesh.scale.set(0.5,0.5,0.5);
        triangleDownMesh.position.set(-18.5, -23.7, 0);
        triangleDownMesh.name = "downDifficulty";


        this.group.add(triangleUpMesh);
        this.group.add(triangleDownMesh);
       

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/optimer_bold.typeface.json', (font) => {

            const textGeometry = new TextGeometry('Difficulty', {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-17, -22, 0);

            this.group.add(textMesh);
        });

        this.addDifficultyLevel('easy');
    }

    addDifficultyLevel(text) {
        const fontLoader = new FontLoader();
        fontLoader.load('fonts/optimer_bold.typeface.json', (font) => {

            const difficultyText = new TextGeometry(text, {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const difficultyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const difficultyMesh = new THREE.Mesh(difficultyText, difficultyMaterial);
            difficultyMesh.position.set(-16.8, -23.8, 0);
            difficultyMesh.name = "difficulty"

            this.group.add(difficultyMesh);

        });

    }

    changeDifficulty() {
        this.group.remove(this.group.getObjectByName("difficulty"));
        let text = "";
        switch(this.difficulty) {
            case 1:
                text = '  easy';
                break;
            case 2:
                text = 'medium';
                break;
            case 3:
                text = '  hard';
                break;
        }

        this.addDifficultyLevel(text);
    }

    buildNames(){
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const fontLoader = new FontLoader();
        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {

            const radius = 4; 
            const characters = 'hsuR hcaeB'; 
            const angleStep = Math.PI / (characters.length + 1); 
            const tittle = new THREE.Group();


            for (let i = 1; i <= characters.length; i++) {
                const angle = i * angleStep;
                const x = radius * Math.cos(angle);
                const y = 0.8 * radius * Math.sin(angle);
        
                const charGeometry = new TextGeometry(characters[i - 1], {
                    font: font,
                    size: 1.3,
                    height: 0.1,
                    curveSegments: 8,
                    bevelEnabled: false,
                    bevelThickness: 1,
                    bevelSize: 0.2,
                    bevelSegments: 1,
                });
        
                const material = new THREE.MeshBasicMaterial({ color: 0x00008B });
                const charMesh = new THREE.Mesh(charGeometry, material);
        
                charMesh.rotation.z = angle + 3*Math.PI / 2;
                charMesh.position.set(x, y, 0);
                tittle.add(charMesh);
            }

            tittle.position.set(-16, -18, 0);
            this.group.add(tittle);

        });

        fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {

            const gameNameText = new TextGeometry('Name :', {
                font: font,
                size: 0.5,
                height: 0,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0.5,
                bevelSize: 0.2,
                bevelSegments: 1,
            });

            const gameNameMesh = new THREE.Mesh(gameNameText, material);
            gameNameMesh.position.set(-19, -20, 0);
            gameNameMesh.name = "name"

            this.group.add(gameNameMesh);

        });


        fontLoader.load('fonts/optimer_bold.typeface.json', (font) => {

            const liaText = new TextGeometry('Lia Vieira - up202005042', {
                font: font,
                size: 0.7,
                height: 0,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const liaMesh = new THREE.Mesh(liaText, material);
            liaMesh.position.set(-29.5, -27, 0);
            liaMesh.scale.set(0.4, 0.4, 0.4);
            liaMesh.name = "lia"

            this.group.add(liaMesh);

        });

        fontLoader.load('fonts/optimer_bold.typeface.json', (font) => {

            const hugoText = new TextGeometry('Hugo Gomes - up202004343', {
                font: font,
                size: 0.7,
                height: 0,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const hugoMesh = new THREE.Mesh(hugoText, material);
            hugoMesh.position.set(-29.5, -26.5, 0);
            hugoMesh.scale.set(0.4, 0.4, 0.4);
            hugoMesh.name = "hugo"

            this.group.add(hugoMesh);

        });
    }

    update() {}
}
export { MainMenu };

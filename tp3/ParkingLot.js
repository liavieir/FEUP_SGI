import * as THREE from "three";
import { Vehicle } from "./Vehicle.js";
import { SpeedObstacle } from "./SpeedObstacle.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class ParkingLot {

    constructor(app, buildGame) {
        this.app = app;
        this.buildGame = buildGame;

        this.playerCars = "";
        this.opponentCars = "";

        this.deleteGroup = new THREE.Group();
        this.maintainGroup = new THREE.Group();

    }


    init() {
        this.app.setActiveCamera('ParkingLot');

        this.createPark();
        this.createBackground();
        this.app.scene.add(this.deleteGroup);
        this.app.scene.add(this.maintainGroup);
        
    }

    createBackground() {
        const backgroundGeometry = new THREE.PlaneGeometry(45, 30); 
        const backgroundTexture = new THREE.TextureLoader().load('images/sea.jpg');

        const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff , map: backgroundTexture});
        this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        
        this.background.position.set(0, 0, -2);
        this.background.rotation.set(-Math.PI/5, 0, 0);

        this.deleteGroup.add(this.background)

    }

    async createPark() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.deleteGroup.add(ambientLight);

        this.addTitles();

        let playerPark = await new SpeedObstacle(this.app, 'models/wood_raft/AW3WLU7BDZ5XMZGFCD0ARZBYW.gltf');

        playerPark.name = "playerPark";
        playerPark.position.set(-7, 0, 0);
        playerPark.scale.set(5, 4, 3);
        playerPark.rotation.set(-Math.PI/2, 0, Math.PI/2);

        const opponentPark = playerPark.clone();
        opponentPark.name = "opponentPark";
        opponentPark.position.set(7, 0, 0);

        this.groupOpponentPark = new THREE.Group();
        this.groupOpponentPark.name = "groupOpponentPark";
        this.groupOpponentPark.add(opponentPark);

        this.groupPlayerPark = new THREE.Group();
        this.groupPlayerPark.name = "groupPlayerPark";
        this.groupPlayerPark.add(playerPark);

        
        // Create cars in player's park
        let playerCar1 = await new Vehicle(this.app, 'models/audi_car/CTZKCN1GJAU5KE5XYBXPWEQTQ.gltf');
        playerCar1.name = "playerCar1";
        playerCar1.position.set(5, 0.6, 0.5);
        playerCar1.scale.set(2.5, 2.5, 2.5);
        this.groupPlayerPark.add(playerCar1);

        playerCar1.traverse((child, index) => {
                child.name = 'playerCar1';
        });
        

        let playerCar2 = await new Vehicle(this.app, 'models/cadillac_car/YUQZG80W41TON5XS1UHM3LE7K.gltf');
        playerCar2.name = "playerCar2";
        playerCar2.position.set(8, 0.6, 0.5);
        playerCar2.scale.set(2.5, 2.5, 2.5);
        this.groupPlayerPark.add(playerCar2);

        playerCar2.traverse((child, index) => {
            child.name = 'playerCar2';
    });
        

        let opponentCar1 = await new Vehicle(this.app, 'models/audi_car/CTZKCN1GJAU5KE5XYBXPWEQTQ.gltf');
        opponentCar1.name = "opponentCar1";
        opponentCar1.position.set(-8, 0.6, 0.5);
        opponentCar1.scale.set(2.5, 2.5, 2.5);
        this.groupOpponentPark.add(opponentCar1);

        opponentCar1.traverse((child, index) => {
            child.name = 'opponentCar1';
    });
        

        let opponentCar2 = await new Vehicle(this.app, 'models/cadillac_car/YUQZG80W41TON5XS1UHM3LE7K.gltf');
        opponentCar2.name = "opponentCar2";
        opponentCar2.position.set(-5, 0.6, 0.5);
        opponentCar2.scale.set(2.5, 2.5, 2.5);
        this.groupOpponentPark.add(opponentCar2);

        opponentCar2.traverse((child, index) => {
            child.name = 'opponentCar2';
    });

        this.maintainGroup.add(this.groupPlayerPark);
        this.maintainGroup.add(this.groupOpponentPark);

        // this.app.scene.add(this.group);

    }

    handleMouseClicks(intersects) {
        console.log(intersects);
        
        const clickedCars = intersects.filter(obj => obj.object.name === 'playerCar1' || obj.object.name === 'playerCar2'
        || obj.object.name === 'opponentCar1' || obj.object.name === 'opponentCar2');

        switch(clickedCars[0].object.name) {
            case 'playerCar1':
                this.playerCars = "car1";
                break;
            case 'playerCar2':
                this.playerCars = "car2";

                break;
            case 'opponentCar1':
                this.opponentCars = "car1";

                break;
            case 'opponentCar2':
                this.opponentCars = "car2";
                break;
        }

        if(this.playerCars != "" && this.opponentCars != "") {
            this.app.scene.remove(this.deleteGroup);
            this.maintainGroup.position.set(20, 0.1, 12);
            this.maintainGroup.scale.set(0.5,0.5,0.5);
            this.maintainGroup.rotation.set(0, -Math.PI/2, 0);
            this.buildGame(this.playerCars, this.opponentCars);
        }
    }

    addTitles() {
        const fontLoader = new FontLoader();
        fontLoader.load('fonts/optimer_bold.typeface.json', (font) => {
            const textGeometry = new TextGeometry('Choose your enemy', {
                font: font,
                size: 0.6,
                height: 0.1,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });
            const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00008B });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-12, 5, -5);
            textMesh.rotation.set(-Math.PI/6, 0, 0);
            this.deleteGroup.add(textMesh);
            
        });

        fontLoader.load('fonts/optimer_bold.typeface.json', (font) => {
            const textGeometry = new TextGeometry('Choose your car', {
                font: font,
                size: 0.6,
                height: 0.1,
                curveSegments: 8,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0.1,
                bevelSegments: 1,
            });
            const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00008B });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(2, 5, -5);
            textMesh.rotation.set(-Math.PI/6, 0, 0);
            this.deleteGroup.add(textMesh);
            
        });

    }

    handleKeyUp(event) {
        switch(event.key) {
            case 'w':
                this.app.scene.remove(this.deleteGroup);
                this.maintainGroup.position.set(20,0.1,0.5);
                this.maintainGroup.rotation.set(0,0,Math.PI/2);
                this.buildGame();
                break;
        }  
    }

    handleKeyDown(event) {

    }

    update(){}

}

export { ParkingLot };
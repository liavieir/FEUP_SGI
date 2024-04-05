import * as THREE from "three";
import { MainMenu } from "./MainMenu.js";
import { Game } from "./Game.js"
import { PausedMenu } from "./PausedMenu.js";
import { ParkingLot } from "./ParkingLot.js";
import { EndMenu } from "./EndMenu.js";

class GameController {
    
    constructor(app) {
        this.app = app;
        this.state = state.MAIN_MENU; 
        this.mainMenu = new MainMenu(this.app, this.buildParkingLot.bind(this), this.setDifficulty.bind(this));
        this.mainMenu.init();
        this.game = new Game(this.app, this.setPause.bind(this), this.endGame.bind(this));
        this.pausedMenu = new PausedMenu(this.app, this.removePause.bind(this));
        this.parkingLot = new ParkingLot(this.app, this.buildGame.bind(this));
        this.endMenu = new EndMenu(this.app);

        this.pickableObjects = ["start", "upDifficulty", "downDifficulty", "playerCar1", "playerCar2", "opponentCar1", "opponentCar2", "toggleObstacle", "speedObstacle", "restart"];
        this.notPickableObjects = ["enemy"]

        this.initKeyboardListeners();
        this.initMouseListeners();
        this.createRayCaster();
    }

    initKeyboardListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }


    handleKeyDown(event){
        switch(this.state){
            case state.PAUSE:
                this.pausedMenu.handleKeyDown(event);
                break;
            case state.PLAYING:
                this.game.handleKeyDown(event);
                break;
            case state.MAIN_MENU:
                this.mainMenu.handleKeyDown(event);
                break;
            case state.PARKING_LOT:
                this.parkingLot.handleKeyDown(event);
                break;
            case state.END:
                this.endMenu.handleKeyDown(event);
        }
    }

    handleKeyUp(event){
        switch(this.state){
            case state.PAUSE:
                this.pausedMenu.handleKeyUp(event);
                break;
            case state.PLAYING:
                this.game.handleKeyUp(event);
                break;
            case state.MAIN_MENU:
                this.mainMenu.handleKeyUp(event);
                break;
            case state.PARKING_LOT:
                this.parkingLot.handleKeyUp(event);
                break;
            case state.END:
                this.endMenu.handleKeyUp(event);
        }
    }

    handleMouseClicks(intersects){
        switch(this.state){
            case state.PAUSE:
                break;
            case state.PLAYING:
                this.game.handleMouseClicks(intersects);
                break;
            case state.MAIN_MENU:
                this.mainMenu.handleMouseClicks(intersects);
                break;
            case state.PARKING_LOT:
                this.parkingLot.handleMouseClicks(intersects);
                break;
            case state.END:
                this.endMenu.handleMouseClicks(intersects);
        }
    }

    initMouseListeners(){
        document.addEventListener(
             "pointerdown",
            this.onPointerDown.bind(this)
        );

        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this)
        );
    }


    createRayCaster(){
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 20

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x00008B"
    }

    onPointerDown(event){
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
        console.log(intersects);
        this.handleMouseClicks(intersects);
    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
        this.pickingHelper(intersects);
    }

    update() {
        switch (this.state) {
            case state.PAUSE:
                this.pausedMenu.update();
                break;
            case state.PLAYING:
                this.game.update();
                break;
            case state.MAIN_MENU:
                this.mainMenu.update();
                break;
            case state.PARKING_LOT:
                this.parkingLot.update();
                break;
            case state.END:
                this.endMenu.update();
        }
    }


    buildParkingLot(){
        this.state = state.PARKING_LOT;
        this.parkingLot.init();
    }

    buildGame(playerCar, opponentCar){
        this.state = state.PLAYING;
        this.game.init(playerCar, opponentCar)
    }

    setDifficulty(difficulty){
        this.game.setDifficulty(difficulty);
    }

    setPause(){
        this.state = state.PAUSE;
        this.pausedMenu.init();
    }

    removePause(){
        this.state = state.PLAYING;
        this.app.setActiveCamera('PerspectiveCar');
        this.game.removePause();
        this.game.update();
    }

    endGame(opponentTime, playerTime, playerCar, opponentCar){
        this.state = state.END;
        this.playerName = this.mainMenu.getPlayerName();
        this.endMenu.init(opponentTime, playerTime, playerCar, opponentCar, this.playerName, this.game.difficulty);
    }

    updatePickingColor(value) {
        this.pickingColor = value.replace('#', '0x');
    }

    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.pickableObjects.includes(obj.name)) {
                console.log("pickable")
                console.log(obj)
                this.changeColorOfFirstPickedObj(obj)   
            }
            // else
            //     this.restoreColorOfFirstPickedObj()
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }

}

const state = {
    PAUSE: 'pause',
    PLAYING: 'playing',
    END: 'game_end',
    MAIN_MENU: 'main_menu',
    PARKING_LOT: 'parking_lot'
}

export { GameController };

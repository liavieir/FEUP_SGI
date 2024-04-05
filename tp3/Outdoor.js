import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { Sprites } from './Sprites.js'
import { Game } from "./Game.js";

class Outdoor {
    constructor(app) {
        this.app = app;
        this.lap = 0;
        this.differenceTime = 0;
        this.effectEnabled = false;
        this.effectTime = 0;
        this.effectClock = 0;
    }

    init(){
        const outdoorBox = new THREE.BoxGeometry(7, 4, 0.3);
        const outdoorBoxMaterial = new THREE.MeshPhongMaterial({ color: 0x800000, side: THREE.DoubleSide});
        const outdoorBoxMesh = new THREE.Mesh(outdoorBox, outdoorBoxMaterial);
        outdoorBoxMesh.position.set(0, 5, -5);
        this.app.scene.add(outdoorBoxMesh);

        const outdoorLeg = new THREE.BoxGeometry(0.5, 2, 0.3);
        const outdoorLegMesh = new THREE.Mesh(outdoorLeg, outdoorBoxMaterial);
        outdoorLegMesh.position.set(0, 2, -5);
        this.app.scene.add(outdoorLegMesh);

        const outdoorGeometry = new THREE.PlaneGeometry(6.5, 3.5); 
        const outdoorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide});
        const outdoor = new THREE.Mesh(outdoorGeometry, outdoorMaterial);
        outdoor.position.set(0, 5, -4.8);
        
        this.app.scene.add(outdoor);

        const time = new THREE.Group();

        this.sprite = new Sprites();
        const timeSprite = this.sprite.createSpritesForWord("TIME:");
        timeSprite.scale.set(0.25, 0.25, 0.25);
        timeSprite.position.set(-2.5, 5.9, -5);
        timeSprite.name = "timeSprite";
        time.add(timeSprite);

        this.lastElapsedTime = this.timer().elapsedTime;
        this.exactTime = this.sprite.createSpritesForWord(this.lastElapsedTime.toFixed(2).toString()); 
        this.exactTime.scale.set(0.25, 0.25, 5.25);
        this.exactTime.name = "exactTime";

        const lapSprite = this.sprite.createSpritesForWord("LAP:");
        lapSprite.scale.set(0.25, 0.25, 0.25);
        lapSprite.position.set(-2.5, 5.3, -5);
        lapSprite.name = "lapSprite";
        time.add(lapSprite);

        this.exactLap = this.sprite.createSpritesForWord(this.lap.toString());
        this.exactLap.scale.set(0.25, 0.25, 0.25);
        this.exactLap.position.set(0.5, 5.3, -5);
        this.exactLap.name = "exactLap";

        const ofLapSprite = this.sprite.createSpritesForWord("/3");
        ofLapSprite.scale.set(0.25, 0.25, 0.25);
        ofLapSprite.position.set(0.3, 5.3, -5);
        ofLapSprite.name = "ofLapSprite";
        time.add(ofLapSprite);

        this.app.scene.add(this.exactTime);
        this.app.scene.add(this.exactLap);
        this.app.scene.add(time);

        const speedSprite = this.sprite.createSpritesForWord("SPEED:");
        speedSprite.scale.set(0.25, 0.25, 0.25);
        speedSprite.position.set(-2.5, 4.7, -5);
        speedSprite.name = "speedSprite";
        this.app.scene.add(speedSprite);

        this.exactSpeed = this.sprite.createSpritesForWord("0");
        this.exactSpeed.scale.set(0.25, 0.25, 0.25);
        this.exactSpeed.position.set(1, 4.7, -0.24);
        this.exactSpeed.name = "exactSpeed";
        this.app.scene.add(this.exactSpeed);


        const stateSprite = this.sprite.createSpritesForWord("STATE:");
        stateSprite.scale.set(0.25, 0.25, 0.25);
        stateSprite.position.set(-2.5, 4.1, -5);
        stateSprite.name = "stateSprite";
        this.app.scene.add(stateSprite);

        this.exactState = this.sprite.createSpritesForWord("PLAYING");
        this.exactState.scale.set(0.25, 0.25, 0.25);
        this.exactState.position.set(0, 4.1, -5);
        this.exactState.name = "exactState";
        this.app.scene.add(this.exactState);

        const effectSprite = this.sprite.createSpritesForWord("EFFECT:");
        effectSprite.scale.set(0.25, 0.25, 0.25);
        effectSprite.position.set(-2.5, 3.5, -5);
        effectSprite.name = "effectSprite";
        this.app.scene.add(effectSprite);

        this.exactEffect = this.sprite.createSpritesForWord("0");
        this.exactEffect.scale.set(0.25, 0.25, 0.25);
        this.exactEffect.position.set(0, 3.5, -5);
        this.exactEffect.name = "exactEffect";
        this.app.scene.add(this.exactEffect);


    }

    updateLap(){
        this.lap++;
        this.app.scene.remove(this.app.scene.getObjectByName("exactLap"));
        this.exactLap = this.sprite.createSpritesForWord(this.lap.toString());
        this.exactLap.scale.set(0.25, 0.25, 0.25);
        this.exactLap.position.set(0, 5.3, -5);
        this.exactLap.name = "exactLap";
        this.app.scene.add(this.exactLap); 

    }


    updateStateOfGame(state){
        this.app.scene.remove(this.app.scene.getObjectByName("exactState"));
        this.exactState = this.sprite.createSpritesForWord(state);
        this.exactState.scale.set(0.25, 0.25, 0.25);
        this.exactState.position.set(0, 4.1, -5);
        this.exactState.name = "exactState";
        this.app.scene.add(this.exactState);

    }


    updateEffect(time){
        this.effectEnabled = true;
        this.effectTime = time / 1000;
        this.effectClock = new THREE.Clock();
    }

    getTimer(timer) {
        this.timer = timer;
    }

    getSpeed(speed) {
        this.speed = speed;
    }

    updateDifferenceTime(time){
        this.differenceTime += time;
    }

    getExactTime(){
        return this.timer().elapsedTime + this.differenceTime;
    }

    update(){
        let newTime = this.timer().elapsedTime + this.differenceTime;
        if(newTime - this.lastElapsedTime >= 0.5){
            this.lastElapsedTime = newTime;
            this.app.scene.remove(this.app.scene.getObjectByName("exactTime"));
            this.exactTime = this.sprite.createSpritesForWord(this.lastElapsedTime.toFixed(2).toString());
            this.exactTime.scale.set(0.25, 0.25, 0.25);
            this.exactTime.position.set(0, 5.9, -5);
            this.exactTime.name = "exactTime";
            this.app.scene.add(this.exactTime);

            this.app.scene.remove(this.app.scene.getObjectByName("exactSpeed"));
            this.exactSpeed = this.sprite.createSpritesForWord(this.speed().toFixed(2).toString());
            this.exactSpeed.scale.set(0.25, 0.25, 0.25);
            this.exactSpeed.position.set(0, 4.7, -5);
            this.exactSpeed.name = "exactSpeed";
            this.app.scene.add(this.exactSpeed);

            if(this.effectEnabled){
                let time = this.effectClock.getElapsedTime();
                if(time > this.effectTime){
                    this.effectEnabled = false;
                    this.app.scene.remove(this.app.scene.getObjectByName("exactEffect"));
                    this.exactEffect = this.sprite.createSpritesForWord("0");
                    this.exactEffect.scale.set(0.25, 0.25, 0.25);
                    this.exactEffect.position.set(0, 3.5, -5);
                    this.exactEffect.name = "exactEffect";
                    this.app.scene.add(this.exactEffect);
                }else{
                    this.app.scene.remove(this.app.scene.getObjectByName("exactEffect"));
                    const timePassed = this.effectTime - time;
                    this.exactEffect = this.sprite.createSpritesForWord(timePassed.toFixed(2).toString());
                    this.exactEffect.scale.set(0.25, 0.25, 0.25);
                    this.exactEffect.position.set(0, 3.5, -5);
                    this.exactEffect.name = "exactEffect";
                    this.app.scene.add(this.exactEffect);
                }
            }
        }
    } 

    

}

export { Outdoor };
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTrack } from './Track.js';

class MyMovingVehicle {
    constructor(app, car) {
        this.app = app;
        this.car = car;
        this.speed = 0;
        this.acceleration = 0.0015;
        this.deceleration = 0.002; 
        this.rotation = 0.05;
        this.lap = 0;

        this.front = false;
        this.back = false;
        this.left = false;
        this.right = false;


        this.max = 0.2;

        this.controlsReversed = false; 

        this.initKeyboardListeners();

    }

    initKeyboardListeners() {
        document.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
        document.addEventListener('keyup', (event) => this.handleKeyUp(event), false);
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.front = true;
                break;
            case 's':
                this.back = true;
                break;
            case 'a':
                this.handleLeftKeyDown();
                break;
            case 'd':
                this.handleRightKeyDown();
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'w':
                this.front = false;
                break;
            case 's':
                this.back = false;
                break;
            case 'a':
                this.handleLeftKeyUp();
                break;
            case 'd':
                this.handleRightKeyUp();
                break;
        }
    }

    handleLeftKeyDown() {
        if (this.speed !== 0) {
            this.left = true;

        }


    }

    handleRightKeyDown() {
        if (this.speed !== 0) {
            this.right = true;
        }
    }

    handleLeftKeyUp() {

        this.left = false;

        
    }

    handleRightKeyUp() {

        this.right = false;   
    }

    getSpeed() {
        return this.speed;
    }

    getMaxSpeed(){
        return this.max;
    }

    setSpeed(speed) {
        this.speed = speed;
    }


    updateMaxSpeed(maxSpeed){
        this.max = maxSpeed;
    }

    update() {
        this.updateSpeed();
        this.updateRotation();
        this.updatePosition();
    }

    getCar(){
        return this.car;
    }

    updateSpeed() {
        if (this.front) {
            this.speed += this.acceleration;
        }
        if (this.back) {
            this.speed -= this.acceleration;
        }

        if (!this.front && !this.back) {
            const decelerationValue = Math.sign(this.speed) * this.deceleration;
            this.speed = Math.abs(this.speed) > Math.abs(decelerationValue)
                ? this.speed - decelerationValue
                : 0;
        }

        this.speed = THREE.MathUtils.clamp(this.speed, -this.max, this.max);

        // console.log(this.speed);
    }
    updateRotation() {
        const rotationSpeed = 0.5;
    
        if (!this.controlsReversed) {
            if (this.left) {
                this.car.rotation.y += this.rotation;
                this.zeroRotationFrontWheels();
                this.rotateBackWheels(this.speed * rotationSpeed);
                this.rotateWheelsLeftRight(Math.PI / 6);
            } else if (this.right) {
                this.car.rotation.y -= this.rotation;
                this.zeroRotationFrontWheels();
                this.rotateBackWheels(this.speed * rotationSpeed);
                this.rotateWheelsLeftRight(-Math.PI / 6);
                
            } else if (this.front || this.back) {
                // Wheels rotation
                this.rotateWheelsLeftRight(0);
                this.rotateBackWheels(this.speed * rotationSpeed);
                this.rotateFrontWheels(this.speed * rotationSpeed);
            }

        } else {
            if (this.left) {
                this.car.rotation.y -= this.rotation;
                this.zeroRotationFrontWheels();
                this.rotateBackWheels(this.speed * rotationSpeed);
                this.rotateWheelsLeftRight(-Math.PI / 6);
            } else if (this.right) {
                this.car.rotation.y += this.rotation;
                this.zeroRotationFrontWheels();
                this.rotateBackWheels(this.speed * rotationSpeed);
                this.rotateWheelsLeftRight(Math.PI / 6);
            }
    
            if (this.front || this.back && !this.left && !this.right) {
                this.rotateWheelsLeftRight(0);
                this.rotateBackWheels(this.speed * rotationSpeed);
                this.rotateFrontWheels(this.speed * rotationSpeed);
            }
    
        }
    }
    
    rotateWheelsLeftRight(rotationAmountSides) {
        // Rotate front wheels for steering input
        this.car.children[0].children[0].children[0].rotation.y = rotationAmountSides;
        this.car.children[0].children[0].children[2].rotation.y = rotationAmountSides;
    }
    
    rotateBackWheels(rotationAmount) {
        // Rotate all wheels for front/back rotation input
        this.car.children[0].children[0].children[1].rotation.x += rotationAmount;
        this.car.children[0].children[0].children[3].rotation.x += rotationAmount;
    }

    rotateFrontWheels(rotationAmount){
        // Rotate all wheels for front/back rotation input
        this.car.children[0].children[0].children[0].rotation.x += rotationAmount;
        this.car.children[0].children[0].children[2].rotation.x += rotationAmount;
    }

    zeroRotationFrontWheels(){
        this.car.children[0].children[0].children[0].rotation.x = 0;
        this.car.children[0].children[0].children[2].rotation.x = 0;
    }
    
    updateLap(){
        this.lap++;
        return this.lap;
    }

    updatePosition() {
        const deltaZ = this.speed * Math.cos(this.car.rotation.y);
        const deltaX = this.speed * Math.sin(this.car.rotation.y);

        this.car.position.x += deltaX;
        this.car.position.z += deltaZ;
    }

    setToggleControls(direction) {
        this.controlsReversed = direction;
    }



}

export { MyMovingVehicle };

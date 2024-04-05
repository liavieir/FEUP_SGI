import * as THREE from "three";

class PausedMenu {

    constructor(app, removePause){
        this.app = app;
        this.removePause = removePause; 

        this.group = new THREE.Group();

    }

    init() {
        this.app.setActiveCamera('PausedMenu');
        this.app.scene.add(this.group); 
    }

    handleMouseClicks(intersects) {
        
    }

    handleKeyDown(event) {
        switch (event.key) {
            case ' ':
                this.app.scene.remove(this.group);
                this.removePause();
                break;
        }
    }

    handleKeyUp(event) {
    }

    update() {}
    
}

export { PausedMenu };
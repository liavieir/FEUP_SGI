import * as THREE from "three";

class Sprites {
    constructor(word, width = 1, height = 1) {
        this.word = word;
        this.numRows = 9;
        this.numColumns = 16;
    }

    createSpritesForWord(word){
        const sprites = new THREE.Group();
        var Position = {x:0, y:0, z:1};

        for(let i= 0; i < word.length; i++){
            var charCode = word.charCodeAt(i);
            var mesh = this.createSpriteForChar(charCode);
            
            mesh.position.set(
            Position.x + i, Position.y, Position.z
            )

            sprites.add(mesh)
        }

        //sprites.rotateY(Math.PI/2)
        return sprites;
    }


    createSpriteForChar(charCode) {
        if(charCode === 32){
            charCode = 95;
        }
        charCode = charCode - 32;

        var texture = new THREE.TextureLoader().load('images/sprite.png');

        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide});

        var geometry = new THREE.PlaneGeometry(1,1);

        var targetRow = Math.floor((charCode) / this.numColumns);
        var targetColumn = charCode % this.numColumns;

        var uvScaleY = 1 / this.numRows;
        var uvScaleX = 1 / this.numColumns;
        var uvOffsetX = targetColumn * uvScaleX;
        var uvOffsetY = targetRow * uvScaleY;

        geometry.setAttribute('uv', new THREE.BufferAttribute(
            new Float32Array([
                uvOffsetX, 1 - uvOffsetY,
                uvOffsetX + uvScaleX, 1 - uvOffsetY,
                uvOffsetX, 1 - (uvOffsetY + uvScaleY),
                uvOffsetX + uvScaleX, 1 - (uvOffsetY + uvScaleY)
            ]), 2
        ));

        var mesh = new THREE.Mesh(geometry, material);

        return mesh;

    }

}

export { Sprites };

import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';

// create the application object
let app = new MyApp()
// initializes the application
app.init()

// create the gui interface object
let gui = new MyGuiInterface(app)
// we call the gui interface init 
// after contents were created because
// interface elements may control contents items
gui.init();

// main animation loop - calls every 50-60 ms.
app.render()

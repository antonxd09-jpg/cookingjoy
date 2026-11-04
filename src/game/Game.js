import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { InputManager } from '../systems/InputManager.js';
import { LevelManager } from '../systems/LevelManager.js';
import { HintSystem } from '../systems/HintSystem.js';
import { UIManager } from '../ui/UIManager.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.clock = new THREE.Clock();
    this.score = 0;
    this.currentLevel = 0;

    this.sceneManager = new SceneManager(this);
    this.particleSystem = new ParticleSystem();
    this.uiManager = new UIManager(this);
    this.hintSystem = new HintSystem(this);
    this.inputManager = new InputManager(this);
    this.levelManager = new LevelManager(this);

    window.addEventListener('resize', () => this.onResize());
  }

  start() {
    this.levelManager.loadLevel(this.currentLevel);
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.sceneManager.update(delta);
    this.levelManager.update(delta);
    this.inputManager.update(delta);
    this.renderer.render(this.sceneManager.scene, this.sceneManager.camera);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.sceneManager.camera.aspect = w / h;
    this.sceneManager.camera.updateProjectionMatrix();
  }

  addScore(pts) {
    this.score += pts;
    this.uiManager.updateScore(this.score);
    this.particleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, '#ffdd44', 12);
  }

  nextLevel() {
    this.currentLevel = (this.currentLevel + 1) % 5;
    this.levelManager.loadLevel(this.currentLevel);
  }
}

import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { IngredientFactory } from '../game/IngredientFactory.js';
import { CharacterFactory } from '../game/CharacterFactory.js';
import { CookingStation } from '../game/CookingStation.js';

export class Level4Dessert extends BaseLevel {
  constructor(game) {
    super(game);
    this.name = '🍰 Десерт';
    this.recipe = ['cream', 'strawberry'];
  }

  load() {
    const cream = IngredientFactory.create('cream', new THREE.Vector3(-1.5, 0.7, -2.5));
    this.addDraggable(cream);
    const strawberry = IngredientFactory.create('strawberry', new THREE.Vector3(0, 0.7, -2.5));
    this.addDraggable(strawberry);
    const bread = IngredientFactory.create('bread', new THREE.Vector3(1.5, 0.7, -2.5));
    this.addDraggable(bread);

    const plate = CookingStation.createPlate(new THREE.Vector3(0, 0.65, -1));
    this.addStation(plate);
    const board = CookingStation.createCuttingBoard(new THREE.Vector3(-1.5, 0.65, -1));
    this.addStation(board);

    this.character = CharacterFactory.createCharacter(0xffaacc);
    this.character.position.set(2.5, 0.5, 1.5);
    this.character.scale.set(0.8, 0.8, 0.8);
    this.addToScene(this.character);

    this.hintSteps = [
      { text: '🍓 Возьми клубнику!', targetObject: strawberry },
      { text: '✂️ Нарежь на доске!', targetObject: board },
      { text: '🍞 Возьми бисквит!', targetObject: bread },
      { text: '🍽️ Положи на тарелку!', targetObject: plate },
      { text: '🍦 Добавь крем!', targetObject: cream },
      { text: '😍 Угости персонажа десертом!', targetObject: this.character }
    ];
  }

  _feedCharacter(dishObj) {
    if (!this.character || this.completed) return;
    this.completed = true;
    dishObj.visible = false;
    CharacterFactory.playEatAnimation(this.character, () => {
      this.game.particleSystem.celebrate(
        window.innerWidth / 2, window.innerHeight * 0.4
      );
      setTimeout(() => {
        this.game.addScore(220);
        this.game.uiManager.showReward(3, 220);
      }, 500);
    });
    this.game.hintSystem.hide();
  }

  _createReadyDish() {
    const group = new THREE.Group();
    const pGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.05, 14);
    const pMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    group.add(new THREE.Mesh(pGeo, pMat));
    // Бисквит
    const bGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 12);
    const bMat = new THREE.MeshLambertMaterial({ color: 0xd2956a });
    const b = new THREE.Mesh(bGeo, bMat);
    b.position.y = 0.1;
    group.add(b);
    // Крем (башенка)
    for (let i = 0; i < 4; i++) {
      const cGeo = new THREE.SphereGeometry(0.08 - i * 0.012, 8, 6);
      const cMat = new THREE.MeshLambertMaterial({ color: 0xfffaee });
      const c = new THREE.Mesh(cGeo, cMat);
      c.position.y = 0.22 + i * 0.1;
      group.add(c);
    }
    // Клубника
    const sGeo = new THREE.SphereGeometry(0.07, 8, 6);
    const sMat = new THREE.MeshLambertMaterial({ color: 0xff1744 });
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const s = new THREE.Mesh(sGeo, sMat);
      s.position.set(Math.cos(a) * 0.2, 0.15, Math.sin(a) * 0.2);
      group.add(s);
    }
    return group;
  }

  update(delta) { super.update(delta); }
}

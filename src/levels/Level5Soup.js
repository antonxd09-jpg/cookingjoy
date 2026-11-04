import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { IngredientFactory } from '../game/IngredientFactory.js';
import { CharacterFactory } from '../game/CharacterFactory.js';
import { CookingStation } from '../game/CookingStation.js';

export class Level5Soup extends BaseLevel {
  constructor(game) {
    super(game);
    this.name = '🍲 Суп';
    this.recipe = ['carrot', 'potato', 'onion'];
  }

  load() {
    const carrot = IngredientFactory.create('carrot', new THREE.Vector3(-2, 0.7, -2.5));
    this.addDraggable(carrot);
    const potato = IngredientFactory.create('potato', new THREE.Vector3(-0.5, 0.7, -2.5));
    this.addDraggable(potato);
    const onion = IngredientFactory.create('onion', new THREE.Vector3(1, 0.7, -2.5));
    this.addDraggable(onion);

    const board = CookingStation.createCuttingBoard(new THREE.Vector3(-1.5, 0.65, -1));
    this.addStation(board);
    const pot = CookingStation.createPot(new THREE.Vector3(0.5, 0.65, -1));
    this.addStation(pot);
    const stove = CookingStation.createStove(new THREE.Vector3(0.5, 0.1, -1.5));
    this.addToScene(stove);
    const plate = CookingStation.createPlate(new THREE.Vector3(2, 0.65, -1));
    this.addStation(plate);

    this.character = CharacterFactory.createCharacter(0x99ccff);
    this.character.position.set(3, 0.5, 1.5);
    this.character.scale.set(0.8, 0.8, 0.8);
    this.addToScene(this.character);

    this.hintSteps = [
      { text: '🥕 Возьми морковь!', targetObject: carrot },
      { text: '🔪 Нарежь на доске!', targetObject: board },
      { text: '🥔 Возьми картошку и нарежь!', targetObject: potato },
      { text: '🧅 Добавь лук!', targetObject: onion },
      { text: '🍲 Всё в кастрюлю!', targetObject: pot },
      { text: '🔥 Суп варится... подожди!', targetObject: null },
      { text: '🍽️ Перелей суп в тарелку!', targetObject: plate },
      { text: '😋 Накорми персонажа!', targetObject: this.character }
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
        this.game.addScore(250);
        this.game.uiManager.showReward(3, 250);
      }, 500);
    });
    this.game.hintSystem.hide();
  }

  _createReadyDish() {
    const group = new THREE.Group();
    // Тарелка с бортиками (суп)
    const bowlGeo = new THREE.SphereGeometry(0.42, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const bowlMat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.rotation.x = Math.PI;
    bowl.position.y = 0.05;
    group.add(bowl);
    // Суп
    const soupGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.03, 14);
    const soupMat = new THREE.MeshLambertMaterial({ color: 0xffaa55, transparent: true, opacity: 0.85 });
    const soup = new THREE.Mesh(soupGeo, soupMat);
    soup.position.y = 0.08;
    group.add(soup);
    // Кусочки овощей
    const vegColors = [0xff6600, 0xd2b48c, 0xdda0dd];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const vGeo = new THREE.BoxGeometry(0.07, 0.04, 0.07);
      const vMat = new THREE.MeshLambertMaterial({ color: vegColors[i % 3] });
      const v = new THREE.Mesh(vGeo, vMat);
      v.position.set(Math.cos(a) * 0.2, 0.11, Math.sin(a) * 0.2);
      v.rotation.y = a;
      group.add(v);
    }
    return group;
  }

  update(delta) { super.update(delta); }
}

import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { IngredientFactory } from '../game/IngredientFactory.js';
import { CharacterFactory } from '../game/CharacterFactory.js';
import { CookingStation } from '../game/CookingStation.js';

export class Level3Pizza extends BaseLevel {
  constructor(game) {
    super(game);
    this.name = '🍕 Пицца';
    this.recipe = ['dough', 'sauce', 'cheese', 'tomato'];
  }

  load() {
    const dough = IngredientFactory.create('dough', new THREE.Vector3(-2, 0.7, -2.5));
    this.addDraggable(dough);
    const sauce = IngredientFactory.create('sauce', new THREE.Vector3(-0.5, 0.7, -2.5));
    this.addDraggable(sauce);
    const cheese = IngredientFactory.create('cheese', new THREE.Vector3(0.8, 0.7, -2.5));
    this.addDraggable(cheese);
    const tomato = IngredientFactory.create('tomato', new THREE.Vector3(2, 0.7, -2.5));
    this.addDraggable(tomato);

    const board = CookingStation.createCuttingBoard(new THREE.Vector3(-1, 0.65, -1));
    this.addStation(board);
    const pan = CookingStation.createPan(new THREE.Vector3(0.5, 0.65, -1));
    this.addStation(pan);
    const plate = CookingStation.createPlate(new THREE.Vector3(2, 0.65, -1));
    this.addStation(plate);
    const stove = CookingStation.createStove(new THREE.Vector3(0.5, 0.1, -1.5));
    this.addToScene(stove);

    this.character = CharacterFactory.createCharacter(0xaaddff);
    this.character.position.set(3, 0.5, 1.5);
    this.character.scale.set(0.8, 0.8, 0.8);
    this.addToScene(this.character);

    this.hintSteps = [
      { text: '🫓 Возьми тесто!', targetObject: dough },
      { text: '🔪 Раскатай тесто на доске!', targetObject: board },
      { text: '🍅 Добавь соус!', targetObject: sauce },
      { text: '🧀 Добавь сыр!', targetObject: cheese },
      { text: '🍕 Положи в сковороду!', targetObject: pan },
      { text: '🔥 Запекай пиццу...', targetObject: null },
      { text: '🍽️ Выложи на тарелку!', targetObject: plate },
      { text: '😋 Угости персонажа!', targetObject: this.character }
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
        this.game.addScore(180);
        this.game.uiManager.showReward(3, 180);
      }, 500);
    });
    this.game.hintSystem.hide();
  }

  _createReadyDish() {
    const group = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(0.5, 0.45, 0.05, 16);
    const plateMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    group.add(new THREE.Mesh(plateGeo, plateMat));
    // Основа пиццы
    const baseGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.05, 14);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.07;
    group.add(base);
    // Соус
    const sauceGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.02, 14);
    const sauceMat = new THREE.MeshLambertMaterial({ color: 0xcc2200 });
    const sauce = new THREE.Mesh(sauceGeo, sauceMat);
    sauce.position.y = 0.11;
    group.add(sauce);
    // Сыр
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const chGeo = new THREE.BoxGeometry(0.12, 0.03, 0.12);
      const chMat = new THREE.MeshLambertMaterial({ color: 0xffee55 });
      const ch = new THREE.Mesh(chGeo, chMat);
      ch.position.set(Math.cos(a) * 0.2, 0.14, Math.sin(a) * 0.2);
      ch.rotation.y = a;
      group.add(ch);
    }
    return group;
  }

  update(delta) { super.update(delta); }
}

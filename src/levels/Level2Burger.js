import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { IngredientFactory } from '../game/IngredientFactory.js';
import { CharacterFactory } from '../game/CharacterFactory.js';
import { CookingStation } from '../game/CookingStation.js';

export class Level2Burger extends BaseLevel {
  constructor(game) {
    super(game);
    this.name = '🍔 Бургер';
    this.recipe = ['bun', 'patty', 'lettuce', 'tomato', 'cheese'];
  }

  load() {
    const bun = IngredientFactory.create('bun', new THREE.Vector3(-2, 0.7, -2.5));
    this.addDraggable(bun);
    const patty = IngredientFactory.create('patty', new THREE.Vector3(-0.8, 0.7, -2.5));
    this.addDraggable(patty);
    const lettuce = IngredientFactory.create('lettuce', new THREE.Vector3(0.4, 0.7, -2.5));
    this.addDraggable(lettuce);
    const tomato = IngredientFactory.create('tomato', new THREE.Vector3(1.5, 0.7, -2.5));
    this.addDraggable(tomato);
    const cheese = IngredientFactory.create('cheese', new THREE.Vector3(2.5, 0.7, -2.5));
    this.addDraggable(cheese);

    const pan = CookingStation.createPan(new THREE.Vector3(-1, 0.65, -1));
    this.addStation(pan);
    const stove = CookingStation.createStove(new THREE.Vector3(-1, 0.1, -1.5));
    this.addToScene(stove);
    const plate = CookingStation.createPlate(new THREE.Vector3(1, 0.65, -1));
    this.addStation(plate);
    const board = CookingStation.createCuttingBoard(new THREE.Vector3(0, 0.65, 0));
    this.addStation(board);

    this.character = CharacterFactory.createCharacter(0xff9966);
    this.character.position.set(3, 0.5, 1);
    this.character.scale.set(0.8, 0.8, 0.8);
    this.addToScene(this.character);

    this.hintSteps = [
      { text: '🍖 Возьми котлету!', targetObject: patty },
      { text: '🍳 Положи на сковороду!', targetObject: pan },
      { text: '🔥 Жди пока поджарится...', targetObject: null },
      { text: '🍅 Возьми помидор и нарежь на доске!', targetObject: tomato },
      { text: '🥬 Возьми салат!', targetObject: lettuce },
      { text: '🧀 Возьми сыр!', targetObject: cheese },
      { text: '🍔 Собери бургер на тарелке!', targetObject: plate },
      { text: '😋 Угости персонажа бургером!', targetObject: this.character }
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
        this.game.addScore(200);
        this.game.uiManager.showReward(3, 200);
      }, 500);
    });
    this.game.hintSystem.hide();
  }

  _createReadyDish() {
    const group = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.05, 14);
    const plateMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    group.add(new THREE.Mesh(plateGeo, plateMat));
    // Нижняя булочка
    const botGeo = new THREE.CylinderGeometry(0.3, 0.28, 0.1, 10);
    const bunMat = new THREE.MeshLambertMaterial({ color: 0xe8a060 });
    const bot = new THREE.Mesh(botGeo, bunMat);
    bot.position.y = 0.08;
    group.add(bot);
    // Котлета
    const pattyGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.09, 10);
    const pattyMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const patty = new THREE.Mesh(pattyGeo, pattyMat);
    patty.position.y = 0.19;
    group.add(patty);
    // Сыр
    const cheGeo = new THREE.BoxGeometry(0.4, 0.04, 0.35);
    const cheMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
    const che = new THREE.Mesh(cheGeo, cheMat);
    che.position.y = 0.3;
    group.add(che);
    // Верхняя булочка
    const topGeo = new THREE.SphereGeometry(0.28, 10, 8);
    const top = new THREE.Mesh(topGeo, bunMat);
    top.scale.y = 0.6;
    top.position.y = 0.42;
    group.add(top);
    return group;
  }

  update(delta) { super.update(delta); }
}

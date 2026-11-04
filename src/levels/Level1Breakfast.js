import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { IngredientFactory } from '../game/IngredientFactory.js';
import { CharacterFactory } from '../game/CharacterFactory.js';
import { CookingStation } from '../game/CookingStation.js';

export class Level1Breakfast extends BaseLevel {
  constructor(game) {
    super(game);
    this.name = '🍳 Завтрак';
    this.recipe = ['egg'];
    this.hintSteps = [];
  }

  load() {
    // Создаём яйцо
    const egg = IngredientFactory.create('egg', new THREE.Vector3(-1.5, 0.7, -2));
    this.addDraggable(egg);

    // Хлеб
    const bread = IngredientFactory.create('bread', new THREE.Vector3(0.5, 0.7, -2));
    this.addDraggable(bread);

    // Сковородка
    const pan = CookingStation.createPan(new THREE.Vector3(-1, 0.65, -1));
    this.addStation(pan);

    // Плита
    const stove = CookingStation.createStove(new THREE.Vector3(-1, 0.1, -1.5));
    this.addToScene(stove);

    // Тарелка
    const plate = CookingStation.createPlate(new THREE.Vector3(1.5, 0.65, -1));
    this.addStation(plate);

    // Доска
    const board = CookingStation.createCuttingBoard(new THREE.Vector3(0, 0.65, -1));
    this.addStation(board);

    // Персонаж
    this.character = CharacterFactory.createCharacter(0xffcc88);
    this.character.position.set(2.5, 0.5, 1.5);
    this.character.scale.set(0.8, 0.8, 0.8);
    this.addToScene(this.character);

    // Подсказки
    this.hintSteps = [
      { text: '🥚 Возьми яйцо!', targetObject: egg },
      { text: '🍳 Положи на сковороду!', targetObject: pan },
      { text: '🔥 Яйцо жарится...', targetObject: null },
      { text: '🍞 Возьми хлеб!', targetObject: bread },
      { text: '✂️ Перемести на доску!', targetObject: board },
      { text: '🔪 Проведи пальцем по доске — нарежь!', targetObject: null },
      { text: '🍽️ Собери завтрак на тарелке!', targetObject: plate },
      { text: '😋 Отнеси тарелку персонажу!', targetObject: this.character }
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
        this.game.addScore(150);
        this.game.uiManager.showReward(3, 150);
      }, 500);
    });
    this.game.hintSystem.hide();
  }

  _createReadyDish() {
    const group = new THREE.Group();
    // Тарелка
    const plateGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.05, 14);
    const plateMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    group.add(plate);
    // Яичница
    const eggGeo = new THREE.SphereGeometry(0.15, 8, 6);
    const eggMat = new THREE.MeshLambertMaterial({ color: 0xfffde7 });
    const eggM = new THREE.Mesh(eggGeo, eggMat);
    eggM.scale.y = 0.4;
    eggM.position.set(-0.05, 0.08, 0.05);
    group.add(eggM);
    const yolkGeo = new THREE.SphereGeometry(0.07, 8, 6);
    const yolkMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
    const yolk = new THREE.Mesh(yolkGeo, yolkMat);
    yolk.position.set(-0.05, 0.1, 0.05);
    group.add(yolk);
    // Хлеб
    const bGeo = new THREE.BoxGeometry(0.3, 0.1, 0.25);
    const bMat = new THREE.MeshLambertMaterial({ color: 0xd2956a });
    const bread = new THREE.Mesh(bGeo, bMat);
    bread.position.set(0.1, 0.08, -0.1);
    group.add(bread);
    return group;
  }

  update(delta) {
    super.update(delta);
  }
}

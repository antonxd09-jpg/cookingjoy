import * as THREE from 'three';

export class BaseLevel {
  constructor(game) {
    this.game = game;
    this.name = 'Уровень';
    this.objects = [];
    this.draggables = [];
    this.clickables = [];
    this.stations = [];
    this.character = null;
    this.hintSteps = [];
    this.stepIndex = 0;
    this.completed = false;
    this.cookingProgress = {};
    this.requiredSteps = [];
    this.completedSteps = [];
    this.animationMixers = [];
  }

  load() { /* переопределить */ }

  unload() {
    this.objects.forEach(obj => {
      this.game.sceneManager.scene.remove(obj);
    });
    this.objects = [];
    this.draggables = [];
    this.clickables = [];
    this.stations = [];
  }

  addToScene(obj) {
    this.game.sceneManager.scene.add(obj);
    this.objects.push(obj);
  }

  addDraggable(obj) {
    this.draggables.push(obj);
    this.addToScene(obj);
  }

  addStation(station) {
    this.stations.push(station);
    this.addToScene(station);
  }

  getDraggables() { return this.draggables; }
  getClickables() { return this.clickables; }

  checkDrop(obj) {
    // Проверка попадания в зону станции
    const pos = obj.position;
    for (const station of this.stations) {
      const dist = new THREE.Vector3()
        .subVectors(pos, station.position).length();
      if (dist < 0.9) {
        this._onDropToStation(obj, station);
        return;
      }
    }
    // Проверка кормления персонажа
    if (this.character) {
      const charDist = new THREE.Vector3()
        .subVectors(pos, this.character.position).length();
      if (charDist < 1.2 && obj.userData.isReadyDish) {
        this._feedCharacter(obj);
        return;
      }
    }
    obj.position.copy(obj.userData.originalPosition);
    obj.position.y = obj.userData.originalPosition.y;
  }

  _onDropToStation(obj, station) {
    if (station.userData.stationType === 'cutting_board') {
      obj.userData.sliceable = true;
      obj.position.copy(station.position);
      obj.position.y = station.position.y + 0.2;
      this.game.hintSystem.nextStep();
    } else if (station.userData.stationType === 'plate') {
      station.userData.contents.push(obj.userData.type);
      obj.position.copy(station.position);
      obj.position.y = station.position.y + 0.1 * station.userData.contents.length;
      this._checkRecipe(station);
    } else if (station.userData.stationType === 'pan') {
      station.userData.contents.push(obj.userData.type);
      obj.position.copy(station.position);
      obj.position.y = station.position.y + 0.15;
      this._startCooking(station, obj);
    } else if (station.userData.stationType === 'pot') {
      station.userData.contents.push(obj.userData.type);
      obj.position.copy(station.position);
      obj.position.y = station.position.y + 0.1 * station.userData.contents.length;
      this._checkRecipe(station);
    } else {
      obj.position.copy(obj.userData.originalPosition);
    }
  }

  _startCooking(station, obj) {
    obj.userData.cooking = true;
    obj.userData.cookTimer = 0;
    obj.userData.cookDuration = 2.5;
    this.game.hintSystem.nextStep();
    this.game.particleSystem.burst(
      window.innerWidth / 2, window.innerHeight * 0.6, '#ff9500', 8
    );
  }

  _checkRecipe(station) {
    if (!this.recipe) return;
    const contents = station.userData.contents;
    const matched = this.recipe.every(item => contents.includes(item));
    if (matched) {
      this._onDishReady(station);
    }
  }

  _onDishReady(station) {
    this.game.hintSystem.nextStep();
    this.game.particleSystem.celebrate(
      window.innerWidth / 2, window.innerHeight * 0.5
    );
    // Создаём готовое блюдо
    const dishObj = this._createReadyDish();
    dishObj.position.copy(station.position);
    dishObj.position.y = station.position.y + 0.4;
    dishObj.userData.draggable = true;
    dishObj.userData.isReadyDish = true;
    this.addToScene(dishObj);
    this.draggables.push(dishObj);
  }

  _createReadyDish() {
    const geo = new THREE.SphereGeometry(0.25, 10, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffaa44 });
    return new THREE.Mesh(geo, mat);
  }

  _feedCharacter(dishObj) {
    if (!this.character || this.completed) return;
    this.completed = true;
    dishObj.visible = false;
    this.game.sceneManager.scene.remove(dishObj);
    const { CharacterFactory } = require('../game/CharacterFactory.js');
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

  onObjectClick(obj) {}
  onSlice(obj) {
    // Анимация нарезки
    obj.scale.set(1, 0.5, 1);
    obj.userData.sliced = true;
    this.game.particleSystem.burst(
      window.innerWidth / 2, window.innerHeight * 0.5, '#44cc44', 8
    );
    this.game.hintSystem.nextStep();
    this.game.addScore(10);
  }

  update(delta) {
    // Обновление анимаций
    if (this.character) {
      const { CharacterFactory } = require('../game/CharacterFactory.js');
      CharacterFactory.updateCharacter(this.character, delta);
    }
    // Обновление готовки
    this.draggables.forEach(obj => {
      if (obj.userData.cooking) {
        obj.userData.cookTimer += delta;
        obj.rotation.y += delta * 2;
        if (obj.userData.cookTimer >= obj.userData.cookDuration) {
          obj.userData.cooking = false;
          const mat = obj.children[0]?.material || obj.material;
          if (mat) mat.color.setHex(0x8b4513);
        }
      }
    });
  }
}

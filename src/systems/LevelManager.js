import { Level1Breakfast } from '../levels/Level1Breakfast.js';
import { Level2Burger } from '../levels/Level2Burger.js';
import { Level3Pizza } from '../levels/Level3Pizza.js';
import { Level4Dessert } from '../levels/Level4Dessert.js';
import { Level5Soup } from '../levels/Level5Soup.js';

export class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = null;
    this.levels = [
      Level1Breakfast,
      Level2Burger,
      Level3Pizza,
      Level4Dessert,
      Level5Soup
    ];
  }

  loadLevel(index) {
    if (this.currentLevel) {
      this.currentLevel.unload();
    }
    const LevelClass = this.levels[index];
    this.currentLevel = new LevelClass(this.game);
    this.currentLevel.load();
    this.game.uiManager.setLevelTitle(this.currentLevel.name);
    this.game.hintSystem.startLevel(this.currentLevel);
  }

  getDraggables() {
    return this.currentLevel ? this.currentLevel.getDraggables() : [];
  }

  getClickables() {
    return this.currentLevel ? this.currentLevel.getClickables() : [];
  }

  checkDrop(obj) {
    if (this.currentLevel) this.currentLevel.checkDrop(obj);
  }

  onObjectClick(obj) {
    if (this.currentLevel) this.currentLevel.onObjectClick(obj);
  }

  onSlice(obj) {
    if (this.currentLevel) this.currentLevel.onSlice(obj);
  }

  update(delta) {
    if (this.currentLevel) this.currentLevel.update(delta);
  }
}

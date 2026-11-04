export class HintSystem {
  constructor(game) {
    this.game = game;
    this.hintBox = document.getElementById('hint-box');
    this.hintArrow = document.getElementById('hint-arrow');
    this.skipBtn = document.getElementById('skip-hint-btn');
    this.currentLevel = null;
    this.stepIndex = 0;
    this.skipped = false;
    this.highlightedObject = null;
    this.arrowTimer = null;

    this.skipBtn.addEventListener('click', () => this.skip());
  }

  startLevel(level) {
    this.currentLevel = level;
    this.stepIndex = 0;
    this.skipped = false;
    this.showStep(0);
  }

  showStep(index) {
    if (this.skipped || !this.currentLevel) return;
    const steps = this.currentLevel.hintSteps;
    if (!steps || index >= steps.length) {
      this.hide();
      return;
    }
    const step = steps[index];
    this.hintBox.textContent = step.text;
    this.hintBox.style.display = 'block';
    this.skipBtn.style.display = 'block';

    if (step.targetObject) {
      this._highlightObject(step.targetObject);
      this._showArrowAt(step.targetObject);
    } else {
      this._clearHighlight();
      this.hintArrow.style.display = 'none';
    }
  }

  nextStep() {
    this.stepIndex++;
    this.showStep(this.stepIndex);
  }

  onObjectPicked(obj) {
    if (this.skipped) return;
    const steps = this.currentLevel?.hintSteps;
    if (!steps) return;
    const step = steps[this.stepIndex];
    if (step && step.targetObject === obj) {
      setTimeout(() => this.nextStep(), 300);
    }
  }

  _highlightObject(obj) {
    this._clearHighlight();
    if (!obj) return;
    this.highlightedObject = obj;
    obj.userData._origScale = obj.scale.clone();
    obj.userData._glowTimer = 0;
  }

  _clearHighlight() {
    if (this.highlightedObject) {
      const obj = this.highlightedObject;
      if (obj.userData._origScale) {
        obj.scale.copy(obj.userData._origScale);
      }
      this.highlightedObject = null;
    }
  }

  _showArrowAt(obj) {
    if (!obj) { this.hintArrow.style.display = 'none'; return; }
    const updateArrow = () => {
      if (!this.highlightedObject || this.skipped) {
        this.hintArrow.style.display = 'none';
        return;
      }
      const pos = obj.position.clone();
      pos.project(this.game.sceneManager.camera);
      const x = (pos.x + 1) / 2 * window.innerWidth;
      const y = (-pos.y + 1) / 2 * window.innerHeight;
      this.hintArrow.style.left = (x - 25) + 'px';
      this.hintArrow.style.top = (y - 60) + 'px';
      this.hintArrow.style.display = 'block';
      this.arrowTimer = requestAnimationFrame(updateArrow);
    };
    if (this.arrowTimer) cancelAnimationFrame(this.arrowTimer);
    updateArrow();
  }

  update(delta) {
    if (this.highlightedObject && !this.skipped) {
      this.highlightedObject.userData._glowTimer =
        (this.highlightedObject.userData._glowTimer || 0) + delta;
      const s = 1 + Math.sin(this.highlightedObject.userData._glowTimer * 4) * 0.08;
      this.highlightedObject.scale.set(s, s, s);
    }
  }

  skip() {
    this.skipped = true;
    this.hide();
    if (this.arrowTimer) cancelAnimationFrame(this.arrowTimer);
    this._clearHighlight();
  }

  hide() {
    this.hintBox.style.display = 'none';
    this.skipBtn.style.display = 'none';
    this.hintArrow.style.display = 'none';
    this._clearHighlight();
  }
}

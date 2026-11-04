export class UIManager {
  constructor(game) {
    this.game = game;
    this.scoreEl = document.getElementById('score-display');
    this.levelTitleEl = document.getElementById('level-title');
    this.rewardScreen = document.getElementById('reward-screen');
    this.rewardStars = document.getElementById('reward-stars');
    this.rewardCoins = document.getElementById('reward-coins');
    this.nextBtn = document.getElementById('next-level-btn');

    this.nextBtn.addEventListener('click', () => {
      this.hideReward();
      this.game.nextLevel();
    });
  }

  updateScore(score) {
    this.scoreEl.textContent = '⭐ ' + score;
    this.scoreEl.style.animation = 'none';
    void this.scoreEl.offsetWidth;
    this.scoreEl.style.animation = 'rewardPop 0.3s ease';
  }

  setLevelTitle(name) {
    this.levelTitleEl.textContent = name;
  }

  showReward(stars, coins) {
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    this.rewardStars.textContent = starStr;
    this.rewardCoins.textContent = '+' + coins + ' монет';
    this.rewardScreen.classList.add('show');
    this.game.particleSystem.celebrate(window.innerWidth / 2, window.innerHeight / 2);
  }

  hideReward() {
    this.rewardScreen.classList.remove('show');
  }
}

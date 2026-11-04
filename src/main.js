import { Game } from './game/Game.js';

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.style.transition = 'opacity 0.8s';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      const game = new Game();
      game.start();
    }, 800);
  }, 2200);
});

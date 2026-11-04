import * as THREE from 'three';

export class SceneManager {
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 15, 35);

    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    this.camera.position.set(0, 8, 10);
    this.camera.lookAt(0, 0, 0);

    this._buildLighting();
    this._buildKitchen();
  }

  _buildLighting() {
    const ambient = new THREE.AmbientLight(0xfff8e1, 0.7);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5c0, 1.4);
    sun.position.set(5, 12, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.bias = -0.001;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(0xc8e8ff, 0.5);
    fill.position.set(-6, 5, -3);
    this.scene.add(fill);

    const pointLight1 = new THREE.PointLight(0xffaa44, 0.8, 12);
    pointLight1.position.set(-3, 4, 2);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x44aaff, 0.5, 10);
    pointLight2.position.set(4, 4, -2);
    this.scene.add(pointLight2);
  }

  _buildKitchen() {
    // Пол
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0xf5e6c8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Плитка пола
    const tileGeo = new THREE.PlaneGeometry(1, 1);
    const tileMat1 = new THREE.MeshLambertMaterial({ color: 0xffe4b5 });
    const tileMat2 = new THREE.MeshLambertMaterial({ color: 0xffd090 });
    for (let x = -8; x < 8; x++) {
      for (let z = -8; z < 8; z++) {
        const tile = new THREE.Mesh(tileGeo, (x + z) % 2 === 0 ? tileMat1 : tileMat2);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(x + 0.5, 0, z + 0.5);
        tile.receiveShadow = true;
        this.scene.add(tile);
      }
    }

    // Задняя стена
    const wallGeo = new THREE.PlaneGeometry(20, 8);
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xfff9f0 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 4, -6);
    wall.receiveShadow = true;
    this.scene.add(wall);

    // Кухонная столешница
    this._buildCounter(-2, 0, -3, 5, 0.6, 1.5, 0x8b6914, 0xd4a853);
    // Вторая столешница
    this._buildCounter(3.5, 0, 0, 1.5, 0.6, 3, 0x8b6914, 0xd4a853);

    // Шкафы над столом
    this._buildCabinet(-3.5, 3.5, -5, 2.5, 1.5, 0.8, 0xa0522d);
    this._buildCabinet(0.5, 3.5, -5, 2.5, 1.5, 0.8, 0xa0522d);

    // Окно
    this._buildWindow(0, 4.5, -5.9);
  }

  _buildCounter(x, y, z, w, h, d, sideColor, topColor) {
    const bodyGeo = new THREE.BoxGeometry(w, h, d);
    const bodyMat = new THREE.MeshLambertMaterial({ color: sideColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(x, y + h / 2, z);
    body.castShadow = true;
    body.receiveShadow = true;
    this.scene.add(body);

    const topGeo = new THREE.BoxGeometry(w + 0.1, 0.08, d + 0.1);
    const topMat = new THREE.MeshLambertMaterial({ color: topColor });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(x, y + h + 0.04, z);
    top.castShadow = true;
    top.receiveShadow = true;
    this.scene.add(top);
  }

  _buildCabinet(x, y, z, w, h, d, color) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color });
    const cab = new THREE.Mesh(geo, mat);
    cab.position.set(x, y, z);
    cab.castShadow = true;
    this.scene.add(cab);

    // Дверцы
    const doorGeo = new THREE.BoxGeometry(w * 0.45, h * 0.85, 0.05);
    const doorMat = new THREE.MeshLambertMaterial({ color: 0xcd853f });
    for (let i = -1; i <= 1; i += 2) {
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(x + i * w * 0.25, y, z + d / 2 + 0.025);
      this.scene.add(door);
    }
  }

  _buildWindow(x, y, z) {
    const frameGeo = new THREE.BoxGeometry(3, 2, 0.1);
    const frameMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(x, y, z);
    this.scene.add(frame);

    const glassGeo = new THREE.BoxGeometry(2.6, 1.6, 0.02);
    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.5
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(x, y, z + 0.07);
    this.scene.add(glass);
  }

  update(delta) {
    // Обновление анимаций сцены
  }
}

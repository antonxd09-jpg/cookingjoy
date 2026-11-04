import * as THREE from 'three';

export class CookingStation {
  static createPlate(position) {
    const group = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(0.45, 0.4, 0.06, 16);
    const plateMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    group.add(plate);
    const rimGeo = new THREE.TorusGeometry(0.42, 0.04, 6, 20);
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.03;
    group.add(rim);
    group.position.copy(position);
    group.userData.isStation = true;
    group.userData.stationType = 'plate';
    group.userData.contents = [];
    group.castShadow = true;
    group.receiveShadow = true;
    return group;
  }

  static createCuttingBoard(position) {
    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.9, 0.06, 0.65);
    const mat = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
    const board = new THREE.Mesh(geo, mat);
    group.add(board);
    // Линии разреза
    for (let i = -1; i <= 1; i++) {
      const lineGeo = new THREE.BoxGeometry(0.88, 0.005, 0.01);
      const lineMat = new THREE.MeshLambertMaterial({ color: 0xc4a06a });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, 0.033, i * 0.1);
      group.add(line);
    }
    group.position.copy(position);
    group.userData.isStation = true;
    group.userData.stationType = 'cutting_board';
    group.userData.contents = [];
    group.castShadow = true;
    return group;
  }

  static createPan(position) {
    const group = new THREE.Group();
    const panGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.1, 14);
    const panMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
    const pan = new THREE.Mesh(panGeo, panMat);
    group.add(pan);
    const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8);
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.65, 0.02, 0);
    group.add(handle);
    group.position.copy(position);
    group.userData.isStation = true;
    group.userData.stationType = 'pan';
    group.userData.contents = [];
    group.userData.isHot = false;
    group.castShadow = true;
    return group;
  }

  static createPot(position) {
    const group = new THREE.Group();
    const potGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.5, 14);
    const potMat = new THREE.MeshLambertMaterial({ color: 0x556b2f });
    const pot = new THREE.Mesh(potGeo, potMat);
    group.add(pot);
    // Крышка
    const lidGeo = new THREE.SphereGeometry(0.37, 12, 6);
    const lidMat = new THREE.MeshLambertMaterial({ color: 0x556b2f });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.scale.y = 0.35;
    lid.position.y = 0.28;
    group.add(lid);
    // Ручки
    const hGeo = new THREE.TorusGeometry(0.1, 0.025, 6, 10, Math.PI);
    const hMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    for (let side of [-1, 1]) {
      const h = new THREE.Mesh(hGeo, hMat);
      h.position.set(side * 0.4, 0.1, 0);
      h.rotation.y = side * Math.PI / 2;
      group.add(h);
    }
    group.position.copy(position);
    group.userData.isStation = true;
    group.userData.stationType = 'pot';
    group.userData.contents = [];
    group.castShadow = true;
    return group;
  }

  static createStove(position) {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.15, 0.9);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);
    // Конфорки
    for (let x of [-0.3, 0.3]) {
      for (let z of [-0.2, 0.2]) {
        const burnerGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 12);
        const burnerMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const burner = new THREE.Mesh(burnerGeo, burnerMat);
        burner.position.set(x, 0.09, z);
        group.add(burner);
      }
    }
    group.position.copy(position);
    group.userData.isStation = true;
    group.userData.stationType = 'stove';
    group.castShadow = true;
    return group;
  }
}

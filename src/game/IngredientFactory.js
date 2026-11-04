import * as THREE from 'three';

export class IngredientFactory {
  static create(type, position) {
    let mesh;
    switch (type) {
      case 'egg': mesh = this._egg(); break;
      case 'bread': mesh = this._bread(); break;
      case 'tomato': mesh = this._tomato(); break;
      case 'lettuce': mesh = this._lettuce(); break;
      case 'cheese': mesh = this._cheese(); break;
      case 'patty': mesh = this._patty(); break;
      case 'bun': mesh = this._bun(); break;
      case 'dough': mesh = this._dough(); break;
      case 'sauce': mesh = this._sauce(); break;
      case 'strawberry': mesh = this._strawberry(); break;
      case 'cream': mesh = this._cream(); break;
      case 'carrot': mesh = this._carrot(); break;
      case 'potato': mesh = this._potato(); break;
      case 'onion': mesh = this._onion(); break;
      default: mesh = this._generic(0xff8800);
    }
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.userData.draggable = true;
    mesh.userData.type = type;
    mesh.userData.originalPosition = position.clone();
    return mesh;
  }

  static _egg() {
    const group = new THREE.Group();
    const bodyGeo = new THREE.SphereGeometry(0.22, 12, 10);
    bodyGeo.scale(1, 1.3, 1);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xfffde7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);
    return group;
  }

  static _bread() {
    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.6, 0.25, 0.5);
    const mat = new THREE.MeshLambertMaterial({ color: 0xd2956a });
    const bread = new THREE.Mesh(geo, mat);
    group.add(bread);
    // Корочка
    const crustGeo = new THREE.BoxGeometry(0.62, 0.08, 0.52);
    const crustMat = new THREE.MeshLambertMaterial({ color: 0xb5651d });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    crust.position.y = -0.085;
    group.add(crust);
    return group;
  }

  static _tomato() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.22, 12, 10);
    const mat = new THREE.MeshLambertMaterial({ color: 0xff3b1f });
    const t = new THREE.Mesh(geo, mat);
    group.add(t);
    // Стебель
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 6);
    const stemMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.22;
    group.add(stem);
    return group;
  }

  static _lettuce() {
    const group = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.SphereGeometry(0.15, 8, 6);
      const mat = new THREE.MeshLambertMaterial({ color: 0x5cb85c });
      const leaf = new THREE.Mesh(geo, mat);
      const angle = (i / 5) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 0.15, 0, Math.sin(angle) * 0.15);
      leaf.scale.set(1, 0.3, 1);
      group.add(leaf);
    }
    return group;
  }

  static _cheese() {
    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.5, 0.06, 0.4);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
    const c = new THREE.Mesh(geo, mat);
    group.add(c);
    return group;
  }

  static _patty() {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.28, 0.3, 0.12, 12);
    const mat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const p = new THREE.Mesh(geo, mat);
    group.add(p);
    return group;
  }

  static _bun() {
    const group = new THREE.Group();
    // Нижняя булочка
    const botGeo = new THREE.CylinderGeometry(0.32, 0.3, 0.15, 12);
    const bunMat = new THREE.MeshLambertMaterial({ color: 0xe8a060 });
    const bot = new THREE.Mesh(botGeo, bunMat);
    bot.position.y = -0.2;
    group.add(bot);
    // Верхняя булочка
    const topGeo = new THREE.SphereGeometry(0.3, 12, 8);
    const top = new THREE.Mesh(topGeo, bunMat);
    top.scale.y = 0.6;
    top.position.y = 0.1;
    group.add(top);
    return group;
  }

  static _dough() {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 0.06, 16);
    const mat = new THREE.MeshLambertMaterial({ color: 0xf5deb3 });
    const d = new THREE.Mesh(geo, mat);
    group.add(d);
    return group;
  }

  static _sauce() {
    const group = new THREE.Group();
    // Баночка с соусом
    const jarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 10);
    const jarMat = new THREE.MeshLambertMaterial({ color: 0xcc2200, transparent: true, opacity: 0.8 });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    group.add(jar);
    const lidGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.04, 10);
    const lidMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 0.17;
    group.add(lid);
    return group;
  }

  static _strawberry() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.18, 10, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xff1744 });
    const s = new THREE.Mesh(geo, mat);
    s.scale.y = 1.2;
    group.add(s);
    const leafGeo = new THREE.SphereGeometry(0.07, 6, 4);
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const a = (i / 3) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.08, 0.17, Math.sin(a) * 0.08);
      leaf.scale.set(0.5, 0.3, 0.5);
      group.add(leaf);
    }
    return group;
  }

  static _cream() {
    const group = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.SphereGeometry(0.1 - i * 0.015, 8, 6);
      const mat = new THREE.MeshLambertMaterial({ color: 0xfffaee });
      const ball = new THREE.Mesh(geo, mat);
      ball.position.y = i * 0.12;
      group.add(ball);
    }
    return group;
  }

  static _carrot() {
    const group = new THREE.Group();
    const geo = new THREE.ConeGeometry(0.1, 0.4, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xff6600 });
    const c = new THREE.Mesh(geo, mat);
    c.rotation.x = Math.PI;
    group.add(c);
    const topGeo = new THREE.SphereGeometry(0.06, 6, 4);
    const topMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(topGeo, topMat);
      const a = (i / 3) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.05, 0.22, Math.sin(a) * 0.05);
      leaf.scale.set(0.5, 1.5, 0.3);
      group.add(leaf);
    }
    return group;
  }

  static _potato() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.22, 10, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xd2b48c });
    const p = new THREE.Mesh(geo, mat);
    p.scale.set(1.2, 0.9, 1);
    group.add(p);
    return group;
  }

  static _onion() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.2, 10, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xdda0dd });
    const o = new THREE.Mesh(geo, mat);
    group.add(o);
    return group;
  }

  static _generic(color) {
    const geo = new THREE.SphereGeometry(0.2, 10, 8);
    const mat = new THREE.MeshLambertMaterial({ color });
    return new THREE.Mesh(geo, mat);
  }
}

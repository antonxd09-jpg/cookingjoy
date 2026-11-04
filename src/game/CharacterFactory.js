import * as THREE from 'three';

export class CharacterFactory {
  static createCharacter(color = 0xffcc88) {
    const group = new THREE.Group();

    // Тело
    const bodyGeo = new THREE.SphereGeometry(0.45, 14, 12);
    const bodyMat = new THREE.MeshLambertMaterial({ color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.set(1, 1.1, 0.9);
    body.castShadow = true;
    group.add(body);

    // Голова
    const headGeo = new THREE.SphereGeometry(0.42, 14, 12);
    const headMat = new THREE.MeshLambertMaterial({ color });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.78;
    head.castShadow = true;
    group.add(head);
    group.userData.head = head;

    // Глаза
    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 6);
    const eyeWhiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const eyePupilMat = new THREE.MeshLambertMaterial({ color: 0x222222 });

    for (let side of [-1, 1]) {
      const white = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      white.position.set(side * 0.17, 0.85, 0.35);
      white.scale.set(1, 1.1, 0.5);
      group.add(white);

      const pupilGeo = new THREE.SphereGeometry(0.045, 6, 4);
      const pupil = new THREE.Mesh(pupilGeo, eyePupilMat);
      pupil.position.set(side * 0.17, 0.85, 0.4);
      group.add(pupil);

      // Блик
      const blinkGeo = new THREE.SphereGeometry(0.018, 5, 4);
      const blinkMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const blink = new THREE.Mesh(blinkGeo, blinkMat);
      blink.position.set(side * 0.17 + 0.025, 0.87, 0.42);
      group.add(blink);
    }

    // Щёчки
    const cheekGeo = new THREE.SphereGeometry(0.1, 8, 6);
    const cheekMat = new THREE.MeshLambertMaterial({
      color: 0xff9999, transparent: true, opacity: 0.6
    });
    for (let side of [-1, 1]) {
      const cheek = new THREE.Mesh(cheekGeo, cheekMat);
      cheek.position.set(side * 0.28, 0.75, 0.33);
      cheek.scale.set(1, 0.5, 0.5);
      group.add(cheek);
    }

    // Улыбка (дуга из точек)
    const smileGeo = new THREE.TorusGeometry(0.1, 0.018, 6, 10, Math.PI);
    const smileMat = new THREE.MeshLambertMaterial({ color: 0x883333 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.position.set(0, 0.7, 0.4);
    smile.rotation.z = Math.PI;
    group.userData.smile = smile;
    group.add(smile);

    // Ручки
    const armGeo = new THREE.SphereGeometry(0.15, 8, 6);
    const armMat = new THREE.MeshLambertMaterial({ color });
    for (let side of [-1, 1]) {
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.scale.set(0.6, 1.3, 0.6);
      arm.position.set(side * 0.6, 0.1, 0);
      arm.castShadow = true;
      group.add(arm);
    }

    // Ножки
    const legGeo = new THREE.SphereGeometry(0.14, 8, 6);
    const legMat = new THREE.MeshLambertMaterial({ color });
    for (let side of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.scale.set(0.7, 1.4, 0.7);
      leg.position.set(side * 0.22, -0.6, 0);
      leg.castShadow = true;
      group.add(leg);
    }

    group.userData.isCharacter = true;
    group.userData.isHappy = false;
    group.userData.eatTimer = 0;

    return group;
  }

  static playEatAnimation(character, onDone) {
    if (!character) return;
    character.userData.isEating = true;
    character.userData.eatTimer = 0;
    character.userData.eatDuration = 1.5;
    character.userData.eatCallback = onDone;
  }

  static updateCharacter(character, delta) {
    if (!character) return;
    const head = character.userData.head;

    // Лёгкое покачивание
    if (!character.userData.isEating) {
      character.userData.bobTimer = (character.userData.bobTimer || 0) + delta;
      character.position.y += Math.sin(character.userData.bobTimer * 2) * 0.001;
      if (head) head.rotation.y = Math.sin(character.userData.bobTimer * 1.5) * 0.08;
    }

    // Анимация поедания
    if (character.userData.isEating) {
      character.userData.eatTimer += delta;
      const t = character.userData.eatTimer / character.userData.eatDuration;
      if (head) {
        head.rotation.x = Math.sin(t * Math.PI * 4) * 0.3;
        head.position.y = 0.78 + Math.abs(Math.sin(t * Math.PI * 4)) * 0.1;
      }
      character.scale.set(
        1 + Math.sin(t * Math.PI * 2) * 0.08,
        1 + Math.sin(t * Math.PI * 2) * 0.08,
        1 + Math.sin(t * Math.PI * 2) * 0.08
      );
      if (character.userData.eatTimer >= character.userData.eatDuration) {
        character.userData.isEating = false;
        character.scale.set(1, 1, 1);
        if (head) { head.rotation.x = 0; head.position.y = 0.78; }
        if (character.userData.eatCallback) {
          character.userData.eatCallback();
          character.userData.eatCallback = null;
        }
        // Счастливая эмоция
        character.userData.isHappy = true;
        character.userData.happyTimer = 0;
      }
    }

    // Счастье
    if (character.userData.isHappy) {
      character.userData.happyTimer += delta;
      character.position.y += Math.sin(character.userData.happyTimer * 8) * 0.004;
      if (character.userData.happyTimer > 2) {
        character.userData.isHappy = false;
      }
    }
  }
}

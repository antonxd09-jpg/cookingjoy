import * as THREE from 'three';

export class InputManager {
  constructor(game) {
    this.game = game;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.isDragging = false;
    this.dragObject = null;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragOffset = new THREE.Vector3();
    this.touchStartPos = { x: 0, y: 0 };
    this.touchStartTime = 0;
    this.isRotating = false;
    this.lastTouchAngle = 0;
    this.slicePoints = [];
    this.isSlicing = false;

    this._bindEvents();
  }

  _bindEvents() {
    const canvas = this.game.canvas;
    canvas.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: false });
    canvas.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
    canvas.addEventListener('touchend', (e) => this._onTouchEnd(e), { passive: false });
    canvas.addEventListener('mousedown', (e) => this._onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
    canvas.addEventListener('mouseup', (e) => this._onMouseUp(e));
  }

  _getCanvasPos(clientX, clientY) {
    const rect = this.game.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1
    };
  }

  _onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      this.isRotating = true;
      this.lastTouchAngle = Math.atan2(
        e.touches[1].clientY - e.touches[0].clientY,
        e.touches[1].clientX - e.touches[0].clientX
      );
      return;
    }
    const t = e.touches[0];
    this.touchStartPos = { x: t.clientX, y: t.clientY };
    this.touchStartTime = Date.now();
    this._startInteraction(t.clientX, t.clientY);
  }

  _onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2 && this.isRotating && this.dragObject) {
      const angle = Math.atan2(
        e.touches[1].clientY - e.touches[0].clientY,
        e.touches[1].clientX - e.touches[0].clientX
      );
      const delta = angle - this.lastTouchAngle;
      this.dragObject.rotation.y += delta;
      this.lastTouchAngle = angle;
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (this.isSlicing) {
        this.slicePoints.push({ x: t.clientX, y: t.clientY });
        this._checkSlice();
      } else {
        this._moveInteraction(t.clientX, t.clientY);
      }
    }
  }

  _onTouchEnd(e) {
    e.preventDefault();
    this.isRotating = false;
    const duration = Date.now() - this.touchStartTime;
    if (duration < 200 && !this.isDragging) {
      this._onClick(this.touchStartPos.x, this.touchStartPos.y);
    }
    this._endInteraction();
    this.slicePoints = [];
    this.isSlicing = false;
  }

  _onMouseDown(e) {
    this.touchStartPos = { x: e.clientX, y: e.clientY };
    this.touchStartTime = Date.now();
    this._startInteraction(e.clientX, e.clientY);
  }

  _onMouseMove(e) {
    if (this.isDragging) this._moveInteraction(e.clientX, e.clientY);
    if (this.isSlicing) {
      this.slicePoints.push({ x: e.clientX, y: e.clientY });
      this._checkSlice();
    }
  }

  _onMouseUp(e) {
    const duration = Date.now() - this.touchStartTime;
    if (duration < 200 && !this.isDragging) {
      this._onClick(e.clientX, e.clientY);
    }
    this._endInteraction();
    this.slicePoints = [];
    this.isSlicing = false;
  }

  _startInteraction(clientX, clientY) {
    const pos = this._getCanvasPos(clientX, clientY);
    this.pointer.set(pos.x, pos.y);
    this.raycaster.setFromCamera(this.pointer, this.game.sceneManager.camera);

    const draggables = this.game.levelManager.getDraggables();
    const hits = this.raycaster.intersectObjects(draggables, true);

    if (hits.length > 0) {
      let obj = hits[0].object;
      while (obj.parent && obj.parent.userData.draggable) obj = obj.parent;
      if (obj.userData.draggable || obj.parent?.userData?.draggable) {
        const root = obj.userData.draggable ? obj : obj.parent;
        this.dragObject = root;
        this.isDragging = true;
        this.isSlicing = root.userData.sliceable || false;

        const target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.dragPlane, target);
        this.dragOffset.subVectors(root.position, target);

        root.userData.originalY = root.position.y;
        root.position.y += 0.5;

        if (this.game.hintSystem) {
          this.game.hintSystem.onObjectPicked(root);
        }
      }
    }
  }

  _moveInteraction(clientX, clientY) {
    if (!this.isDragging || !this.dragObject) return;
    const pos = this._getCanvasPos(clientX, clientY);
    this.pointer.set(pos.x, pos.y);
    this.raycaster.setFromCamera(this.pointer, this.game.sceneManager.camera);

    const target = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.dragPlane, target);
    this.dragObject.position.x = target.x + this.dragOffset.x;
    this.dragObject.position.z = target.z + this.dragOffset.z;
    this.dragObject.position.y = (this.dragObject.userData.originalY || 0.5) + 0.6;
  }

  _endInteraction() {
    if (this.dragObject) {
      const obj = this.dragObject;
      obj.position.y = obj.userData.originalY || 0.5;
      this.game.levelManager.checkDrop(obj);
    }
    this.isDragging = false;
    this.dragObject = null;
  }

  _onClick(clientX, clientY) {
    const pos = this._getCanvasPos(clientX, clientY);
    this.pointer.set(pos.x, pos.y);
    this.raycaster.setFromCamera(this.pointer, this.game.sceneManager.camera);
    const clickables = this.game.levelManager.getClickables();
    const hits = this.raycaster.intersectObjects(clickables, true);
    if (hits.length > 0) {
      let obj = hits[0].object;
      while (obj.parent && !obj.userData.clickable) obj = obj.parent;
      if (obj.userData.clickable || obj.parent?.userData?.clickable) {
        const root = obj.userData.clickable ? obj : obj.parent;
        this.game.levelManager.onObjectClick(root);
      }
    }
  }

  _checkSlice() {
    if (this.slicePoints.length < 3 || !this.dragObject) return;
    const pts = this.slicePoints;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 3];
    const dist = Math.sqrt(
      Math.pow(last.x - prev.x, 2) + Math.pow(last.y - prev.y, 2)
    );
    if (dist > 60 && this.dragObject.userData.sliceable) {
      this.game.levelManager.onSlice(this.dragObject);
      this.dragObject.userData.sliceable = false;
    }
  }

  update(delta) {}
}

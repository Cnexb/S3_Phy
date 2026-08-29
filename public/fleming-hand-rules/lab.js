/* Fleming Hand Rules — 3D lab (browser-only) */
(function () {
  const HAND_URL = './assets/hand_model.glb';
  const COLOR = {
    B: 0x2563eb,
    I: 0xdc2626,
    FV: 0x16a34a,
    wire: 0x475569,
    coil: 0xb45309,
  };

  const BONE_NAMES = [
    'radius_ulna',
    'thumb_trapez', 'thumb_meta', 'thumb_prox', 'thumb_dist',
    'index_meta', 'index_prox', 'index_midd', 'index_dist',
    'midd_meta', 'midd_prox', 'midd_midd', 'midd_dist',
    'ring_meta', 'ring_prox', 'ring_midd', 'ring_dist',
    'pinky_meta', 'pinky_prox', 'pinky_midd', 'pinky_dist',
  ];

  const dict = {
    zh: {
      docTitle: '弗林明左右手法則 — HKDSE',
      pageTitle: '弗林明左右手法則與右手握拳定則',
      pageSub: 'HKDSE 電磁學 — 左手定則（電動機）、右手定則（發電機）及右手握拳定則。',
      langBtn: 'English',
      orbitHint: '拖曳旋轉 · 滾輪縮放',
      loading: '正在載入 3D 手部模型…',
      secModes: '定則',
      secLegend: '圖例',
      secToggles: '方向',
      modeLeft: '左手定則\n（電動機）',
      modeRight: '右手定則\n（發電機）',
      modeGripWire: '右手握拳\n（直導線）',
      modeGripSolenoid: '右手握拳\n（螺線管）',
      ruleLeftTitle: '弗林明左手定則（電動機）',
      ruleLeftBody: '食指指向磁場 B，中指指向電流 I，拇指指向導體受力／運動方向 F。三者互相垂直。',
      ruleRightTitle: '弗林明右手定則（發電機）',
      ruleRightBody: '食指指向磁場 B，拇指指向導體運動方向 v，中指指向感應電流 I 的方向。',
      ruleGripWireTitle: '右手握拳定則 — 直導線',
      ruleGripWireBody: '拇指指向電流 I 方向，其餘四指彎曲的方向就是磁場 B 的環繞方向。',
      ruleGripSolenoidTitle: '右手握拳定則 — 螺線管',
      ruleGripSolenoidBody: '四指彎曲指向螺線管電流 I 的繞行方向，拇指指向磁場 B／N 極方向。',
      legB: 'B — 磁場',
      legI: 'I — 電流',
      legF: 'F — 力／運動（電動機）',
      legV: 'v — 運動（發電機）',
      legBN: 'B / N 極 — 磁場方向',
      mnemonicLeft: '口訣：食指 Field（磁場）、中指 Current（電流）、拇指 Motion／Force（運動／力）。',
      mnemonicRight: '口訣：食指 Field、拇指 Motion、中指 Induced current（感應電流）。',
      mnemonicGripWire: '口訣：拇指跟電流；彎曲手指跟磁場圈。',
      mnemonicGripSolenoid: '口訣：手指跟線圈電流；拇指指向 N 極／B。',
      lblRevB: '反轉磁場 B',
      lblRevI: '反轉電流 I',
      lblRevM: '反轉運動／力',
      lblRevV: '反轉運動 v',
      btnReset: '重設視角與方向',
      revOn: '已反轉',
      revOff: '正常',
      credit: '3D 手部模型 © 2026 Emma L. D. Lieker（CC BY-NC 4.0）',
      labForce: '力 F',
      labMotion: '運動 v',
      labField: '磁場 B',
      labCurrent: '電流 I',
    },
    en: {
      docTitle: 'Fleming Hand Rules — HKDSE',
      pageTitle: 'Fleming Hand Rules & Right-Hand Grip',
      pageSub: 'HKDSE electromagnetism — left-hand motor rule, right-hand generator rule, and right-hand grip rules.',
      langBtn: '中文',
      orbitHint: 'Drag to rotate · Scroll to zoom',
      loading: 'Loading 3D hand model…',
      secModes: 'Rule',
      secLegend: 'Legend',
      secToggles: 'Directions',
      modeLeft: 'Left-hand\n(motor)',
      modeRight: 'Right-hand\n(generator)',
      modeGripWire: 'Grip rule\n(straight wire)',
      modeGripSolenoid: 'Grip rule\n(solenoid)',
      ruleLeftTitle: 'Fleming’s left-hand rule (motor)',
      ruleLeftBody: 'First finger → magnetic field B, second finger → current I, thumb → force / motion F. The three directions are mutually perpendicular.',
      ruleRightTitle: 'Fleming’s right-hand rule (generator)',
      ruleRightBody: 'First finger → magnetic field B, thumb → motion v of the conductor, second finger → induced current I.',
      ruleGripWireTitle: 'Right-hand grip — straight wire',
      ruleGripWireBody: 'Thumb → current I; curled fingers show the circling direction of magnetic field B.',
      ruleGripSolenoidTitle: 'Right-hand grip — solenoid',
      ruleGripSolenoidBody: 'Curled fingers follow the current I around the coil; thumb → magnetic field B / N-pole.',
      legB: 'B — magnetic field',
      legI: 'I — current',
      legF: 'F — force / motion (motor)',
      legV: 'v — motion (generator)',
      legBN: 'B / N-pole — field direction',
      mnemonicLeft: 'Mnemonic: First finger Field, seCond Current, thuMb Motion / Force.',
      mnemonicRight: 'Mnemonic: First finger Field, thuMb Motion, seCond induced Current.',
      mnemonicGripWire: 'Mnemonic: thumb with current; curled fingers with B circles.',
      mnemonicGripSolenoid: 'Mnemonic: fingers with coil current; thumb to N-pole / B.',
      lblRevB: 'Reverse field B',
      lblRevI: 'Reverse current I',
      lblRevM: 'Reverse force / motion',
      lblRevV: 'Reverse motion v',
      btnReset: 'Reset view & directions',
      revOn: 'Reversed',
      revOff: 'Normal',
      credit: '3D Rigged Hand Model © 2026 Emma L. D. Lieker (CC BY-NC 4.0)',
      labForce: 'Force\nF',
      labMotion: 'Motion\nv',
      labField: 'Field\nB',
      labCurrent: 'Current\nI',
    },
  };

  function hubLangToLocal(lang) {
    if (lang === 'en') return 'en';
    return 'zh';
  }

  const params = new URLSearchParams(location.search);
  let currentLang = hubLangToLocal(params.get('lang') || 'zh');
  try {
    const saved = localStorage.getItem('s3phy.flemingHandRules.lang');
    if (!params.get('lang') && (saved === 'en' || saved === 'zh')) currentLang = saved;
  } catch (_) { /* ignore */ }

  const t = () => dict[currentLang] || dict.zh;

  let mode = 'left';
  let revB = false;
  let revI = false;
  let revM = false;

  let scene, camera, renderer, controls;
  let handPivot;
  let handModel;
  let helpersGroup;
  let bones = {};
  let restQuat = {};
  let modelReady = false;
  const _q = new THREE.Quaternion();
  const _e = new THREE.Euler();

  function sign(rev) { return rev ? -1 : 1; }

  function collectBones(root) {
    bones = {};
    restQuat = {};
    root.traverse((o) => {
      if (o.isBone || BONE_NAMES.includes(o.name)) bones[o.name] = o;
      if (o.isSkinnedMesh && o.skeleton) {
        o.skeleton.bones.forEach((b) => { if (b.name) bones[b.name] = b; });
      }
    });
    BONE_NAMES.forEach((name) => {
      if (bones[name]) restQuat[name] = bones[name].quaternion.clone();
    });
  }

  function resetBones() {
    BONE_NAMES.forEach((name) => {
      if (bones[name] && restQuat[name]) bones[name].quaternion.copy(restQuat[name]);
    });
  }

  function twist(name, axis, radians) {
    const b = bones[name];
    if (!b || !restQuat[name]) return;
    b.quaternion.copy(restQuat[name]);
    _e.set(axis === 'x' ? radians : 0, axis === 'y' ? radians : 0, axis === 'z' ? radians : 0);
    _q.setFromEuler(_e);
    b.quaternion.multiply(_q);
  }

  function twistAdd(name, x, y, z) {
    const b = bones[name];
    if (!b || !restQuat[name]) return;
    b.quaternion.copy(restQuat[name]);
    _q.setFromEuler(_e.set(x, y, z));
    b.quaternion.multiply(_q);
  }

  function curlFinger(prefix, amount) {
    twist(prefix + '_prox', 'x', amount * 1.05);
    twist(prefix + '_midd', 'x', amount * 1.25);
    twist(prefix + '_dist', 'x', amount * 0.95);
  }

  function straightenFinger(prefix) {
    twist(prefix + '_meta', 'x', 0);
    twist(prefix + '_prox', 'x', 0);
    twist(prefix + '_midd', 'x', 0);
    twist(prefix + '_dist', 'x', 0);
  }

  /** Textbook pose: thumb up, index out, middle out at 90°, ring/pinky curled. */
  function poseFlemingBones() {
    resetBones();
    straightenFinger('index');
    straightenFinger('midd');
    curlFinger('ring', 1.1);
    curlFinger('pinky', 1.2);
    twistAdd('ring_meta', 0.4, 0, 0.1);
    twistAdd('pinky_meta', 0.5, 0, 0.15);

    // Middle finger swings across palm to form the classic 90° with index
    twistAdd('midd_meta', 0.1, 0, -0.2);
    twistAdd('midd_prox', 0.2, 0, -1.2);
    twist('midd_midd', 'x', 0.05);
    twist('midd_dist', 'x', 0.05);

    // Thumb stands up (Force)
    twistAdd('thumb_trapez', -0.45, -0.5, -1.0);
    twistAdd('thumb_meta', -0.2, 0.1, -0.15);
    twist('thumb_prox', 'x', -0.08);
    twist('thumb_dist', 'x', 0.04);
  }

  function poseGripBones() {
    resetBones();
    curlFinger('index', 1.0);
    curlFinger('midd', 1.05);
    curlFinger('ring', 1.1);
    curlFinger('pinky', 1.15);
    twistAdd('index_meta', 0.3, 0, 0);
    twistAdd('midd_meta', 0.35, 0, 0);
    twistAdd('ring_meta', 0.4, 0, 0);
    twistAdd('pinky_meta', 0.45, 0, 0);
    twistAdd('thumb_trapez', -0.55, -0.2, -0.4);
    twist('thumb_meta', 'x', -0.3);
    twist('thumb_prox', 'x', -0.05);
  }

  function makeArrow(color, length) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.35, metalness: 0.12, emissive: color, emissiveIntensity: 0.25,
    });
    const shaftLen = length * 0.72;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, shaftLen, 12), mat);
    shaft.position.y = shaftLen / 2;
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.12, length * 0.28, 14), mat);
    head.position.y = shaftLen + length * 0.14;
    g.add(shaft);
    g.add(head);
    return g;
  }

  function makeLabelSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 128);
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    roundRect(ctx, 8, 16, 240, 96, 14);
    ctx.fill();
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 5;
    roundRect(ctx, 8, 16, 240, 96, 14);
    ctx.stroke();
    ctx.fillStyle = colorHex;
    ctx.font = '800 40px system-ui, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    String(text).split('\n').forEach((line, i, arr) => {
      ctx.fillText(line, 128, 64 + (i - (arr.length - 1) / 2) * 38);
    });
    const tex = new THREE.CanvasTexture(canvas);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    spr.scale.set(0.9, 0.45, 1);
    return spr;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function makeFieldRings(radius, count, color) {
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
    for (let i = 0; i < count; i++) {
      const r = radius * (0.55 + i * 0.35);
      const pts = [];
      for (let k = 0; k <= 64; k++) {
        const a = (k / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 8), new THREE.MeshBasicMaterial({ color }));
      tip.position.set(r, 0, 0);
      tip.rotation.z = -Math.PI / 2;
      g.add(tip);
    }
    return g;
  }

  function makeWire(length) {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, length, 12),
      new THREE.MeshStandardMaterial({ color: COLOR.wire, metalness: 0.55, roughness: 0.35 }),
    );
  }

  function makeSolenoid() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 2.0, 20),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.2, roughness: 0.5 }),
    ));
    const coilMat = new THREE.MeshStandardMaterial({ color: COLOR.coil, metalness: 0.55, roughness: 0.35 });
    for (let i = 0; i < 10; i++) {
      const tor = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 8, 24), coilMat);
      tor.rotation.y = Math.PI / 2;
      tor.position.y = -0.85 + i * 0.18;
      g.add(tor);
    }
    return g;
  }

  function disposeObject(obj) {
    obj.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (m.map) m.map.dispose();
          if (m.normalMap) m.normalMap.dispose();
          m.dispose();
        });
      }
    });
  }

  function clearGroup(g) {
    while (g.children.length) {
      const c = g.children[0];
      g.remove(c);
      disposeObject(c);
    }
  }

  function updateSkeleton() {
    if (!handModel) return;
    handModel.updateMatrixWorld(true);
    handModel.traverse((o) => {
      if (o.isSkinnedMesh && o.skeleton) {
        o.skeleton.update();
        o.frustumCulled = false;
      }
    });
  }

  function fitHandInView() {
    if (!handModel) return;
    // Bone lengths ~20–30 units; explicit scale (Box3 on skinned mesh is unreliable)
    handModel.scale.setScalar(0.1);
    handModel.position.set(0, -0.2, 0);
  }

  /**
   * Match the textbook plate:
   * Thumb ↑ Force, Index → Field, Middle toward camera Current.
   * Do NOT use negative scale (breaks skinned meshes).
   */
  function applyHandOrientation() {
    if (!handPivot) return;
    handPivot.scale.set(1, 1, 1);
    handPivot.rotation.set(0, 0, 0);

    if (mode === 'left' || mode === 'right') {
      // Rest model: fingers along +Y from wrist. Rotate into textbook view.
      handPivot.rotation.order = 'YXZ';
      if (mode === 'left') {
        // Left-hand teaching view (like the diagram)
        handPivot.rotation.set(-0.55, 1.15, 0.55);
      } else {
        handPivot.rotation.set(-0.55, -0.35, -0.35);
      }
      if (revM) handPivot.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI);
      if (revB) handPivot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI);
      if (revI) handPivot.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI);
    } else {
      handPivot.rotation.set(-0.35, revI ? Math.PI + 0.5 : 0.5, 0.1);
    }
    handPivot.position.set(0, 0.1, 0);
  }

  function boneWorldPos(name, alongY) {
    const b = bones[name];
    if (!b) return new THREE.Vector3();
    return b.localToWorld(new THREE.Vector3(0, alongY || 0, 0));
  }

  function aimArrow(arrow, from, to) {
    const dir = new THREE.Vector3().subVectors(to, from);
    if (dir.lengthSq() < 1e-8) return;
    arrow.position.copy(from);
    arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  }

  function rebuildHelpers() {
    clearGroup(helpersGroup);
    if (!modelReady) return;
    const sB = sign(revB);
    const sI = sign(revI);
    const sM = sign(revM);
    const tr = t();

    if (mode === 'left' || mode === 'right') {
      updateSkeleton();
      const thumbTip = boneWorldPos('thumb_dist', 3.4);
      const indexTip = boneWorldPos('index_dist', 3.0);
      const middTip = boneWorldPos('midd_dist', 3.4);
      const palm = boneWorldPos('radius_ulna', 7.0);

      const thumbDir = thumbTip.clone().sub(palm).normalize();
      const indexDir = indexTip.clone().sub(palm).normalize();
      const middDir = middTip.clone().sub(palm).normalize();

      function addFingerArrow(dir, tip, color, label, s) {
        const from = tip.clone().addScaledVector(dir, 0.08);
        const to = tip.clone().addScaledVector(dir, 1.2 * (s >= 0 ? 1 : -1));
        const arrow = makeArrow(color, 1.15);
        if (s >= 0) aimArrow(arrow, from, to);
        else aimArrow(arrow, to, from);
        helpersGroup.add(arrow);
        const lab = makeLabelSprite(label, '#' + color.toString(16).padStart(6, '0'));
        lab.position.copy(tip).addScaledVector(dir, 1.45 * (s >= 0 ? 1 : -1));
        helpersGroup.add(lab);
      }

      addFingerArrow(thumbDir, thumbTip, COLOR.FV, mode === 'left' ? tr.labForce : tr.labMotion, sM);
      addFingerArrow(indexDir, indexTip, COLOR.B, tr.labField, sB);
      addFingerArrow(middDir, middTip, COLOR.I, tr.labCurrent, sI);

      const cond = makeWire(2.6);
      cond.position.copy(middTip.clone().add(palm).multiplyScalar(0.5));
      cond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), middDir.clone());
      helpersGroup.add(cond);
    } else if (mode === 'gripWire') {
      helpersGroup.add(makeWire(3.0));
      const arrowI = makeArrow(COLOR.I, 1.6);
      if (sI < 0) arrowI.rotation.x = Math.PI;
      arrowI.position.set(0, -0.15, 0);
      helpersGroup.add(arrowI);
      const labI = makeLabelSprite('I', '#dc2626');
      labI.position.set(0.25, sI * 1.55, 0);
      helpersGroup.add(labI);
      const rings = makeFieldRings(0.85, 3, COLOR.B);
      if ((sI > 0 && sB < 0) || (sI < 0 && sB > 0)) rings.rotation.y = Math.PI;
      if (sI < 0) rings.rotation.y += Math.PI;
      helpersGroup.add(rings);
      const labB = makeLabelSprite('B', '#2563eb');
      labB.position.set(1.4, 0.25, 0);
      helpersGroup.add(labB);
    } else {
      const sol = makeSolenoid();
      sol.position.set(1.5, 0, 0);
      helpersGroup.add(sol);
      const arrowB = makeArrow(COLOR.B, 1.8);
      if (sB < 0) arrowB.rotation.x = Math.PI;
      arrowB.position.set(1.5, -0.95, 0);
      helpersGroup.add(arrowB);
      const labB = makeLabelSprite('B', '#2563eb');
      labB.position.set(1.75, sB * 1.35, 0);
      helpersGroup.add(labB);
      const loop = new THREE.Mesh(
        new THREE.TorusGeometry(0.65, 0.035, 8, 40),
        new THREE.MeshStandardMaterial({ color: COLOR.I, emissive: COLOR.I, emissiveIntensity: 0.2 }),
      );
      loop.rotation.x = Math.PI / 2;
      loop.position.set(1.5, 0.15, 0);
      helpersGroup.add(loop);
      const arrowI = makeArrow(COLOR.I, 0.65);
      arrowI.position.set(1.5 + 0.65, 0.15, 0);
      arrowI.rotation.z = sI > 0 ? -Math.PI / 2 : Math.PI / 2;
      helpersGroup.add(arrowI);
      const labI = makeLabelSprite('I', '#dc2626');
      labI.position.set(1.5 + 1.0, 0.4, 0);
      helpersGroup.add(labI);
      if (sI < 0) loop.scale.x = -1;
    }
  }

  function applyPoseAndHelpers() {
    if (!modelReady) return;
    if (mode === 'left' || mode === 'right') poseFlemingBones();
    else poseGripBones();
    applyHandOrientation();
    updateSkeleton();
    rebuildHelpers();
  }

  function frameCameraOnHand() {
    updateSkeleton();
    const box = new THREE.Box3().setFromObject(handPivot);
    if (!isFinite(box.min.x) || box.isEmpty()) {
      camera.position.set(2.2, 1.5, 3.0);
      controls.target.set(0, 0.45, 0);
      controls.update();
      return;
    }
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1.2);
    const dist = maxDim * 1.7;
    camera.position.set(center.x + dist * 0.45, center.y + dist * 0.28, center.z + dist * 0.9);
    controls.target.copy(center);
    controls.minDistance = maxDim * 0.55;
    controls.maxDistance = maxDim * 5;
    controls.update();
  }

  function loadHand() {
    const loader = new THREE.GLTFLoader();
    loader.load(
      HAND_URL,
      (gltf) => {
        handModel = gltf.scene;
        handModel.traverse((o) => {
          if (!o.isMesh) return;
          o.castShadow = true;
          o.receiveShadow = true;
          o.frustumCulled = false;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if (!m) return;
            m.side = THREE.DoubleSide;
            if (m.map) m.map.encoding = THREE.sRGBEncoding;
            m.needsUpdate = true;
          });
        });
        collectBones(handModel);
        fitHandInView();
        handPivot.add(handModel);
        modelReady = true;
        updateSkeleton();
        document.getElementById('loading').classList.add('hide');
        applyPoseAndHelpers();
        frameCameraOnHand();
      },
      (xhr) => {
        if (!xhr.total) return;
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        document.getElementById('loading-text').textContent = t().loading + ' ' + pct + '%';
      },
      (err) => {
        console.error(err);
        document.getElementById('loading-text').textContent =
          currentLang === 'zh' ? '手部模型載入失敗' : 'Failed to load hand model';
      },
    );
  }

  function initThree() {
    const host = document.getElementById('canvas-host');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const w = host.clientWidth || 640;
    const h = host.clientHeight || 480;
    camera = new THREE.PerspectiveCamera(36, w / h, 0.05, 100);
    camera.position.set(2.4, 1.6, 3.2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    host.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.45, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc7d2fe, 0.5);
    fill.position.set(-4, 2, -2);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd1d5db, 0.45));

    const grid = new THREE.GridHelper(8, 16, 0xcbd5e1, 0xe2e8f0);
    grid.position.y = -1.2;
    scene.add(grid);

    handPivot = new THREE.Group();
    scene.add(handPivot);
    helpersGroup = new THREE.Group();
    scene.add(helpersGroup);

    loadHand();
    (function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    })();
  }

  function resize() {
    const host = document.getElementById('canvas-host');
    if (!renderer || !camera || !host) return;
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w < 2 || h < 2) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function resetViewAndDirs() {
    revB = revI = revM = false;
    syncToggleButtons();
    applyPoseAndHelpers();
    frameCameraOnHand();
  }

  function syncToggleButtons() {
    const tr = t();
    [['btn-rev-b', revB], ['btn-rev-i', revI], ['btn-rev-m', revM]].forEach(([id, on]) => {
      const el = document.getElementById(id);
      el.classList.toggle('on', on);
      el.textContent = on ? tr.revOn : tr.revOff;
    });
  }

  function updateModeCopy() {
    const tr = t();
    document.getElementById('leg-b').textContent = tr.legB;
    document.getElementById('leg-i').textContent = tr.legI;
    const title = document.getElementById('rule-title');
    const body = document.getElementById('rule-body');
    const mnemonic = document.getElementById('mnemonic');
    const legFV = document.getElementById('leg-fv');
    const legFVRow = document.getElementById('leg-fv-row');
    const rowRevM = document.getElementById('row-rev-m');
    const lblRevM = document.getElementById('lbl-rev-m');

    if (mode === 'left') {
      title.textContent = tr.ruleLeftTitle;
      body.textContent = tr.ruleLeftBody;
      mnemonic.textContent = tr.mnemonicLeft;
      legFV.textContent = tr.legF;
      legFVRow.style.display = '';
      rowRevM.style.display = '';
      lblRevM.textContent = tr.lblRevM;
    } else if (mode === 'right') {
      title.textContent = tr.ruleRightTitle;
      body.textContent = tr.ruleRightBody;
      mnemonic.textContent = tr.mnemonicRight;
      legFV.textContent = tr.legV;
      legFVRow.style.display = '';
      rowRevM.style.display = '';
      lblRevM.textContent = tr.lblRevV;
    } else if (mode === 'gripWire') {
      title.textContent = tr.ruleGripWireTitle;
      body.textContent = tr.ruleGripWireBody;
      mnemonic.textContent = tr.mnemonicGripWire;
      legFVRow.style.display = 'none';
      rowRevM.style.display = 'none';
    } else {
      title.textContent = tr.ruleGripSolenoidTitle;
      body.textContent = tr.ruleGripSolenoidBody;
      mnemonic.textContent = tr.mnemonicGripSolenoid;
      document.getElementById('leg-b').textContent = tr.legBN;
      legFVRow.style.display = 'none';
      rowRevM.style.display = 'none';
    }
  }

  function updateLanguageUI() {
    const tr = t();
    document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
    document.title = tr.docTitle;
    document.getElementById('page-title').textContent = tr.pageTitle;
    document.getElementById('page-sub').textContent = tr.pageSub;
    document.getElementById('lang-toggle').textContent = tr.langBtn;
    document.getElementById('orbit-hint').textContent = tr.orbitHint;
    document.getElementById('sec-modes').textContent = tr.secModes;
    document.getElementById('sec-legend').textContent = tr.secLegend;
    document.getElementById('sec-toggles').textContent = tr.secToggles;
    document.getElementById('mode-left').textContent = tr.modeLeft;
    document.getElementById('mode-right').textContent = tr.modeRight;
    document.getElementById('mode-grip-wire').textContent = tr.modeGripWire;
    document.getElementById('mode-grip-solenoid').textContent = tr.modeGripSolenoid;
    document.getElementById('lbl-rev-b').textContent = tr.lblRevB;
    document.getElementById('lbl-rev-i').textContent = tr.lblRevI;
    document.getElementById('btn-reset').textContent = tr.btnReset;
    document.getElementById('model-credit').textContent = tr.credit;
    if (!document.getElementById('loading').classList.contains('hide')) {
      document.getElementById('loading-text').textContent = tr.loading;
    }
    syncToggleButtons();
    updateModeCopy();
    if (modelReady) rebuildHelpers();
  }

  function setMode(next) {
    mode = next;
    document.querySelectorAll('.fh-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    updateModeCopy();
    applyPoseAndHelpers();
    frameCameraOnHand();
  }

  document.querySelectorAll('.fh-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.getAttribute('data-mode')));
  });
  document.getElementById('btn-rev-b').addEventListener('click', () => {
    revB = !revB; syncToggleButtons(); applyPoseAndHelpers();
  });
  document.getElementById('btn-rev-i').addEventListener('click', () => {
    revI = !revI; syncToggleButtons(); applyPoseAndHelpers();
  });
  document.getElementById('btn-rev-m').addEventListener('click', () => {
    revM = !revM; syncToggleButtons(); applyPoseAndHelpers();
  });
  document.getElementById('btn-reset').addEventListener('click', resetViewAndDirs);
  document.getElementById('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('s3phy.flemingHandRules.lang', currentLang); } catch (_) { /* ignore */ }
    updateLanguageUI();
  });
  window.addEventListener('message', (ev) => {
    if (ev.data?.type !== 's3phy:lang') return;
    currentLang = hubLangToLocal(ev.data.lang);
    updateLanguageUI();
  });
  window.addEventListener('resize', resize);

  updateLanguageUI();
  initThree();
  resize();
})();

var w = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
var h = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;
var scene, camera, renderer, controls, light, selectObject;
function initScene() {
  scene = new THREE.Scene();
  const urls = [
    './pic/sky/images/back.png',
    './pic/sky/images/front.png',
    './pic/sky/images/top.png',
    './pic/sky/images/bottom.png',
    './pic/sky/images/left.png',
    './pic/sky/images/right.png'];
  var cubeLoader = new THREE.CubeTextureLoader();
  // scene.background = cubeLoader.load(urls);
  scene.background = new THREE.Color(0xda60cc);
}
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
  camera.position.set(89.71944579752005,125.47103407517945,349.899122525424);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}
function initRenderer() {
  if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
  const rendererElement = renderer.domElement;
  rendererElement.addEventListener('mouseenter', function () {
    rendererElement.classList.add('custom-cursor');
  });
  document.body.appendChild(renderer.domElement);

}
const cube = new THREE.Group();
const manager = new THREE.LoadingManager();
const GLTFLoader = new THREE.GLTFLoader(manager);
var animation_box;
function initContent() {
  const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
      uAlpha: { value: 0.95 }
    },
    vertexShader: `
          void main()
          {
              gl_Position = vec4(position, 1.0);
          }
      `,
    fragmentShader: `
          uniform float uAlpha;
          void main()
          {
              gl_FragColor = vec4(0.29, 0.26, 0.21, uAlpha);
          }
      `
  })

  //遮罩层
  const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
  const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
  scene.add(overlay);

  manager.onProgress = function (_item, loaded, total) {
    const progressRatio = loaded / total; // 进度统计
    // 加载完成
    if (progressRatio === 1) {
      overlayMaterial.uniforms.uAlpha.value = 0.8;
      // 渐变隐藏
      const hideOverlay = (i) => {
        overlayMaterial.uniforms.uAlpha.value = 0.8 - 0.025 * i;
        if (i < 33) {
          requestAnimationFrame(() => hideOverlay(i + 1));
        } else {
          // 遮罩隐藏
          requestAnimationFrame(() => {
            scene.remove(overlay);
          });
        }
      };
      hideOverlay(0);
    }
  };

  GLTFLoader.load('./models/n1.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/n2.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/n3.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/n4.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/n5.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/w1.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/w2.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/w3.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  GLTFLoader.load('./models/w4.glb', function (gltf) {
    cube.add(gltf.scene);
  });
  cube.castShadow = false;
  cube.position.y -= 60
  scene.add(cube);

}





function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  w = window.innerWidth;
  h = window.innerHeight;
}
function initControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.5;
  controls.enableZoom = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.2;
  controls.minDistance = 42;
  controls.maxDistance = 400;
  controls.enablePan = true;
  controls.maxPolarAngle = 0.5 * Math.PI;
}
function initLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff); // 设置光的颜色
  scene.add(ambientLight);
}
function init() {
  initScene();
  initCamera();
  initRenderer();
  initContent();
  initLight();
  initControls();
  addEventListener('resize', onWindowResize, false);
}

function animate() {
  if (selectObject != undefined && selectObject != null) {
    renderDiv(selectObject);
  }
  requestAnimationFrame(animate);
  renderer.shadowMap.enabled = false; // 关闭阴影映射
  renderer.render(scene, camera);
  controls.update();
}
init();
animate();
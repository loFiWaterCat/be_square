import * as THREE from 'three';
import { Box3 } from 'three';

const geometry = new THREE.BoxBufferGeometry(1, 1, 1); 
const material = new THREE.MeshStandardMaterial( {color: 0xffffff} )
const cube = new THREE.Mesh(geometry, material);

const edges = new THREE.EdgesGeometry( geometry );
const lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
const line = new THREE.LineSegments( edges, lineMaterial );


const keys = [];

document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
})

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
})

let finished = false;

// Cube movement
let xDiff = 0.13;
let velX = 0;
let yDiff = 0.13;
let velY = 0;
let zDiff = 0.13;
let velZ = 0;
let grav = -0.03;
/* let grav = 0; */
let rClock = 0;
let rCounterClock = 0;
let friction = 0.9;
let reverse = false;

function stop() {
  velX = 0;
  velY = 0;
  velZ = 0;
}

function moveCube(arr) {
  finished = false;
  velY += grav;

  if (camera.position.z < 0) {
    reverse = true;
  } else {
    reverse = false;
  }
  if (keys['d']) {
    // cube.position.x += xDiff;
    if (!reverse) {
      if (velX < xDiff) {
        velX += 0.03;
      }
    } else {
      if (velX > -xDiff) {
        velX -= 0.03;
      }
    }
  }
  if (keys['a']) {
    // cube.position.x -= xDiff;
    if (!reverse) {
      if (velX > -xDiff) {
        velX -= 0.03;
      }
    } else {
      if (velX < xDiff) {
        velX += 0.03;
      }
    }
  }
  if (keys['s']) {
    // cube.position.y += yDiff;
    if (!reverse) {
      if (velZ < zDiff) {
        velZ += 0.03;
      }
    } else {
      if (velZ > -zDiff) {
        velZ -= 0.03;
      }
    }
  }
  if (keys['w']) {
    // cube.position.y -= yDiff;
    if (!reverse) {
      if (velZ > -zDiff) {
        velZ -= 0.03;
      }
    } else {
      if (velZ < zDiff) {
        velZ += 0.03;
      }
    }
  }

  if (keys[' ']) {
    velY = 0.6;
    if (velZ > 0) {
      rCounterClock += 55;
    }
    if (velZ < 0) {
      rClock += 55;
    }
  }
  if (keys['r']) {
    cube.position.set(-15, -3, 0);
    line.position.set(-15, -3, 0);
    velX = 0;
    velY = 0;
  }

  const checkCollision = (cubeBB, elBB) => {
    if (cubeBB.intersectsBox(elBB)) {
      return true;
    } else {
      return false;
    }
  }

  // Returns an array of the Vector3's values
  const toArray = (cubeBB, elBB) => {
    let arr = [0, 0, 0]
    /* debugger */
    for (let i = 0; i < 3; i++) {
      let cubeMin = cubeBB.min.getComponent(i)
      let cubeMax = cubeBB.max.getComponent(i)
      let elMin = elBB.min.getComponent(i)
      let elMax = elBB.max.getComponent(i)

      if (cubeMin < elMax && cubeMax > elMax) {
        // If left (-x) side of the cube is touching
        arr[i] = -1;
      } else if (cubeMin < elMin && cubeMax > elMax) {
        arr[i] = 1;
      }
    }
    return arr
  }

  const checkDir = (dirs) => {
    let velDirs = [velX, velY, velZ];
    console.log(dirs)
    dirs.forEach((val, i) => {
      if (val > 0 && velDirs[i] > 0) {
        velDirs[i] = 0;
      } else if (val < 0 && velDirs[i] < 0) {
        velDirs[i] = 0;
      }
    })

    velX = velDirs[0];
    velY = velDirs[1];
    velZ = velDirs[2];

  }

  // Collision detection
  let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  cubeBB.setFromObject(cube);
  const cubeWidth = cube.geometry.parameters['width'];
  const cubeHeight = cube.geometry.parameters['height'];
  // const dispMulti = 0.23;
  arr.forEach(elBB => {
    // Cube's bounding box position is updated
    cubeBB.copy( cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);

    // The element's are already bounding boxes
    let isColliding = checkCollision(cubeBB, elBB);

    // If they are colliding
    if (isColliding) {
      // Build the dirs to stop array
      let dirs = toArray(cubeBB, elBB)

      // Iterate through dir and stop if that direction is non-zero
      checkDir(dirs);
    }


    // Cube rotation
    if (rClock) {
      cube.rotation.z -= 0.03;
      line.rotation.z -= 0.03;
      rClock--;
    }
    if (rCounterClock) {
      cube.rotation.z += 0.03;
      line.rotation.z += 0.03;
      rCounterClock--;
    }
    if (!rClock && !rCounterClock) {
      cube.rotation.z = 0;
      line.rotation.z = 0;
      rClock = 0;
      rCounterClock = 0;
    }

  })

  if (Math.abs(velY) < 0.03) {
    velY = 0;
  }
  if (Math.abs(velX) < 0.03) {
    velX = 0;
  }
  if (Math.abs(velZ) < 0.03) {
    velZ = 0;
  }
  velX *= friction;
  velY *= friction;
  velZ *= friction;
  
  cube.position.z += velZ;
  cube.position.x += velX;
  cube.position.y += velY;
  line.position.x = cube.position.x;
  line.position.y = cube.position.y;
  updateCubeBBox();
}

/* let zDiff = 0.3;
let velZ = 0;
function moveCubeAlt(arr) {
  finished = false;
  velY += grav;
  
  if (camera.position.z < 0) {
    reverse = true;
  } else {
    reverse = false;
  }
  
  if (keys['s']) {
    // cube.position.y += yDiff;
    if (!reverse) {
      if (velZ < zDiff) {
        velZ += 0.03;
      }
    } else {
      if (velZ > -zDiff) {
        velZ -= 0.03;
      }
    }
  }
  if (keys['w']) {
    // cube.position.y -= yDiff;
    if (!reverse) {
      console.log(reverse);
      if (velZ > -zDiff) {
        velZ -= 0.03;
      }
    } else {
      if (velZ < zDiff) {
        velZ += 0.03;
      }
    }
  }
  
  // finished = false;
  // Collision detection
  const cubeWidth = cube.geometry.parameters['width'];
  const cubeHeight = cube.geometry.parameters['height'];
  // const dispMulti = 0.23;
  arr.forEach(el => {
      cube.rotation.z = 0;
      line.rotation.z = 0;
      rClock = 0;
      rCounterClock = 0;


    // Collision on x axis
    let cubeCenter = new THREE.Vector3();
    cubeBBox.getCenter(cubeCenter);
    let elCenter = new THREE.Vector3();
    el.getCenter(elCenter);
    
    // Still problem where half of the box can clip through edges, and
    // tunneling can also occur
    if (cubeBBox.intersectsBox(el)) {
      if (el === finishBBox) {
        finished = true;
      }
      let interPoint1 = cubeCenter.clone();
      let interPoint2 = cubeCenter.clone();
      let interPoint3 = cubeCenter.clone();
      let interPoint4 = cubeCenter.clone();
      interPoint1.y = cubeBBox.max.y;
      interPoint2.y = cubeBBox.min.y;
      interPoint3.y = cubeBBox.min.y;
      interPoint4.y = cubeBBox.max.y;
      if (cubeCenter.y > elCenter.y) {
        interPoint2.y = el.max.y;
        interPoint3.y = el.max.y;
      } else {
        interPoint1.y = el.min.y;
        interPoint4.y = el.min.y;
      }

      if (cubeCenter.z > elCenter.z) {
        interPoint1.z = el.min.z;
        interPoint2.z = el.min.z;
      } else {
        interPoint3.z = el.max.z;
        interPoint4.z = el.max.z;
      }
      if (cubeCenter.z < elCenter.z ) {
        if (velZ > 0
        && !(el.containsPoint(interPoint1) || el.containsPoint(interPoint2))
        && el.containsPoint(interPoint4)) {
          velZ = 0;
        }      
      } else if (cubeCenter.z > elCenter.z ) {
      if (velZ < 0
        && !(el.containsPoint(interPoint3) || el.containsPoint(interPoint4))
        && el.containsPoint(interPoint1)) {
          velZ = 0;
        }
      }
      if (cubeCenter.y > elCenter.y
      && !(el.containsPoint(interPoint1) || el.containsPoint(interPoint4))
      && (el.containsPoint(interPoint2) && el.containsPoint(interPoint3))) {
        if (velY < 0) {
          velY = 0;
        } 
      } else if (cubeCenter.y < elCenter.y
      && !(el.containsPoint(interPoint2) || el.containsPoint(interPoint3))) {
        if (velY > 0) {
          velY = 0;
        }
      }
      // Jump if we are touching the ground
      if (keys[' '] && (el.containsPoint(interPoint2) && el.containsPoint(interPoint3))) {
        velY = 0.6;
        if (velZ > 0) {
          rCounterClock += 55;
        }
        if (velZ < 0) {
          rClock += 55;
        }
      }


      if (el.containsPoint(interPoint1) && el.containsPoint(interPoint2)) {
        cube.position.z += (cubeWidth / 2) - Math.abs(cubeCenter.z - el.max.z) - 0.01;
      }
      if (el.containsPoint(interPoint3) && el.containsPoint(interPoint4)) {
        cube.position.z -= (cubeWidth / 2) - Math.abs(cubeCenter.z - el.min.z) - 0.01;
      }
      if (el.containsPoint(interPoint2) && el.containsPoint(interPoint3)) {
        cube.position.y += (cubeHeight / 2) - (cubeCenter.y - el.max.y) - 0.01;
      }
      if (el.containsPoint(interPoint1) && el.containsPoint(interPoint4)) {
        cube.position.y -= (cubeHeight / 2) - (cubeCenter.y - el.min.y) - 0.01;
      }
    }

    if (cube.position.z > 1) {
      cube.position.z = 1;
      velZ = 0;
    }

    if (cube.position.z < -1) {
      cube.position.z = -1;
      velZ = 0;
    }

    if (rClock) {
      cube.rotation.x -= 0.03;
      line.rotation.x -= 0.03;
      rClock--;
    }
    if (rCounterClock) {
      cube.rotation.x += 0.03;
      line.rotation.x += 0.03;
      rCounterClock--;
    }
    if (!rClock && !rCounterClock) {
      cube.rotation.x = 0;
      line.rotation.x = 0;
      rClock = 0;
      rCounterClock = 0;
    }

  })

  if (Math.abs(velY) < 0.03) {
    velY = 0;
  }
  if (Math.abs(velZ) < 0.03) {
    velZ = 0;
  }


  velZ *= friction;
  velY *= friction;
  cube.position.z += velZ;
  cube.position.y += velY;
  line.position.z = cube.position.z;
  line.position.y = cube.position.y;
  updateCubeBBox();
} */

// Bounding box stuff
cube.geometry.computeBoundingBox();
const cubeBBox = new Box3();
// cubeBBox.setFromObject(cube);
function updateCubeBBox() {
  cubeBBox.setFromObject(cube);
}


/* export { cube, line, keys, moveCube, cubeBBox, updateCubeBBox, moveCubeAlt, finished, stop }; */
export { cube, line, keys, moveCube, cubeBBox, updateCubeBBox, finished, stop };

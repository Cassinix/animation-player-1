let currentTool = null;

const framesContainer = document.querySelector('.frames-container');
const canvasContainer = document.querySelector('.canvas-container');
const animationContainer = document.querySelector('.animation-container');

const framesWrap = document.createElement('div');
const addBtn = document.createElement('button');

const minusFps = document.querySelector('.subtract-speed-btn');
const plusFps = document.querySelector('.add-speed-btn');
const currentFps = document.querySelector('.current-fps');

const minusFat = document.querySelector('.subtract-fat-btn');
const plusFat = document.querySelector('.add-fat-btn');
const currentFat = document.querySelector('.current-fat');

const color = document.querySelector('#color');

let currentColor;

color.addEventListener('input', () => {
    currentColor = color.value;
});

let fpsCount = 1;

let endX;
let endY;
let fatSize = 5;

let mouseDown = false;

addBtn.innerHTML = 'Add new frame';

framesContainer.appendChild(framesWrap);
framesContainer.appendChild(addBtn);

addBtn.setAttribute('class', 'add-button');

const framesStorage = [];

let timerId;

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');
    canvas.setAttribute('width', '725');
    canvas.setAttribute('height', '725');

    const ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', (e) => {
        mouseDown = true;
        
        ctx.fillStyle = currentColor;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseDown = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;

        endX = e.offsetX;
        endY = e.offsetY;

        ctx.fillRect(endX, endY, fatSize, fatSize);
    });

    canvas.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    return canvas;
}

function createFrame() {
    const frame = document.createElement('div');

    const frameNum = document.createElement('div');
    const delBtn = document.createElement('button');
    const dublBtn = document.createElement('button');

    frame.setAttribute('class', 'frame-wrap');

    frameNum.setAttribute('class', 'frame-btn frame-num');
    delBtn.setAttribute('class', 'frame-btn del-button');
    dublBtn.setAttribute('class', 'frame-btn dubl-button');

    frameNum.innerHTML = framesStorage.length + 1;
    delBtn.innerHTML = 'Del';
    dublBtn.innerHTML = 'Copy';

    delBtn.addEventListener('click', delFrame);
    dublBtn.addEventListener('click', copyFrame);

    frame.appendChild(frameNum);
    frame.appendChild(delBtn);
    frame.appendChild(dublBtn);

    return frame;
}

addBtn.addEventListener('click', addFrame);

function addFrame() {
    const frame = createFrame();
    const canvas = createCanvas();

    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(canvas);

    canvas.addEventListener('mouseup', (e) => {
        const currentCanvasId = parseInt(e.target.getAttribute('id'));
        const currentFrame = document.getElementById(`${currentCanvasId}-frame`);

        const canvasImg = canvas.toDataURL();

        currentFrame.style.backgroundImage = `url(${canvasImg})`;
        framesStorage[currentCanvasId - 1].frame = currentFrame;
        framesStorage[currentCanvasId - 1].canvasImg = canvasImg;

        framesWrap.innerHTML = '';

        framesStorage.forEach((e) => {
            framesWrap.appendChild(e.frame);
        });
    });

    framesStorage.push({ frame: frame, canvas: canvas });

    const frStorLeng = framesStorage.length;

    framesStorage[frStorLeng - 1].frame.setAttribute('id', `${frStorLeng}-frame`);
    framesStorage[frStorLeng - 1].canvas.setAttribute('id', `${frStorLeng}-canvas`);

    framesStorage.forEach((e) => {
        framesWrap.appendChild(e.frame);
    });

    clearInterval(timerId);
    startAnimation();
}

function delFrame(e) {
    const frameNum = parseInt(e.target.parentNode.getAttribute('id'));

    framesStorage.splice(frameNum - 1, 1);

    framesWrap.innerHTML = '';

    canvasContainer.innerHTML = '';

    if (framesStorage.length > 0) {
        canvasContainer.appendChild(framesStorage[framesStorage.length - 1].canvas);
    }
    
    framesStorage.forEach((e, i) => {
        e.frame.querySelector('.frame-num').innerHTML = i + 1;
        e.frame.setAttribute('id', `${i + 1}-frame`);
        e.canvas.setAttribute('id', `${i + 1}-canvas`);
        framesWrap.appendChild(e.frame);
    });
}

function copyFrame(e) {
    const frameNum = parseInt(e.target.parentNode.getAttribute('id'));

    const copyElem = framesStorage.slice(frameNum - 1, frameNum);

    const cloneFrame = copyElem[0].frame.cloneNode(true);
    const cloneCanvas = copyElem[0].canvas.cloneNode(true);
    const cloneImage = copyElem[0].canvasImg;

    cloneFrame.querySelector('.del-button').addEventListener('click', delFrame);
    cloneFrame.querySelector('.dubl-button').addEventListener('click', copyFrame);

    const ctx = cloneCanvas.getContext('2d');
    ctx.drawImage(copyElem[0].canvas, 0, 0);

    cloneCanvas.addEventListener('mousedown', (e) => {
        mouseDown = true;
        
        ctx.fillStyle = currentColor;
    });

    cloneCanvas.addEventListener('mouseleave', () => {
        mouseDown = false;
    });

    cloneCanvas.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;

        endX = e.offsetX;
        endY = e.offsetY;

        ctx.fillRect(endX, endY, fatSize, fatSize);
    });

    cloneCanvas.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    cloneCanvas.addEventListener('mouseup', (e) => {
        const currentCanvasId = parseInt(e.target.getAttribute('id'));
        const currentFrame = document.getElementById(`${currentCanvasId}-frame`);

        const canvasImg = cloneCanvas.toDataURL();

        currentFrame.style.backgroundImage = `url(${canvasImg})`;
        framesStorage[currentCanvasId - 1].frame = currentFrame;
        framesStorage[currentCanvasId - 1].canvasImg = canvasImg;

        framesWrap.innerHTML = '';

        framesStorage.forEach((e) => {
            framesWrap.appendChild(e.frame);
        });
    });

    framesStorage.splice(frameNum, 0, { 
        frame: cloneFrame, 
        canvas: cloneCanvas,
        canvasImg: cloneImage,
    });

    framesStorage.forEach((e, i) => {
        e.frame.querySelector('.frame-num').innerHTML = i + 1;
        e.frame.setAttribute('id', `${i + 1}-frame`);
        e.canvas.setAttribute('id', `${i + 1}-canvas`);
        framesWrap.appendChild(e.frame);
    });

    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(cloneCanvas);
}

minusFps.addEventListener('click', () => {
    const minFps = 1;
    if (fpsCount > minFps) {
        fpsCount--;
        currentFps.querySelector('span').innerHTML = fpsCount;
        clearInterval(timerId);
        startAnimation();
    } else {
        return;
    }
});

plusFps.addEventListener('click', () => {
    const maxFps = 24;

    if (fpsCount < maxFps) {
        fpsCount++;
        currentFps.querySelector('span').innerHTML = fpsCount;
        clearInterval(timerId);
        startAnimation();
    } else {
        return;
    }
});

function startAnimation() {
    let itemsCount = 0;

    timerId = setInterval(() => {
        if (itemsCount < framesStorage.length) {
            animationContainer.style.backgroundImage = `url(${framesStorage[itemsCount].canvasImg})`;
            itemsCount++;
        } else {
            itemsCount = 0;
        }
    }, 1000 / fpsCount);
}


minusFat.addEventListener('click', () => {
  const minFat = 1;

  if (fatSize > minFat) {
      fatSize--;
      currentFat.querySelector('span').innerHTML = fatSize;
  } else {
      return;
  }
});

plusFat.addEventListener('click', () => {
  const maxFat = 24;

  if (fatSize < maxFat) {
      fatSize++;
      currentFat.querySelector('span').innerHTML = fatSize;
  } else {
      return;
  }
});

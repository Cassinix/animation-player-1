let currentTool = null;

const framesContainer = document.querySelector('.frames-container');
const canvasContainer = document.querySelector('.canvas-container');
const animationContainer = document.querySelector('.animation-container');

const framesWrap = document.createElement('div');
const addBtn = document.createElement('button');

const minusFps = document.querySelector('.subtract-speed-btn');
const plusFps = document.querySelector('.add-speed-btn');
const currentFps = document.querySelector('.current-fps');

addBtn.innerHTML = 'Add new frame';

framesContainer.appendChild(framesWrap);
framesContainer.appendChild(addBtn);

addBtn.setAttribute('class', 'add-button');

const framesStorage = [];

let timerId;
let fpsCount = 1;

function createFrame() {
    const frame = document.createElement('div');

    const frameNum = document.createElement('div');
    const delBtn = document.createElement('button');
    const dublBtn = document.createElement('button');

    const canvas = document.createElement('canvas');

    canvas.setAttribute('width', '725');
    canvas.setAttribute('height', '725');
    const context = canvas.getContext('2d');

    const cordsCount = +`${framesStorage.length}0`;

    context.beginPath();
    context.moveTo(30 + cordsCount, 30 + cordsCount);
    context.lineTo(cordsCount + 50, cordsCount + 50);
    context.stroke();

    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(canvas);

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

    const canvasImage = canvas.toDataURL();

    frame.style.backgroundImage = `url(${canvasImage})`;

    framesStorage.push({frame: frame, canvasImg: canvasImage});

    framesStorage.forEach((e) => {
        framesWrap.appendChild(e.frame);
    });

    clearInterval(timerId);
    startAnimation();
}

addBtn.addEventListener('click', addFrame);

function addFrame() {
    createFrame();
}

function delFrame(e) {
    const frameNum = +(e.target.parentNode.querySelector('.frame-num').innerHTML);

    framesStorage.splice(frameNum - 1, 1);

    framesWrap.innerHTML = '';

    canvasContainer.style.backgroundImage = `url(${framesStorage[framesStorage.length - 1].canvasImg})`;

    framesStorage.forEach((e, i) => {
        e.frame.querySelector('.frame-num').innerHTML = i + 1;
        framesWrap.appendChild(e.frame);
    });
}

function copyFrame(e) {
    const frameNum = +(e.target.parentNode.querySelector('.frame-num').innerHTML);

    const copyElem = framesStorage.slice(frameNum - 1, frameNum);
    framesStorage.splice(frameNum, 0, ...copyElem);

    framesWrap.innerHTML = '';
    
    framesStorage.forEach((elem, i) => {
        elem.frame.querySelector('.frame-num').innerHTML = i + 1;
        framesWrap.appendChild(elem.frame);
    });
}

minusFps.addEventListener('click', () => {
    if (fpsCount > 0) {
        fpsCount--;
        controllFps();
        clearInterval(timerId);
        startAnimation();
    } else {
        return;
    }
});

plusFps.addEventListener('click', () => {
    if (fpsCount < 24) {
        fpsCount++;
        controllFps();
        clearInterval(timerId);
        startAnimation();
    } else {
        return;
    }
});

function controllFps() {
    currentFps.querySelector('span').innerHTML = fpsCount;
}

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

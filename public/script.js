const socket = io();
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');

// Drawing settings
ctx.lineWidth = 2;
ctx.lineCap = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';

// Mouse event handlers
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    const drawData = {
        x0: lastX,
        y0: lastY,
        x1: e.offsetX,
        y1: e.offsetY,
        color: currentColor
    };

    drawLine(drawData);
    socket.emit('draw', drawData);

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

// Drawing function
function drawLine(data) {
    ctx.strokeStyle = data.color;
    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke();
}

// Clear canvas function
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas');
}

// Color picker handler
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Clear button handler
clearButton.addEventListener('click', clearCanvas);

// Socket event handlers
socket.on('draw', drawLine);

socket.on('drawingHistory', (history) => {
    history.forEach(drawLine);
});

socket.on('clearCanvas', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Canvas event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

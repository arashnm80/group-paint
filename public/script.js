const socket = io();
const textarea = document.getElementById('sharedBox');
let selfChange = false;

textarea.addEventListener('input', () => {
    selfChange = true;
    socket.emit('textUpdate', textarea.value);
});

socket.on('init', (text) => {
    textarea.value = text;
});

socket.on('textUpdate', (text) => {
    if (!selfChange) {
        textarea.value = text;
    }
    selfChange = false;
});

const socket = io();

const overlay = document.getElementById('username-overlay');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesArea = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');

let username = '';
let typing = false;
let timeout = undefined;

// Handle Join
joinBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('join', username);
        overlay.style.display = 'none';
        messageInput.focus();
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinBtn.click();
});

// Handle Sending Messages
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (msg) {
        socket.emit('chat message', msg);
        messageInput.value = '';
        socket.emit('stop typing');
        typing = false;
    }
});

// Typing Indicator Logic (Variant 4)
function timeoutFunction() {
    typing = false;
    socket.emit('stop typing');
}

messageInput.addEventListener('input', () => {
    if (!typing) {
        typing = true;
        socket.emit('typing');
    } else {
        clearTimeout(timeout);
    }
    timeout = setTimeout(timeoutFunction, 2000);
});

// Socket Events
socket.on('chat message', (data) => {
    addMessage(data.username, data.text, data.username === username);
});

socket.on('user joined', (name) => {
    addSystemMessage(`${name} присоединился к чату`);
});

socket.on('user left', (name) => {
    addSystemMessage(`${name} покинул чат`);
});

socket.on('typing', (name) => {
    typingIndicator.textContent = `${name} печатает...`;
    typingIndicator.classList.add('visible');
});

socket.on('stop typing', () => {
    typingIndicator.textContent = '';
    typingIndicator.classList.remove('visible');
});

// UI Helpers
function addMessage(user, text, isSelf) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (isSelf) msgDiv.classList.add('self');

    msgDiv.innerHTML = `
        <div class="message-info">${user}</div>
        <div class="message-text">${text}</div>
    `;
    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function addSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('system-message');
    msgDiv.textContent = text;
    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

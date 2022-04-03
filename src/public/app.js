const socket = io("/socket.io", {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Connected to websocket");
});

socket.on("error", (error) => {
  console.error(error);
});

socket.on("chat_message", function (payload) {
  console.log("received", payload);
  const chats = document.getElementById("chats");
  const chat = document.createElement("div");
  chat.classList.add("mb-4");
  chat.innerHTML = `
    <div class="d-flex align-items-center mb-2">
    <div class="flex-grow-1 fw-bold">${payload.user}</div>
    <div class="small">${moment(payload.date).fromNow()}</div>
    </div>
    <div class="border p-3 rounded-2">
    ${payload.message}
    </div>
  `;

  chats.appendChild(chat);
  chats.scrollTo(0, chats.scrollHeight);

  const count = parseInt(document.getElementById('message-count').innerText) || 0
  document.getElementById('message-count').innerText = count + 1
});

function loadMessages() {
  fetch("/api/messages")
    .then(async (response) => {
      const messages = await response.json();

      document.getElementById('message-count').innerText = messages.length

      messages.forEach((payload) => {
        const chats = document.getElementById("chats");
        const chat = document.createElement("div");
        chat.classList.add("mb-4");
        chat.innerHTML = `
          <div class="d-flex align-items-center mb-2">
          <div class="flex-grow-1 fw-bold">${payload.user}</div>
          <div class="small">${moment(payload.date).fromNow()}</div>
          </div>
          <div class="border p-3 rounded-2">
          ${payload.message}
          </div>
        `;
        chats.appendChild(chat);
      });
    })
    .then((data) => console.log(data));
}

function sendChat(event) {
  event.preventDefault();

  const input = document.getElementById("chat-message");
  const button = document.getElementById("chat-button");
  const user = document.getElementById("chat-name");
  const message = input.value;

  if (!message) {
    alert("message is empty!");
    return;
  }
  console.log("sending chat...");

  input.setAttribute("disabled", true);
  button.setAttribute("disabled", true);
  user.setAttribute("disabled", true);
  // sends to socket io
  console.log(message);

  socket.emit("chat_message", {
    message,
    user: user.value,
  });

  input.removeAttribute("disabled");
  button.removeAttribute("disabled");
  user.removeAttribute("disabled");

  input.value = "";
}

const form = document.getElementById("chat-form");

form.addEventListener("submit", sendChat);

loadMessages();

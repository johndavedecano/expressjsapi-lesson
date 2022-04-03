const express = require("express");

const morgan = require("morgan");

const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(helmet());

app.use('/scripts', express.static(__dirname + '/../node_modules/socket.io-client/dist'));
app.use('/assets', express.static(__dirname + '/public'));

app.get('/chats', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get("/health", (req, res) => res.send("ok"));
app.use("/api", require("./handlers"));

app.use((req, res, next) => {
  res.status(404).json({ message: "resource not found" });
});

module.exports = app;

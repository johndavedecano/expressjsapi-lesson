const http = require("http");
const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";
const moment = require("moment");
console.log("connecting to mongoDB");

mongoose
  .connect(mongoUri)
  .then(() => {
    const port = process.env.PORT || 3000;
    const app = require("./src");
    const server = http.createServer(app);

    console.log("successfully connected to mongoDB at " + mongoUri);

    const { Server } = require("socket.io");

    const io = new Server(server);

    io.of("socket.io").on("connection", (socket) => {
      console.log(socket.id);

      socket.on("chat_message", (payload) => {
        console.log(payload)
        io.of("socket.io").emit('chat_message', {
          ...payload,
          date: moment().format('LLL'),
        });
      });
    });

    server.listen(port, () =>
      console.log(`server is listening to port ${port}`)
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

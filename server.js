const http = require("http");
const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";
const moment = require("moment");
const MessageModel = require('./src/models/message.model')
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

      socket.on("chat_message", async (payload) => {

        const message = {
          ...payload,
          date: moment().format('LLL'),
        }

        io.of("socket.io").emit('chat_message', message);

        await MessageModel.create(message)
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

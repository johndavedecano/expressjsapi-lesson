const MessageModel = require("./../models/message.model");

const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({}).limit(100);
    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  get: getMessages,
};

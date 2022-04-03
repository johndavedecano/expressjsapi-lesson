const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const auth = require("./auth.handler");
const message = require('./message.handler')
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "hello from api" }));

// Authentication
router.post("/register", auth.register);
router.post("/signin", auth.signin);
router.get("/profile", authMiddleware, auth.profile);

router.get('/messages', message.get)

module.exports = router;

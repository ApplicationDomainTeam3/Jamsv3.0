const express = require("express");
const router = express.Router();

const { sendEmail } = require("./controllers.js");

router.post("/sendEmail", sendEmail);

module.exports = router;
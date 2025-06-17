const express = require("express");
const userrouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

router.use("/user", userrouter);
router.use("/account", accountRouter);

module.exports = router;
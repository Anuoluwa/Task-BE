const { Router } = require("express");
const { depostClientBalance } = require("./balance.controller");
const { getProfile } = require("../middleware/getProfile");

const router = Router();

router.get("/deposit/:userId", getProfile, depostClientBalance);

module.exports = router;

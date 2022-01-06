const { Router } = require("express");
const { getContracts, getContractById } = require("./contract.controller");
const { getProfile } = require("../middleware/getProfile");

const router = Router();

router.get("/", getProfile, getContracts);
router.get("/:id", getProfile, getContractById);

module.exports = router;

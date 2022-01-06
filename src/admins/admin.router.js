const { Router } = require("express");
const {
  getAllBestClients,
  getAllBestProfessions,
} = require("./admin.controller");
const { getProfile } = require("../middleware/getProfile");

const router = Router();

router.get("/best-profession", getProfile, getAllBestProfessions);
router.get("/best-clients", getProfile, getAllBestClients);

module.exports = router;

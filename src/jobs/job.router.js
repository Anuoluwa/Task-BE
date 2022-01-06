const { Router } = require("express");
const {
  getUnpaidJobsWithActiveContracts,
  payForAjob,
} = require("./job.controller");
const { getProfile } = require("../middleware/getProfile");

const router = Router();

router.get("/unpaid", getProfile, getUnpaidJobsWithActiveContracts);
router.post("/:job_id/pay", getProfile, payForAjob);

module.exports = router;

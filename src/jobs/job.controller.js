const { Op } = require("sequelize");
const { sequelize } = require("../model");
const { getUnpaidJobsService, payForAJobService } = require("./job.service");

exports.getUnpaidJobsWithActiveContracts = async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const userProfileId = req.profile.id;
  const jobs = await getUnpaidJobsService(Contract, Job, userProfileId);
  res.status(200).json({ status: "success", data: jobs });
};

exports.payForAjob = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { job_id } = req.params;
  try {
    const result = await sequelize.transaction(async (t) => {
      const job = await Job.findOne({
        include: [
          {
            model: Contract,
            where: {
              ClientId: req.profile.id,
            },
          },
        ],
        where: {
          id: job_id,
          paid: null,
        },
      });

      if (!job) {
        res
          .status(404)
          .json({
            status: "fail",
            data: "Job does not exist or payment has been made",
          });
      }
      if (job.price > req.profile.balance) {
        res.status(400).json({ status: "fail", data: "Insufficient balance" });
      }
      const contractor = await Profile.findOne({
        include: {
          model: Contract,
          as: "Contractor",
          where: { id: job.ContractId },
        },
        transaction: t,
      });

      await Profile.decrement("balance", {
        by: job.price,
        where: { id: req.profile.id },
        transaction: t,
      });

      await Job.update(
        {
          paid: true,
          paymentDate: new Date().toISOString(),
        },
        { where: { id: job_id }, transaction: t }
      );

      await Profile.increment("balance", {
        by: job.price,
        where: { id: contractor.id },
        transaction: t,
      });
    });
    res.status(200).json({ status: "success", data: "Payment successfully" });
  } catch (error) {
    console.log("err", error);
    return res.status(500).end();
  }
};

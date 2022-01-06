const { Op } = require("sequelize");
const { sequelize } = require('../model');

exports.getUnpaidJobsService = async (Contract, Job, userProfileId) => {
  return await Job.findAll({
    include: [
      {
        model: Contract,
        where: {
          status: "in_progress",
          [Op.or]: [
            { ContractorId: userProfileId },
            { ClientId: userProfileId },
          ],
        },
      },
    ],
    where: {
      paid: null,
    },
  });
};

exports.payForAJobService = async(Job, Contract, Profile, userProfileId, job_id) => {
    return await sequelize.transaction(async (t) => {
        const job = await Job.findOne({
          include: [
            {
              model: Contract,
              where: {
                ClientId: userProfileId,
              },
            },
          ],
          where: {
            id: job_id,
            paid: null,
          },
        });

        console.log('888888888887777', job)

        // if (!job || req.profile.balance < job.price) {
        //   return res.status(400).end();
        // }

        const contractor = await Profile.findOne({
          include: {
            model: Contract,
            as: 'Contractor',
            where: { id: job.ContractId },
          },
          transaction: t,
        });
  
        await Profile.decrement('balance', {
          by: job.price,
          where: { id: userProfileId },
          transaction: t,
        });
  
        await Job.update(
          {
            paid: true,
            paymentDate: new Date().toISOString(),
          },
          { where: { id: job_id }, transaction: t }
        );
  
        await Profile.increment('balance', {
          by: job.price,
          where: { id: contractor.id },
          transaction: t,
        });
      });
}

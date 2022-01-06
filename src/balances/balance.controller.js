const { Op } = require("sequelize");
const { sequelize } = require("../model");

exports.depostClientBalance = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { userId } = req.params;
  let { depositAmount } = req.body;
  depositAmount = Number(depositAmount);
  if (depositAmount <= 0) {
    return res
      .status(400)
      .json({ status: "fail", message: "Amount must be a postive number" });
  }

  try {
    await sequelize.transaction(async (t) => {
      const jobDebt = await Job.findOne({
        transaction: t,
        attributes: [
          [sequelize.fn("sum", sequelize.col("price")), "total_debt"],
        ],
        where: {
          paid: null,
        },
        include: {
          model: Contract,
          where: {
            ClientId: userId,
            status: {
              [Op.ne]: "terminated",
            },
          },
        },
      });
      // 25/100
      if (
        !jobDebt ||
        depositAmount > Math.ceil(jobDebt.dataValues.total_debt * 0.25)
      ) {
        res
          .status(400)
          .json({
            status: "fail",
            message: "You cannot desposit more than 25% at this time",
          });
      }
      await Profile.increment("balance", {
        by: depositAmount,
        where: { id: userId },
        transaction: t,
      });
    });
    return res
      .status(200)
      .json({ status: "success", message: "Amount deposited successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Something went wrong, please try again",
      });
  }
};

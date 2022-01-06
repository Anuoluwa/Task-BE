const { Op } = require("sequelize");
const { sequelize } = require("../model");

exports.getAllBestProfessions = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end } = req.query;
  const professions = await Profile.findAll({
    group: "profession",
    limit: 1,
    subQuery: false,
    where: { type: "contractor" },
    attributes: ["profession"],
    order: sequelize.literal("`Contractor.Jobs.total_earned` DESC"),
    include: [
      {
        model: Contract,
        attributes: ["id"],
        as: "Contractor",
        group: "ContractorId",
        required: true,
        include: {
          model: Job,
          where: {
            paid: true,
            createdAt: {
              [Op.gte]: start,
              [Op.lte]: end,
            },
          },
          attributes: [
            "ContractId",
            [sequelize.fn("sum", sequelize.col("price")), "total_earned"],
          ],
          group: "ContractId",
          required: true,
        },
      },
    ],
  });
  const bestProfession = {
    profession: professions[0].profession,
    total_earned: professions[0].Contractor[0].Jobs[0].dataValues.total_earned,
  };

  res.status(200).json({ status: "success", data: bestProfession });
};

exports.getAllBestClients = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end, limit } = req.query;
  const parsedLimit = parseInt(limit) || 2;

  const bestClients = await Profile.findAll({
    limit: parsedLimit,
    subQuery: false,
    where: { type: "client" },
    group: "lastName",
    order: sequelize.literal("`Client.Jobs.total_spent` DESC"),
    include: [
      {
        model: Contract,
        as: "Client",
        required: true,
        include: {
          model: Job,
          where: {
            paid: true,
            createdAt: {
              [Op.gte]: start,
              [Op.lte]: end,
            },
          },
          attributes: [
            "ContractId",
            [sequelize.fn("sum", sequelize.col("price")), "total_spent"],
          ],
          group: "ContractId",
          required: true,
        },
      },
    ],
  });

  const result = {
    limit: parsedLimit,
    bestClients: bestClients.map((x) => {
      return {
        id: x.id,
        fullName: `${x.firstName} ${x.lastName}`,
        paid: x.Client[0].Jobs[0].dataValues.total_spent,
      };
    }),
  };
  res.status(200).json({ status: "success", data: result });
};

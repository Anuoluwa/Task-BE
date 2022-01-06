const { Op } = require("sequelize");

exports.getContractByIdService = async (Contract, id, userProfileId) => {
  return await Contract.findOne({
    where: {
      id: id,
      [Op.or]: [{ ContractorId: userProfileId }, { ClientId: userProfileId }],
    },
  });
};

exports.getAllUserContractsService = async (Contract, userProfileId) => {
  return await Contract.findAll({
    where: {
      status: {
        [Op.ne]: "terminated",
      },
      // must belong to profile
      [Op.or]: [{ ContractorId: userProfileId }, { ClientId: userProfileId }],
    },
  });
};

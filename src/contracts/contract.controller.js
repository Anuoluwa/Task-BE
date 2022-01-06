const { Op } = require("sequelize");
const {
  getContractByIdService,
  getAllUserContractsService,
} = require("./contract.service");

exports.getContracts = async (req, res) => {
  const { Contract } = req.app.get("models");
  const userProfileId = req.profile.id;
  const contracts = await getAllUserContractsService(Contract, userProfileId);
  res.status(200).json({ status: "success", data: contracts });
};

exports.getContractById = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const userProfileId = req.profile.id;
  const contract = await getContractByIdService(Contract, id, userProfileId);
  if (!contract) {
    return res.status(404).end();
  }
  res.status(200).json({ status: "success", data: contract });
};

const { Router } = require('express');
const contractRouter = require('../contracts/contract.router')
const jobRouter = require('../jobs/job.router');
const balanceRouter = require('../balances/balance.router')
const adminRouter = require('../admins/admin.router')


const router = Router();
router.use('/contracts', contractRouter);
router.use('/jobs', jobRouter);
router.use('/balances', balanceRouter);
router.use('/admin', adminRouter);


module.exports = router;
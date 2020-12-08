'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const banController = require('../controllers/banController');

// Ban user
// or remove ban from user
router.route('/').
    put([
      body('bannedId').trim().isInt(),
      body('reason').trim().isLength({min: 1, max: 255}).escape(),
    ], banController.ban_user).
    delete([
      body('bannedId').trim().isInt(),
    ], banController.unban_user);

module.exports = router;
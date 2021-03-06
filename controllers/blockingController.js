'use strict';
const blockingModel = require('../models/blockingModel');
const followModel = require('../models/followModel');
const {errorJson} = require('../utils/jsonMessages');

// Returns list of blocked users blocked by current user
const get_blocked_users_by_user = async (req, res) => {
  const query = await blockingModel.getUsersBlockedByUser(
      req.user.user_id,
  );

  return query['error'] ?
      res.status(400).json(query) :
      res.json(query);
};

// For blocking user
const block_user = async (req, res) => {
  if (req.user.user_id.toString() === req.body.blockedId.toString()) {
    return res.status(400).json(errorJson('You can\'t block yourself'));
  }

  const check = await blockingModel.checkBlocked(req.user.user_id,
      req.body.blockedId);
  if (check['error']) {
    return res.status(400).json(check);
  } else if (check.length !== 0) {
    return res.status(400).json(errorJson('User already blocked'));
  }

  const query = await blockingModel.blockUser(req.user.user_id,
      req.body.blockedId);

  if (query['error']) {
    return res.status(400).json(query);
  }

  // If current user is following user, then cancel it
  await followModel.unfollowUser(req.user.user_id, req.body.blockedId);
  // If user is following current user, then cancel it
  await followModel.unfollowUser(req.body.blockedId, req.user.user_id);

  res.json(query);
};

// For unblocking user
const unblock_user = async (req, res) => {
  const check = await blockingModel.checkBlocked(req.user.user_id,
      req.body.blockedId);
  if (check['error']) {
    return res.status(400).json(check);
  }

  const query = await blockingModel.unblockUser(req.user.user_id,
      req.body.blockedId);

  return query['error'] ?
      res.status(400).json(query) :
      res.json(query);
};

module.exports = {
  get_blocked_users_by_user,
  block_user,
  unblock_user,
};
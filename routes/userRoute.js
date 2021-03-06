'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const followController = require('../controllers/followController');
const postController = require('../controllers/postController');
const {body} = require('express-validator');
const multer = require('multer');
const upload = multer({
  dest: './profilePics',
  fileFilter: (req, file, cb) => {
    if (
        !file.mimetype.includes('jpg') &&
        !file.mimetype.includes('jpeg') &&
        !file.mimetype.includes('png')
    ) {
      return cb(null, false);
    }
    cb(null, true);
  },
});
const {userActive, checkBody} = require('../utils/customMiddlewares');

// Updates user information
router.route('/').
    put(
        userActive,
        upload.single('profilePic'), [
          body('fname').
              if(body('fname').exists()).
              trim().
              isLength({max: 50}).
              escape(),
          body('lname').
              if(body('lname').exists()).
              trim().
              isLength({max: 50}).
              escape(),
          //If discord field exists and it's not empty, then check if it's valid
          body('discord').
              if(body('discord').exists().notEmpty()).
              trim().
              isLength({max: 100}).
              isURL().
              escape(),
          //If youtube field exists and it's not empty, then check if it's valid
          body('youtube').
              if(body('youtube').exists().notEmpty()).
              trim().
              isLength({max: 100}).
              isURL().
              escape(),
          //If twitch field exists and it's not empty, then check if it's valid
          body('twitch').
              if(body('twitch').exists().notEmpty()).
              trim().
              isLength({max: 100}).
              isURL().
              escape(),
          body('private').
              if(body('private').exists().notEmpty()).
              custom((val) => val === '1' || val === '0'),
        ], checkBody,
        userController.update_user,
    );

// Get user with id
router.route('/id/:id').get(userController.get_user);

// Get users that current user is following
router.route('/following').get(followController.get_following);

// Get users that are following current user
router.route('/followers').get(followController.get_followers);

// Get all posts from current user
router.route('/posts').get(postController.get_posts_by_userid);

module.exports = router;

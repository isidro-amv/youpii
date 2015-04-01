'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/url/:url', controller.showByUrl);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', controller.show);

router.put('/:id', auth.isAuthenticated(), controller.update);
router.options('/:id', auth.isAuthenticated(), controller.update);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.options('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/', auth.isAuthenticated(), controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;

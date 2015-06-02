'use strict';

var express = require('express');
var controller = require('./person.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/promos',controller.promos);
router.get('/connect/:service', controller.fb_connect);
router.get('/notifications/:id', controller.notification);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
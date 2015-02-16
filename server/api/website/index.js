'use strict';

var express = require('express');
var controller = require('./website.controller');

var router = express.Router();

router.get('/', controller.index);

router.post('/slider', controller.createSlider);
router.put('/slider/:sliderId', controller.updateSlider);
router.patch('/slider/:sliderId', controller.updateSlider);
router.delete('/slider/:sliderId', controller.destroySlider);

router.post('/section', controller.createSection);
router.put('/section/:sectionId', controller.updateSection);
router.patch('/section/:sectionId', controller.updateSection);
router.delete('/section/:sectionId', controller.destroySection);

router.post('/block/:sectionId', controller.createBlock);
router.put('/block/:sectionId/:blockId', controller.updateBlock);
router.patch('/block/:sectionId/:blockId', controller.updateBlock);
router.delete('/block/:sectionId/:blockId', controller.destroyBlock);

module.exports = router;
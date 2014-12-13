'use strict';

var express = require('express');
var controller = require('./website.controller');

var router = express.Router();

router.get('/', controller.index);

router.post('/slider', controller.createSlider);
router.post('/section', controller.createSection);
router.post('/block/:sectionId', controller.createBlock);

router.put('/slider/:sliderId', controller.updateSlider);
router.put('/section/:sectionId', controller.updateSection);
router.put('/block/:sectionId/:blockId', controller.updateBlock);

router.patch('/slider/:sliderId', controller.updateSlider);
router.patch('/section/:sectionId', controller.updateSection);
router.patch('/block/:sectionId/:blockId', controller.updateBlock);

router.delete('/slider/:sliderId', controller.destroySlider);
router.delete('/section/:sectionId', controller.destroySection);
router.delete('/block/:sectionId/:blockId', controller.destroyBlock);

module.exports = router;
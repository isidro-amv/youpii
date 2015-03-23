'use strict';

var express = require('express');
var controller = require('./promo.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/similar/:id',controller.showBySimilar);
router.get('/url/:lang/:url', controller.showByUrl);
router.get('/search/:lang/:words/:page', controller.showByTitle);
router.get('/best-month/:page',controller.showByBestOfMonth);
router.get('/best-ever/:page',controller.showByBestEver);
router.get('/latest/:page',controller.showByLatest);
router.get('/near/:coords/:page',controller.showByNear);
router.get('/city/:url/:page',controller.showByCity);
router.get('/city/:urlCity/:urlCategory/:page',controller.showByCityAndCategory);
router.get('/category/:category/:page',controller.showByCategory);
router.get('/company/:owner/:page', controller.showByCompany);

router.get('/rank/:rank/:id', controller.visited);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
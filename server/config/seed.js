/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var City = require('../api/city/city.model');
var Category = require('../api/category/category.model');
var Promo = require('../api/promo/promo.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

City.find({}).remove(function () {
  City.create({
    name: 'Puerto Vallarta',
    state: 'Jalisco',
    loc: ['12.72734','-23.25875'],
  },{
    name: 'Rivera Nayarit',
    state: 'Nayarit',
    loc: ['32.72734','-23.25875'],
  }, function () {
    console.log('finished populating cities');
  });
});

Category.find({}).remove(function () {
  Category.create({
      name:{
        es: "Restaurante",
        en: "Restaurant"
      },
      url: {
        es: "restaurante",
        en: "restaurant"
      },
      parent: ["123123"],
      info:{
        es: "Restaurante | comida",
        en: "Restaurant | food"
      }
    }, function () {
    console.log('finished populating cities');
  });
});

Promo.find({}).remove(function () {
  Promo.create({
    title: {
      en: "Free",
      es: "Gratis"
    },
    promo: {
      en: "en la compra de pizza mediana gratis un refresco de 2 litros",
      es: "en la compra de pizza mediana gratis un refresco de 2 litros"
    },
    description:{
      en: '<p><strong>Description</strong> es simplemente el la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>',
      es: '<p><strong>Descripción</strong> es simplemente el texto de quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>'
    },
    restriction:{
      en: '<p><strong>Restriction</strong> es simplemente el la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>',
      es: '<p><strong>Restrición</strong> es simplemente el la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>'
    },
    price: 1500.35,
    dateRegistered: '1414452014316',
    dateRenews: '',
    dateLimit: '',
    dateStart: '1414452014316',
    dateEnd: '1414452075680',
    likes: {
      count: 256,
      record: []
    },
    category: '',
    owner: '',
    currency: 'MXN',
    active: true
  }, function () {
    console.log('finished populating Promos');
  });
});
var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index',  { title: '/Strike' })
});

router.get('/shop', (req, res, next) => {
  res.render('shop',  { storeName: '/Strike Shop' })
});
router.get('/about', (req, res, next) => {
  res.render('about',  { storeName: '/Strike Shop' })
});

router.get('/terms', (req, res, next) => {
  res.render('terms',  { title: 'terms', name: 'Reily' })
});

router.get('/settings', (req, res, next) => {
  res.render('settings',  { storeName: '/Strike Shop' })
});

router.get('/privacy', (req, res, next) => {
  res.render('privacy',  { storeName: '/Strike Shop' })
});

router.get('/images', (req, res, next) => {
  res.render('images',  { storeName: '/Strike Shop' })
});

router.get('/images2', (req, res, next) => {
  res.render('images2',  { storeName: '/Strike Shop' })
});

router.get('/bot', (req, res, next) => {
  res.render('bot',  { storeName: '/Strike Shop' })
});

router.get('/buy1', (req, res, next) => {
  res.render('buy1',  { storeName: '/Strike Shop' })
});

router.get('/task', (req, res, next) => {
  res.render('task',  { storeName: '/Strike Shop' })
});

router.post('/task', (req, res, next) => {
  console.log()
});


router.get('/credit', (req, res, next) => {
  res.render('credit',  { storeName: '/Strike Shop' })
});


router.get('/tasks', async(req, res, next) => {
  const tasks = await axios.get('api')
  if(tasks.data.success){
    var response = tasks.data.data;
  }else{
    var response = [];
  };
  
  res.render('tasks',  { title: 'tasks',tasks: response})
});

router.get('/tasks/:user', async(req, res, next) => {
  const tasks = await axios.get(`api?owner=${req.params.user}`);
  if(tasks.data.success){
    var response = tasks.data.data;
  }else{
    var response = [];
  };
  
  res.render('tasks',  { title: 'tasks',tasks: response})
});

router.get('/login', (req, res, next) => {
  res.render('login',  { storeName: '/Strike Shop' })
});

router.get('/signup', (req, res, next) => {
  res.render('signup',  { storeName: '/Strike Shop' })
});

router.get('/forgot', (req, res, next) => {
  res.render('forgot',  { storeName: '/Strike Shop' })
});












module.exports = router;

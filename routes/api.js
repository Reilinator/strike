var express = require('express');
var router = express.Router();
const { Scan } = require('../controlers/dynamo')
/* GET users listing. */


router.get('/', async (req, res, next) => {
  var params = { TableName: 'tasks', ScanFilter: {} };
    console.log('this is my query object', req.query);

  // here is where you add the logic
  for (key in req.query) {
    params.ScanFilter[key] = { ComparisonOperator: 'EQ', AttributeValueList: [req.query[key]] }
  }

  const response = await Scan(params);
  res.send(response)
});
router.post('/task', async (req, res, next) => {
  console.log('here is my form', req.body)
  res.redirect("/")
})

module.exports = router;
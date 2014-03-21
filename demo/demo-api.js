module.exports = function (app) {

  var url = require('url'),
      fs = require('fs');

  var getDemoRules = function (req, res) {
    function answer(code, data) {
      res.writeHead(code,{
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers':'X-Requested-With'
      });
      res.end(data);
    }

    fs.readFile('./demo/demoRules.json', function(err, data) {
      if (err) answer(404, '');
      else answer(200, data);
    });
  };

  app.get('/api/rules', getDemoRules);

};
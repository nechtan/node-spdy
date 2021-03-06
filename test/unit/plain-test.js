var assert = require('assert'),
    spdy = require('../../'),
    keys = require('../fixtures/keys'),
    http = require('http'),
    tls = require('tls'),request
    Buffer = require('buffer').Buffer,
    PORT = 8081;

suite('A SPDY Server / Plain', function() {
  var server;
  setup(function(done) {
    server = spdy.createServer({ plain: true, ssl: false }, function(req, res) {
      res.end('ok');
    });

    server.listen(PORT, done);
  });

  teardown(function(done) {
    server.close(done);
  });

  test('should respond on regular http requests', function(done) {
    var req = http.request({
      host: '127.0.0.1',
      port: PORT,
      path: '/',
      method: 'GET',
      agent: false,
      rejectUnauthorized: false
    }, function(res) {
      res.on('data', function() {
        // Ignore incoming data
      });
      assert.equal(res.statusCode, 200);
      done();
    });
    req.end();
  });

  test('should respond on spdy requests', function(done) {
    var agent = spdy.createAgent({
      host: '127.0.0.1',
      port: PORT,
      spdy: {
        ssl: false,
        plain: true,
        version: 3
      }
    });

    var req = http.request({
      path: '/',
      method: 'GET',
      agent: agent,
    }, function(res) {
      res.on('data', function() {
        // Ignore incoming data
      });
      assert.equal(res.statusCode, 200);
      agent.close();
      done();
    });
    req.end();
  });
});

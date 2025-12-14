const server = require('../app');
const http = require('http');

test('Health endpoint responde OK', done => {
  http.get('http://localhost:3000/health', res => {
    let data = '';

    res.on('data', chunk => data += chunk);

    res.on('end', () => {
      const json = JSON.parse(data);
      expect(json.status).toBe('healthy');
      server.close();
      done();
    });
  });
}, 10000);

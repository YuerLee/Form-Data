const app = require('express')();
const bodyParser = require('body-parser');
const multer = require('multer')();
const http = require('http').Server(app);

app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  const mime = contentType.split(';')[0];

  if (mime != 'multipart/form-data') {
    return next();
  }

  let data = '';
  req.setEncoding('utf8');

  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    req.rawBody = data;
  });

  next();
});

app.use(
  bodyParser.urlencoded({
    extended: false,
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
      }
    }
  })
);

app.all('*', multer.none(), (req, res) => {
  res.status(200).json({
    'request-headers': req.headers,
    'request-query-data': req.query || {},
    'request-body-data': req.body || {},
    'request-raw-body': req.rawBody || {}
  });
});

http.listen(65432, () => {
  console.log('listening on http://localhost:65432');
});

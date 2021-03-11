const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const port = 8080;
const mysqlParams = {
  database: 'bookmark',
  host: 'localhost',
  password: '<ur user password>',
  user: '<ur username>',
};

const whitelist = ['http://localhost:3000', 'http://localhost:3000/']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

const server = express();
server.use(bodyParser.json());

// Start mysql connection
// TODO: add connection pool
const connection = mysql.createConnection(mysqlParams);
connection.connect();

server.options('/bookmark/*', cors(corsOptions));

server.post('/bookmark/add', cors(corsOptions), (req, res) => {
  const {
    linkDescription,
    linkName,
    linkUrl,
  } = req.body;

  if (linkName && linkUrl) {
    const post = {
      linkDescription,
      linkName,
      linkUrl,
    };
    connection.query('INSERT INTO user_bookmarks SET ?', post, function (err, results) {
      if (err) {
        res.status(400).send({ error: true }).end();
      } else {
        res.status(200).send({linkId: results.insertId, success: true }).end();
      }
    });
  }
});

// ? here indicates that the param is optional
server.get('/bookmark/view/:bookmarkid?', cors(corsOptions), (req, res) => {
  const bookmarkid = req.params.bookmarkid;
  let query;

  if (bookmarkid) {
    const preparedSql = 'SELECT * from user_bookmarks where id = ?';
    const preparedSqlParams = [bookmarkid];

    query = mysql.format(preparedSql, preparedSqlParams);
  } else {
    query = 'SELECT * from user_bookmarks ORDER BY linkAddedDate DESC';
  }

  connection.query(query, function (err, rows) {
    if (err) {
      res.status(400).send({ error: true }).end();
    } else {
      const response = {
        count: rows.length,
        data: rows,
        success: true,
      };

      res.status(200).send(response).end();
    }
  });
});

server.patch('/bookmark/update/:bookmarkid', cors(corsOptions), (req, res) => {
  const bookmarkid = req.params.bookmarkid;

  const {
    linkDescription,
    linkName,
    linkUrl,
  } = req.body;

  if (linkDescription || linkName || linkUrl) {
    let preparedSql = 'UPDATE user_bookmarks SET';
    const preparedSqlParams = [];

    if (linkDescription) {
      preparedSql += ' linkDescription = ?, ';
      preparedSqlParams.push(linkDescription);
    }

    if (linkName) {
      preparedSql += ' linkName = ?, ';
      preparedSqlParams.push(linkName);
    }

    if (linkUrl) {
      preparedSql += ' linkUrl = ?';
      preparedSqlParams.push(linkUrl);
    }

    if (preparedSqlParams.length) {
      preparedSql += ' WHERE id = ?';
      preparedSqlParams.push(bookmarkid);

      const query = mysql.format(preparedSql, preparedSqlParams);

      console.log(query);

      connection.query(query, function (err) {
        if (err) {
          res.status(400).send({ error: true }).end();
        } else {
          res.status(200).send({ success: true }).end();
        }
      });
    } else {
      res.status(400).send({ error: true }).end();
    }
  } else {
    res.status(400).send({ error: true }).end();
  }
});

server.delete('/bookmark/remove/:bookmarkid', cors(corsOptions), (req, res) => {
  const bookmarkid = req.params.bookmarkid;
  const preparedSql = 'DELETE FROM user_bookmarks where id = ?';
  const preparedSqlParams = [bookmarkid];
  const query = mysql.format(preparedSql, preparedSqlParams);

  connection.query(query, function (err) {
    if (err) {
      res.status(400).send({ error: true }).end();
    } else {
      res.status(200).send({ success: true }).end();
    }
  });
});

server.listen(port, () => {
  console.log(`Bookmarker server started at http://localhost:${port}`)
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('stopping mysql connection');
    connection.end();
  });
});

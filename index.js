const express = require('express');
const http = require('http');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const connection = mysql.createConnection({
    host: '51.210.156.152',
    user: 'mindbiz1_abroad',
    password: 'HKU\\v2&8Ek24\\N<.',
    database: 'mindbiz1_abroadjobs'
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('database connected!!');
    }
});

app.get('/', (req, res) => {
    res.send('jobs API for mmindbiz.net');
});

app.post('/signup', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let fnQuery = `SELECT * FROM Users WHERE email = '${email}';`;

    console.log(fnQuery);

    connection.query(fnQuery, (err, result, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            if (result.length == 0) {
                connection.query(`INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${password}');`, (err, reslt) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send({ status: 1, message: 'User registered successfully!!' });
                    }
                });
            } else {
                res.send({ statue: 0, message: "user already exist!!" });
            }
        }
    });
});

server.listen(8000, () => {
    console.log(`Server started on port: ${8000}`);
});
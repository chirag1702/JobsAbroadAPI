const express = require('express');
const http = require('http');
const mysql = require('mysql');
const bcrypt = require('bcrypt');;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const connection = mysql.createConnection({
    connectionLimit: 100,
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

app.post('/signup', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let hashedPassword = await HashPassword(password);

    let fnQuery = `select * from Users where email = "${email}";`;

    connection.query(fnQuery, (err, result, fields) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length == 0) {
                connection.query(`INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}');`, (err, reslt) => {
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

app.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let fnQuery = `SELECT * FROM Users where email = "${email}";`;

    connection.query(fnQuery, async (err, result, fields) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length == 0) {
                res.send({ status: 0, message: 'user does not exist by this email!!' });
            } else {
                let isCorrectPassword = await bcrypt.compare(password, result[0].password);
                if (isCorrectPassword) {
                    res.send({ status: 1, message: 'login successfull', data: result });
                } else {
                    res.send({ status: 0, message: 'incorrect password' });
                }
            }
        }
    });
});

app.post('/apply_job', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let jobTitle = req.body.jobtitle;

    let fnQuery = `SELECT * FROM job_applications where email = "${email}" AND job_title = "${jobTitle}";`;

    let applyJobQuery = `INSERT INTO job_applications (name, email, job_title) VALUES ('${name}', '${email}', '${jobTitle}');`;

    // connection.query(fnQuery, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (result.length == 0) {

    //         } else {
    //             res.send({ status: 0, message: 'you have already applied for this job!!' });
    //         }
    //     }
    // });

    connection.query(applyJobQuery, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ status: 1, message: 'job application submitted successfully!!' });
        }
    });
})

async function HashPassword(password) {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

server.listen(2000, () => {
    console.log(`Server started on port: ${2000}`);
});
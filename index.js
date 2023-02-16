let express = require('express');

let path = require('path');

let db = require('./config');

let bodyParser = require('body-parser');
const { request } = require('http');

let port = parseInt(process.env.port) || 4000;

let app = express();

let route = express.Router();

app.use(
    route,
    express.json,
    bodyParser.urlencoded({ extended: false })
)

// Get() Method ~> Retrieves Data

route.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './view/index.html'));
});

route.get('/users', (req, res) => {

    let getQuery = `select userID, firstName, lastName, emailAddress, userPassword from Users; `;

    db.query(getQuery, (err, data) => {
        if (err) {
            res.status(400).json({ err: 'An error occurred' });
        }
        else {
            res.status(200).json({ msg: 'User Details Below', results: data });
        }
    });
});

// Post() Method ~> Inserts Data

route.post('/registration', bodyParser.json(), (req, res) => {

    let data = req.body;
    let postQuery = `insert into Users set ?;`;

    db.query(postQuery, [data], (err, data) => {
        if (err) {
            res.status(400).json({ err: 'An error occurred' });
            console.log(err);
        }
        else {
            res.status(200).json({ msg: 'User data inserted into database' });
        }
    });
});


// Put() Method ~> Updates Data

route.put('/user/:id', bodyParser.json(), (req, res) => {

    let data = req.body;
    let putQuery = `update Users set ? where userID = ?`;

    db.query(putQuery, [data, req.params.id], (err) => {
        if (err) {
            res.status(400).json({ err: 'An error occurred' });
            console.log(err);
        }
        else {
            res.status(200).json({ msg: 'User details updated.' });
        }
    });
});

// Delete() Method ~> Removes records

route.delete('/user/:id', (req, res) => {

    let removeQuery = `delete from Users where userID = ?`;

    db.query(removeQuery, [req.params.id], (err) => {
        if (err) {
            res.status(400).json({ err: 'An error occurred' });
            console.log(err);
        }
        else {
            res.status(200).json({ msg: 'User has been removed.' });
        }
    });
});

// Patch() Method ~> Used for login

route.patch('/login', bodyParser.json(), (req, res) => {

    let { emailAddress, userPassword } = req.body;
    let patchQuery = `select firstName, lastName, emailAddress, userPassword from Users where emailAddress = '${emailAddress}'; `;

    db.query(patchQuery, (err, data) => {
        if (err) {
            res.status(400).json({ err: 'An error occurred' });
            console.log(err);
        } else {
            if ((!data.length) || (data == null)) {
                res.status(401).json({ err: 'You have inserted the wrong email address!' });
            }else {
                console.log(data[0]);
                let { firstName, lastName } = data[0];
                if (userPassword === data[0].userPassword) {
                    res.status(200).json({ msg: `Welcome back, ${firstName} ${lastName}` });
                }else {
                    res.status(200).json({ err: 'Invalid Password!' });
                }
            }
        };
    });
});


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
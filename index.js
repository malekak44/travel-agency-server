const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();

// var admin = require("firebase-admin");

// var serviceAccount = require("./configs/fire-auth-mono-firebase-adminsdk-hv5ee-3dbed41b5a.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9den.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const Services = client.db("travel-agency").collection("services");


    app.post('/addService', (req, res) => {
        const newService = req.body;
        Services.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/services', (req, res) => {
        Services.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // app.get('/Services', (req, res) => {
    //     const bearer = req.headers.authorization;
    //     if (bearer && bearer.startsWith('Bearer ')) {
    //         const idToken = bearer.split(' ')[1];
    //         admin.auth().verifyIdToken(idToken)
    //             .then(function (decodedToken) {
    //                 const tokenEmail = decodedToken.email;
    //                 const queryEmail = req.query.email;
    //                 if (tokenEmail == queryEmail) {
    //                     Services.find({ email: queryEmail })
    //                         .toArray((err, documents) => {
    //                             res.status(200).send(documents);
    //                         })
    //                 } else {
    //                     res.status(401).send('Unauthorized Access');
    //                 }
    //             }).catch(function (error) {
    //                 res.status(401).send('Unauthorized Access');
    //             })
    //     } else {
    //         res.status(401).send('Unauthorized Access');
    //     }
    // });
});

app.listen(4000);
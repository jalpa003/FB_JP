const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
var cors = require("cors");
const router = require('./routers/app');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

//connect to mongodb

mongoose.connect(process.env.MONGO_URI, { 
    // useNewUrlParser: true,
    // useUnifiedTopology: true
    // useFindAndModify: false,
    // useCreateIndex: true
    // useMongoClient: true
    // auto_reconnect: true
    // poolSize: 10
    // socketTimeoutMS: 0
    // keepAlive: true
    // reconnectTries: 30
    // reconnectInterval: 500
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use(cors());
app.use('/', router);

const port = process.env.PORT || 3003
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
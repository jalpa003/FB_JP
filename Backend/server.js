const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
var cors = require("cors");
const router = require('./routers/app');
const path = require('path');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

//connect to mongodb

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use(cors());
app.use('/', router);
// Serve static files from the 'uploads/images' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 3003
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
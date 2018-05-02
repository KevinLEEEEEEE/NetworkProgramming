const bodyParser = require('body-parser');
const express = require('express');
const file = require('./api/file');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/file', file);
app.use(express.static('../dist'));

app.listen(3000);
console.log('success listen at port:3000......');


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));

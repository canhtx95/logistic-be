const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

const { errorResponse } = require('./utils/response');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);


app.listen(5000, () => {
  console.log('Server running at http://www.api.critistudio.top/');
});
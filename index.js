const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

const db = require('./data/dbConfig');
const projectRoutes = require('./routes/projectRoutes');
const actionRoutes = require('./routes/actionRoutes');

server.use('/projects', projectRoutes);
server.use('/actions', actionRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server listening on port ${port}.`));

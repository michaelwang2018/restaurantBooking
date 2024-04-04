import express from 'express';
import apiRouter from './api';

const app = express();
const PORT = 3000;

app.use('/api', apiRouter);

const { User } = require('./models');

User.create({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com'
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

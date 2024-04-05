const express = require('express');
const sequilize = require('./db');

// import apiRouter from './api';

const app = express();
const PORT = 3000;

sequilize.sync().then(() => {
  console.log('Database synced')
})

// app.use('/api', apiRouter);

// const { User } = require('./models');

// User.create({
//   firstName: 'Jane',
//   lastName: 'Doe',
//   email: 'jane.doe@example.com'
// });


// const { models } = require('./models');

// async function createEater() {
//   await models.Eater.create({
//     name: 'John Doe 2',
//     restrictions: 'Gluten-Free, Nut-Free'
//   });

//   console.log('Eater created');
// }

// createEater();


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

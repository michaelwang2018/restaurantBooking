"use strict";
const express = require('express');
const sequelize = require('./db.js');
const Eater = require('./Eater.js');
// import apiRouter from './api';


const app = express();
app.use(express.json());
const PORT = 3000;

sequelize.sync().then(() => {
    console.log('Database synced');
});

app.post('/eaters', async (req, res) => {
    // const { name, restrictions } = req.body;
    // const eater = await Eater.create({ name, restrictions });
    // res.json(eater);
    console.log('PRINTING REQUEST BODY FOR EATER:');
    console.log(req.body);
    Eater.create(req.body).then(() => {
        res.send('Eater created');
    });
});

app.get('/eaters', async (req, res) => {
    const eaters = await Eater.findAll();
    res.json(eaters);
});

app.get('/eaters/:name', async (req, res) => {
    const name = req.params.name
    const eater = await Eater.findOne({ where: {name: name}});
    res.json(eater);
});

app.put('/eaters/:name', async (req, res) => {
    const name = req.params.name;
    const eater = await Eater.findOne({ where: {name: name}});
    eater.update(req.body);
    res.json(eater);
});

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

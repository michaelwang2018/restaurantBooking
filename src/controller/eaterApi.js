const Eater = require('../eater');

async function getEatersController(res) {
    try {
        const eaters = await Eater.findAll();
        res.status(200);
        res.json(eaters);
    }
    catch (error) {
        res.status(400)
        res.send('Failed to fetch Eaters with error: ' + error.message);
    }
}

async function getEaterController(req, res) {
    try {
        const name = req.params.name
        const eater = await Eater.findOne({ where: {name: name}});
        res.status(200).send(eater);
    }
    catch (error) {
        res.status(400).send('Failed to fetch Eater with error: ' + error.message);
    }
}

async function postEaterController(req, res) {
    try {
        const name = req.params.name;
        const eater = await Eater.findOne({ where: {name: name}});
        eater.update(req.body);
        res.status(201).send(eater);
    }
    catch (error) {
        res.status(400).send('Failed to update Eater: ' + error.message);
    
    }
}

async function postEatersController(req, res) {
    try {
        await Eater.create(req.body);
        res.status(201).send('Eater created');
    }
    catch (error) {
        res.status(400).send('Failed to create Eater with error: ' + error.message);
    }
}

module.exports = { getEatersController, getEaterController, postEaterController, postEatersController };
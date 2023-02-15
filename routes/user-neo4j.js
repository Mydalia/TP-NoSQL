const express = require('express');
const router = express.Router();

const users = require('../models/user-neo4j');

router.post('/', async(req, res, next) => {
    // #swagger.tags = ['Neo4j/Users']
    try {
        res.status(201).json(await users.create(req.body.email, req.body.name));
    } catch (e) {
        next(e);
    }
});

module.exports = router;

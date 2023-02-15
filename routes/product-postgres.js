const express = require('express');
const router = express.Router();

const products = require('../models/product-postgres');

router.post('/', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Products']
    try {
        if(req.body.number && req.body.batch) {
            res.status(201).json(await products.createMany(req.body.number, req.body.batch));
        } else {
            res.status(201).json(await products.create(req.body.serialNumber, req.body.name, req.body.price));
        }
    } catch (e) {
        next(e);
    }
});

router.get('/', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Products']
    try {
        res.status(200).json(await products.findAll(req.query.skip, req.query.take));
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Products']
    try {
        res.status(200).json(await products.findById(req.params.id));
    } catch (e) {
        next(e);
    }
});

router.get('/:id/buyers', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Products']
    try {
        res.status(200).json(await products.findBuyers(req.params.id, req.query.skip, req.query.take));
    } catch (e) {
        next(e);
    }
});

router.put('/:id', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Products']
    try {
        res.status(200).json(await products.update(req.params.id, req.body.serialNumber, req.body.name, req.body.price));
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Products']
    try {
        res.status(200).json(await products.remove(req.params.id));
    } catch (e) {
        next(e);
    }
});

module.exports = router;

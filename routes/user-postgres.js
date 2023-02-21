const express = require('express');
const router = express.Router();

const users = require('../models/user-postgres');

router.post('/', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        if(req.body.number && req.body.batch) {
            res.status(201).json(await users.createMany(req.body.number, req.body.batch));
        } else {
            res.status(201).json(await users.create(req.body.email, req.body.name));
        }
    } catch (e) {
        next(e);
    }
});

router.get('/', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.findAll(req.query.skip, req.query.take));
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.findById(req.params.id));
    } catch (e) {
        next(e);
    }
});

router.get('/:id/followers', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.findFollowers(req.params.id, req.query.skip, req.query.take));
    } catch (e) {
        next(e);
    }
});

router.get('/:id/following', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.findFollowing(req.params.id, req.query.skip, req.query.take));
    } catch (e) {
        next(e);
    }
});

router.get('/:id/purchases', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.findPurchases(req.params.id, req.query.skip, req.query.take));
    } catch (e) {
        next(e);
    }
});

router.put('/:id', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.update(req.params.id, req.body.email, req.body.name));
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.remove(req.params.id));
    } catch (e) {
        next(e);
    }
});

router.post('/:id/follow', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.follow(req.params.id, req.body.userToFollowId));
    } catch (e) {
        next(e);
    }
});

router.delete('/:id/unfollow', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.unfollow(req.params.id, req.body.userToUnfollowId));
    } catch (e) {
        next(e);
    }
});

router.post('/:id/purchase', async(req, res, next) => {
    // #swagger.tags = ['Postgres/Users']
    try {
        res.status(200).json(await users.purchase(req.params.id, req.body.productId));
    } catch (e) {
        next(e);
    }
});

module.exports = router;

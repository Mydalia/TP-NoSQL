const express = require('express');
const router = express.Router();

const prisma = require('../prisma/prisma-client');
const neo4j = require('../neo4j/neo4j-client');

router.get('/', async(req, res, next) => {
    // #swagger.tags = ['Count']
    try {
        const postgresUsers = await prisma.user.count();
        const postgresProducts = await prisma.product.count();
        const postgresFollows = await prisma.follow.count();
        const postgresOrders = await prisma.order.count();
        let neo4jUsers = 0;
        let neo4jProducts = 0;
        let neo4jFollows = 0;
        let neo4jOrders = 0;

        const session = neo4j.session();
        try {
            let result = await session.run(
                'MATCH (:User) RETURN count(*) as count'
            );
            neo4jUsers = result.records[0].get(0).low;

            result = await session.run(
                'MATCH (:Product) RETURN count(*) as count'
            );
            neo4jProducts = result.records[0].get(0).low;

            result = await session.run(
                'MATCH (:User)-[:FOLLOWS]->(:User) RETURN count(*) as count'
            );
            neo4jFollows = result.records[0].get(0).low;

            result = await session.run(
                'MATCH (:User)-[:BOUGHT]->(:Product) RETURN count(*) as count'
            );
            neo4jOrders = result.records[0].get(0).low;
        } finally {
            await session.close();
        }

        res.status(200).json({
            postgres: {
                users: postgresUsers,
                products: postgresProducts,
                follows: postgresFollows,
                orders: postgresOrders
            },
            neo4j: {
                users: neo4jUsers,
                products: neo4jProducts,
                follows: neo4jFollows,
                orders: neo4jOrders
            }
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;

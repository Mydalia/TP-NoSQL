const express = require('express');
const router = express.Router();

const prisma = require('../prisma/prisma-client');
const neo4j = require('../neo4j/neo4j-client');

const { randomUUID } = require('crypto');

let postgresUsersIds = [];
let postgresProductsIds = [];
let neo4jUsersIds = [];
let neo4jProductsIds = [];

async function seed() {
    const users = [
        {
            name: 'User1',
            email: `User1@${randomUUID()}.com`
        },
        {
            name: 'User2',
            email: `User2@${randomUUID()}.com`
        },
        {
            name: 'User3',
            email: `User3@${randomUUID()}.com`
        },
        {
            name: 'User4',
            email: `User4@${randomUUID()}.com`
        },
        {
            name: 'User5',
            email: `User5@${randomUUID()}.com`
        },
        {
            name: 'User6',
            email: `User6@${randomUUID()}.com`
        },
        {
            name: 'User7',
            email: `User7@${randomUUID()}.com`
        },
        {
            name: 'User8',
            email: `User8@${randomUUID()}.com`
        },
        {
            name: 'User9',
            email: `User9@${randomUUID()}.com`
        },
        {
            name: 'User10',
            email: `User10@${randomUUID()}.com`
        }
    ];

    const products = [
        {
            serialNumber: randomUUID(),
            name: 'Product1',
            price: 1
        },
        {
            serialNumber: randomUUID(),
            name: 'Product2',
            price: 2
        }
    ];

    await prisma.user.createMany({
        data: users
    });
    await prisma.product.createMany({
        data: products
    });

    let lastInsertedId = await prisma.user.count() - 10 + 1;
    postgresUsersIds = Array.from({ length: 10 }, (_, k) => k + lastInsertedId);

    lastInsertedId = await prisma.product.count() - 2 + 1;
    postgresProductsIds = Array.from({ length: 2 }, (_, k) => k + lastInsertedId);

    let session = neo4j.session();
    let result = await session.run(
        'UNWIND $users AS user CREATE (u:User {name: user.name, email: user.email}) RETURN id(u)',
        {
            users: users
        }
    );
    neo4jUsersIds = result.records.map((record) => record.get(0).low);
    result = await session.run(
        'UNWIND $products AS product CREATE (p:Product {serialNumber: product.serialNumber, name: product.name, price: product.price}) RETURN id(p)',
        {
            products: products
        }
    );
    neo4jProductsIds = result.records.map((record) => record.get(0).low);
    await session.close();

    const postgresFollows = [
        {
            followingId: postgresUsersIds[0],
            followerId: postgresUsersIds[1]
        },
        {
            followingId: postgresUsersIds[0],
            followerId: postgresUsersIds[2]
        },
        {
            followingId: postgresUsersIds[1],
            followerId: postgresUsersIds[0]
        },
        {
            followingId: postgresUsersIds[9],
            followerId: postgresUsersIds[0]
        },
        {
            followingId: postgresUsersIds[1],
            followerId: postgresUsersIds[3]
        },
        {
            followingId: postgresUsersIds[1],
            followerId: postgresUsersIds[4]
        },
        {
            followingId: postgresUsersIds[3],
            followerId: postgresUsersIds[1]
        },
        {
            followingId: postgresUsersIds[2],
            followerId: postgresUsersIds[5]
        },
        {
            followingId: postgresUsersIds[2],
            followerId: postgresUsersIds[6]
        },
        {
            followingId: postgresUsersIds[4],
            followerId: postgresUsersIds[3]
        },
        {
            followingId: postgresUsersIds[3],
            followerId: postgresUsersIds[9]
        },
        {
            followingId: postgresUsersIds[9],
            followerId: postgresUsersIds[3]
        },
        {
            followingId: postgresUsersIds[4],
            followerId: postgresUsersIds[8]
        },
        {
            followingId: postgresUsersIds[8],
            followerId: postgresUsersIds[4]
        },
        {
            followingId: postgresUsersIds[5],
            followerId: postgresUsersIds[4]
        },
        {
            followingId: postgresUsersIds[5],
            followerId: postgresUsersIds[6]
        },
        {
            followingId: postgresUsersIds[5],
            followerId: postgresUsersIds[7]
        },
        {
            followingId: postgresUsersIds[5],
            followerId: postgresUsersIds[8]
        },
        {
            followingId: postgresUsersIds[6],
            followerId: postgresUsersIds[8]
        },
        {
            followingId: postgresUsersIds[7],
            followerId: postgresUsersIds[6]
        },
        {
            followingId: postgresUsersIds[8],
            followerId: postgresUsersIds[7]
        },
        {
            followingId: postgresUsersIds[9],
            followerId: postgresUsersIds[7]
        },
        {
            followingId: postgresUsersIds[7],
            followerId: postgresUsersIds[8]
        }
    ];
    const postgresPurchases = [
        {
            buyerId: postgresUsersIds[0],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[2],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[2],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[2],
            productId: postgresProductsIds[1]
        },
        {
            buyerId: postgresUsersIds[3],
            productId: postgresProductsIds[1]
        },
        {
            buyerId: postgresUsersIds[4],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[6],
            productId: postgresProductsIds[1]
        },
        {
            buyerId: postgresUsersIds[8],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[9],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[9],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[9],
            productId: postgresProductsIds[0]
        },
        {
            buyerId: postgresUsersIds[9],
            productId: postgresProductsIds[1]
        }
    ];
    const neo4jFollows = [
        {
            followingId: neo4jUsersIds[0],
            followerId: neo4jUsersIds[1]
        },
        {
            followingId: neo4jUsersIds[0],
            followerId: neo4jUsersIds[2]
        },
        {
            followingId: neo4jUsersIds[1],
            followerId: neo4jUsersIds[0]
        },
        {
            followingId: neo4jUsersIds[9],
            followerId: neo4jUsersIds[0]
        },
        {
            followingId: neo4jUsersIds[1],
            followerId: neo4jUsersIds[3]
        },
        {
            followingId: neo4jUsersIds[1],
            followerId: neo4jUsersIds[4]
        },
        {
            followingId: neo4jUsersIds[3],
            followerId: neo4jUsersIds[1]
        },
        {
            followingId: neo4jUsersIds[2],
            followerId: neo4jUsersIds[5]
        },
        {
            followingId: neo4jUsersIds[2],
            followerId: neo4jUsersIds[6]
        },
        {
            followingId: neo4jUsersIds[4],
            followerId: neo4jUsersIds[3]
        },
        {
            followingId: neo4jUsersIds[3],
            followerId: neo4jUsersIds[9]
        },
        {
            followingId: neo4jUsersIds[9],
            followerId: neo4jUsersIds[3]
        },
        {
            followingId: neo4jUsersIds[4],
            followerId: neo4jUsersIds[8]
        },
        {
            followingId: neo4jUsersIds[8],
            followerId: neo4jUsersIds[4]
        },
        {
            followingId: neo4jUsersIds[5],
            followerId: neo4jUsersIds[4]
        },
        {
            followingId: neo4jUsersIds[5],
            followerId: neo4jUsersIds[6]
        },
        {
            followingId: neo4jUsersIds[5],
            followerId: neo4jUsersIds[7]
        },
        {
            followingId: neo4jUsersIds[5],
            followerId: neo4jUsersIds[8]
        },
        {
            followingId: neo4jUsersIds[6],
            followerId: neo4jUsersIds[8]
        },
        {
            followingId: neo4jUsersIds[7],
            followerId: neo4jUsersIds[6]
        },
        {
            followingId: neo4jUsersIds[8],
            followerId: neo4jUsersIds[7]
        },
        {
            followingId: neo4jUsersIds[9],
            followerId: neo4jUsersIds[7]
        },
        {
            followingId: neo4jUsersIds[7],
            followerId: neo4jUsersIds[8]
        }
    ];
    const neo4jPurchases = [
        {
            userId: neo4jUsersIds[0],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[2],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[2],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[2],
            productId: neo4jProductsIds[1]
        },
        {
            userId: neo4jUsersIds[3],
            productId: neo4jProductsIds[1]
        },
        {
            userId: neo4jUsersIds[4],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[6],
            productId: neo4jProductsIds[1]
        },
        {
            userId: neo4jUsersIds[8],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[9],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[9],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[9],
            productId: neo4jProductsIds[0]
        },
        {
            userId: neo4jUsersIds[9],
            productId: neo4jProductsIds[1]
        }
    ];

    await prisma.follow.createMany({
        data: postgresFollows
    });
    await prisma.order.createMany({
        data: postgresPurchases
    });

    session = neo4j.session();
    await session.run(
        'UNWIND $data AS d MATCH (u:User), (f:User) WHERE id(u) = d.followingId AND id(f) = d.followerId CREATE (f)-[:FOLLOWS]->(u)',
        {
            data: neo4jFollows
        }
    );
    await session.run(
        'UNWIND $data AS d MATCH (u:User), (p:Product) WHERE id(u) = d.userId AND id(p) = d.productId CREATE (u)-[:BOUGHT]->(p)',
        {
            data: neo4jPurchases
        }
    );
    await session.close();
}

router.get('/', async(req, res, next) => {
    // #swagger.tags = ['Seed']
    try {
        await seed();
        res.status(200).json({
            postgresUsersIds: postgresUsersIds,
            postgresProductsIds: postgresProductsIds,
            neo4jUsersIds: neo4jUsersIds,
            neo4jProductsIds: neo4jProductsIds
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;

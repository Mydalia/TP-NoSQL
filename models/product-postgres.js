const prisma = require('../prisma/prisma-client');

const { randomUUID } = require('crypto');

async function create(serialNumber, name, price) {
    return prisma.product.create({
        data: {
            serialNumber: serialNumber,
            name: name,
            price: parseInt(price)
        }
    });
}

async function createMany(number, batch) {
    const start = Date.now();

    number = parseInt(number);
    batch = parseInt(batch);

    let products = [];
    let count = 0;

    for (let i = 0; i < number; i++) {
        products.push({
            serialNumber: randomUUID(),
            name: randomUUID(),
            price: Math.floor(Math.random() * 1000)
        });

        if (products.length === batch) {
            const result = await prisma.product.createMany({
                data: products
            });
            count += result.count;
            products = [];
        }
    }

    if (products.length > 0) {
        const result = await prisma.product.createMany({
            data: products
        });
        count += result.count;
    }

    return {
        count: count,
        executionTime: Date.now() - start
    };
}

async function findAll(skip, take) {
    return prisma.product.findMany({
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findById(id) {
    return prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    });
}

async function findBuyers(id, skip, take) {
    return prisma.user.findMany({
        where: {
            purchases: {
                some: {
                    productId: parseInt(id)
                }
            }
        },
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

// Pour une référence de produit donné, obtenir le nombre de personnes l’ayant commandé dans un cercle de followers « orienté » de niveau n
async function getFollowersByProduct(productId, userId, maxLevels) {
    const start = Date.now();

    const result = await prisma.$queryRaw`
        WITH RECURSIVE followers AS (
            SELECT id, following_id, follower_id, 1 AS level
            FROM follow
            WHERE following_id = ${parseInt(userId)}
            UNION ALL
            SELECT f.id, f.following_id, f.follower_id, followers.level + 1
            FROM follow f
            INNER JOIN followers ON f.following_id = followers.follower_id
            WHERE followers.level < ${parseInt(maxLevels)}
        ),
        unique_followers AS (
            SELECT DISTINCT follower_id FROM followers
            UNION
            SELECT ${parseInt(userId)} AS follower_id
        )
        SELECT COUNT(DISTINCT o.buyer_id) AS count
        FROM unique_followers
        INNER JOIN "order" o ON unique_followers.follower_id = o.buyer_id
        WHERE o.product_id = ${parseInt(productId)}
    `;

    return {
        count: parseInt(result[0].count) || 0,
        executionTime: Date.now() - start
    };
}

async function update(id, serialNumber, name, price) {
    return prisma.product.update({
        where: {
            id: parseInt(id)
        },
        data: {
            serialNumber: serialNumber,
            name: name,
            price: parseInt(price)
        }
    });
}

async function remove(id) {
    return prisma.product.delete({
        where: {
            id: parseInt(id)
        }
    });
}

module.exports = {
    create: create,
    createMany: createMany,
    findAll: findAll,
    findById: findById,
    findBuyers: findBuyers,
    getFollowersByProduct: getFollowersByProduct,
    update: update,
    remove: remove
};

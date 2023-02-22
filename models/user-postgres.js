const prisma = require('../prisma/prisma-client');

const { randomUUID } = require('crypto');

async function create(email, name) {
    return prisma.user.create({
        data: {
            email: email,
            name: name
        }
    });
}

async function createMany(number, batch) {
    const productNumber = await prisma.product.count();
    if (productNumber === 0) {
        return {
            count: 0,
            executionTime: 0,
            error: 'No products in database'
        };
    }

    const start = Date.now();

    number = parseInt(number);
    batch = parseInt(batch);

    let users = [];
    let count = 0;

    for (let i = 0; i < number; i++) {
        users.push({
            email: `${randomUUID()}@test.com`,
            name: randomUUID()
        });

        if (users.length === batch) {
            const result = await prisma.user.createMany({
                data: users
            });
            count += result.count;
            users = [];

            const lastInsertedId = await prisma.user.count() - batch + 1;

            let data = [];
            for (let userId = lastInsertedId; userId < lastInsertedId + batch; userId++) {
                if (Math.random() > 0.5) {
                    const numberOfFollowers = Math.floor(Math.random() * 20) + 1;
                    for (let k = 0; k < numberOfFollowers; k++) {
                        const randomUserId = Math.floor(Math.random() * (lastInsertedId + batch - lastInsertedId) + lastInsertedId);
                        if (randomUserId !== userId) {
                            data.push({
                                followingId: userId,
                                followerId: randomUserId
                            });
                        }
                    }
                }
            }
            if (data.length > 0) {
                await prisma.follow.createMany({
                    data: data
                });
            }

            data = [];
            for (let userId = lastInsertedId; userId < lastInsertedId + batch; userId++) {
                const numberOfProducts = Math.floor(Math.random() * 5) + 1;
                for (let k = 0; k < numberOfProducts; k++) {
                    data.push({
                        buyerId: userId,
                        productId: Math.floor(Math.random() * productNumber) + 1
                    });
                }
            }
            if (data.length > 0) {
                await prisma.order.createMany({
                    data: data
                });
            }

            data = [];
        }
    }

    if (users.length > 0) {
        const result = await prisma.user.createMany({
            data: users
        });
        count += result.count;
    }

    return {
        count: count,
        executionTime: Date.now() - start
    };
}

async function findAll(skip, take) {
    return prisma.user.findMany({
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });
}

async function findFollowers(id, skip, take) {
    return prisma.user.findMany({
        where: {
            following: {
                some: {
                    followingId: parseInt(id)
                }
            }
        },
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findFollowing(id, skip, take) {
    return prisma.user.findMany({
        where: {
            followers: {
                some: {
                    followerId: parseInt(id)
                }
            }
        },
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findPurchases(id, skip, take) {
    return prisma.product.findMany({
        where: {
            buyers: {
                some: {
                    buyerId: parseInt(id)
                }
            }
        },
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function update(id, email, name) {
    return prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            email: email,
            name: name
        }
    });
}

async function follow(id, userToFollowId) {
    return prisma.follow.create({
        data: {
            followerId: parseInt(id),
            followingId: parseInt(userToFollowId)
        }
    });
}

async function unfollow(id, userToUnfollowId) {
    return prisma.follow.deleteMany({
        where: {
            followerId: parseInt(id),
            followingId: parseInt(userToUnfollowId)
        }
    });
}

async function purchase(id, productId) {
    return prisma.order.create({
        data: {
            buyerId: parseInt(id),
            productId: parseInt(productId)
        }
    });
}

async function remove(id) {
    return prisma.user.delete({
        where: {
            id: parseInt(id)
        }
    });
}

// "Obtenir la liste et le nombre des produits commandés par les cercles de followers d’un individu (niveau 1, ..., niveau n)"
async function getProductsByFollowers(userId, maxLevels) {
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
        SELECT p.serial_number, p.name, p.price, COUNT(o.id) AS count
        FROM unique_followers
        INNER JOIN "order" o ON unique_followers.follower_id = o.buyer_id
        INNER JOIN product p ON o.product_id = p.id
        GROUP BY p.id
    `;
    result.forEach((product) => product.count = parseInt(product.count));

    return {
        products: result,
        executionTime: Date.now() - start
    };
}

// Même requête mais avec spécification d’un produit particulier
async function getProductsByFollowersAndProduct(userId, productId, maxLevels) {
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
        SELECT p.serial_number, p.name, p.price, COUNT(o.id) AS count
        FROM unique_followers 
        INNER JOIN "order" o ON unique_followers.follower_id = o.buyer_id
        INNER JOIN product p ON o.product_id = p.id
        WHERE p.id = ${parseInt(productId)}
        GROUP BY p.id
    `;
    result.forEach((product) => product.count = parseInt(product.count));

    return {
        count: result[0].count || 0,
        executionTime: Date.now() - start
    };
}

module.exports = {
    create: create,
    createMany: createMany,
    findAll: findAll,
    findById: findById,
    findFollowers: findFollowers,
    findFollowing: findFollowing,
    findPurchases: findPurchases,
    update: update,
    follow: follow,
    unfollow: unfollow,
    purchase: purchase,
    remove: remove,
    getProductsByFollowers: getProductsByFollowers,
    getProductsByFollowersAndProduct: getProductsByFollowersAndProduct
};

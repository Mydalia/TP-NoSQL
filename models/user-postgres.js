const prisma = require('../prisma/prisma-client');

const { v4: uuidv4 } = require('uuid');

async function create(email, name) {
    return prisma.user.create({
        data: {
            email: email,
            name: name
        }
    });
}

async function createMany(number, batch) {
    const start = Date.now();

    number = parseInt(number);
    batch = parseInt(batch);

    let users = [];
    let count = 0;
    
    for(let i = 0; i < number; i++) {
        users.push({
            email: uuidv4() + '@test.com',
            name: uuidv4()
        });

        if(users.length === batch) {
            let result = await prisma.user.createMany({
                data: users
            });
            count += result.count;
            users = [];

            let data = [];
            
            const lastInsertedId = await prisma.user.count() - batch + 1;
            for(let userId = lastInsertedId; userId < lastInsertedId + batch; userId++) {
                if(Math.random() > 0.5) {
                    let numberOfFollowers = Math.floor(Math.random() * 20) + 1;            
                    for(let i = 0; i < numberOfFollowers; i++) {
                        data.push({
                            followingId: userId,
                            followerId: Math.floor(Math.random() * (lastInsertedId + batch - lastInsertedId) + lastInsertedId)
                        });
                    }
                }
            }

            await prisma.follow.createMany({
                data: data
            });
        }
    }

    if(users.length > 0) {
        let result = await prisma.user.createMany({
            data: users
        });
        count += result.count;
    }

    return { 
        "count": count,
        "executionTime": Date.now() - start
    };
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });
}

async function findAll(skip, take) {
    return prisma.user.findMany({
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findFollowers(id, skip, take){
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
    })
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
    })
}

async function findPurchase(id, skip, take) {
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
    })
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

async function follow(id, personToFollowId) {
    return prisma.follow.create({
        data: {
            followerId: parseInt(id),
            followingId: parseInt(personToFollowId)
        }
    })
}

async function unfollow(id, personToUnfollowId) {
    return prisma.follow.deleteMany({
        where: {
            followerId: parseInt(id),
            followingId: parseInt(personToUnfollowId)
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

module.exports = {
    create: create,
    createMany: createMany,
    findById: findById,
    findAll: findAll,
    findFollowers: findFollowers,
    findFollowing: findFollowing,
    findPurchase: findPurchase,
    update: update,
    follow: follow,
    unfollow: unfollow,
    purchase: purchase,
    remove: remove
};

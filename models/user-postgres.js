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
        }
    }

    if(users.length > 0) {
        let result = await prisma.user.createMany({
            data: users
        });
        count += result.count;
    }

    return { "count": count };
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
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    }).followers({
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findFollowing(id, skip, take) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    }).following({
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findPurchase(id, skip, take) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    }).purchase({
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

async function follow(id, personToFollowId) {
    return prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            following: {
                connect: {
                    id: parseInt(personToFollowId) || undefined
                }
            }
        }
    });
}

async function unfollow(id, personToUnfollowId) {
    return prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            following: {
                disconnect: {
                    id: parseInt(personToUnfollowId) || undefined
                }
            }
        }
    });
}

async function purchase(id, productId) {
    return prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            purchase: {
                connect: {
                    id: parseInt(productId) || undefined
                }
            }
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

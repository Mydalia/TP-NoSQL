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

async function createMany(number) {
    const users = [];
    for (let i = 0; i < number; i++) {
        users.push({
            email: uuidv4() + '@test.com',
            name: uuidv4()
        });
    }
    return prisma.user.createMany({
        data: users
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });
}

async function findAll() {
    return prisma.user.findMany();
}

async function findFollowers(id) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    }).followers();
}

async function findFollowing(id) {
    return prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    }).following();
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
    update: update,
    follow: follow,
    remove: remove
};

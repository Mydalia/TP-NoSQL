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

// Pour une référence de produit donné, obtenir le nombre de personnes l’ayant commandé dans un cercle de followers « orienté » de niveau n
async function getFollowersByProduct(productId, userId, maxLevels) {

}

module.exports = {
    create: create,
    createMany: createMany,
    findAll: findAll,
    findById: findById,
    findBuyers: findBuyers,
    update: update,
    remove: remove,
    getFollowersByProduct: getFollowersByProduct
};

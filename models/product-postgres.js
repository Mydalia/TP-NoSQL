const prisma = require('../prisma/prisma-client');

const { v4: uuidv4 } = require('uuid');

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
    number = parseInt(number);
    batch = parseInt(batch);
    let products = [];
    let count = 0;

    for(let i = 0; i < number; i++) {
        products.push({
            serialNumber: uuidv4(),
            name: uuidv4(),
            price: Math.floor(Math.random() * 1000)
        });

        if(products.length === batch) {
            let result = await prisma.product.createMany({
                data: products
            });
            count += result.count;
            products = [];
        }
    }

    if(products.length > 0) {
        let result = await prisma.product.createMany({
            data: products
        });
        count += result.count;
    }

    return { "count": count };
}

async function findById(id) {
    return prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    });
}

async function findAll(skip, take) {
    return prisma.product.findMany({
        skip: parseInt(skip) || undefined,
        take: parseInt(take) || undefined
    });
}

async function findBuyers(id, skip, take){
    return prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    }).buyers({
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

module.exports = {
    create: create,
    createMany: createMany,
    findById: findById,
    findAll: findAll,
    findBuyers: findBuyers,
    update: update,
    remove: remove
};

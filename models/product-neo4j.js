const neo4j = require('../neo4j/neo4j-client');

const { randomUUID } = require('crypto');

async function create(serialNumber, name, price) {
    const session = neo4j.session();
    try {
        const result = await session.run(
            'CREATE (p:Product {serialNumber: $serialNumber, name: $name, price: $price}) RETURN p',
            {
                serialNumber: serialNumber,
                name: name,
                price: price
            }
        );
        return result.records[0].get(0).properties;
    } finally {
        await session.close();
    }
}

async function createMany(number, batch) {
    const start = Date.now();

    number = parseInt(number);
    batch = parseInt(batch);

    let products = [];
    let count = 0;

    let session = neo4j.session();
    try {
        for(let i = 0; i < number; i++) {
            products.push({
                serialNumber: randomUUID(),
                name: randomUUID(),
                price: Math.floor(Math.random() * 1000)
            });

            if(products.length === batch) {
                const result = await session.run(
                    'UNWIND $products AS product CREATE (p:Product {serialNumber: product.serialNumber, name: product.name, price: product.price}) RETURN p',
                    {
                        products: products
                    }
                );
                count += result.records.length;
                products = [];
            }
        }

        if(products.length > 0) {
            const result = await session.run(
                'UNWIND $products AS product CREATE (p:Product {serialNumber: product.serialNumber, name: product.name, price: product.price}) RETURN p',
                {
                    products: products
                }
            );
            count += result.records.length;
        }

        return { 
            "count": count,
            "executionTime": Date.now() - start
        };
    } finally {
        await session.close();
    }
}

module.exports = {
    create: create,
    createMany: createMany
};

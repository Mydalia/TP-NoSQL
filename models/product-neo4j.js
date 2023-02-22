const neo4j = require('../neo4j/neo4j-client');

const { randomUUID } = require('crypto');

async function create(serialNumber, name, price) {
    const session = neo4j.session();
    const result = await session.run(
        'CREATE (p:Product {serialNumber: $serialNumber, name: $name, price: $price}) RETURN p',
        {
            serialNumber: serialNumber,
            name: name,
            price: price
        }
    );
    await session.close();
    return result.records[0].get(0).properties;
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
            const session = neo4j.session();
            const result = await session.run(
                'UNWIND $products AS product CREATE (p:Product {serialNumber: product.serialNumber, name: product.name, price: product.price}) RETURN p',
                {
                    products: products
                }
            );
            await session.close();
            count += result.records.length;
            products = [];
        }
    }

    if (products.length > 0) {
        const session = neo4j.session();
        const result = await session.run(
            'UNWIND $products AS product CREATE (p:Product {serialNumber: product.serialNumber, name: product.name, price: product.price}) RETURN p',
            {
                products: products
            }
        );
        await session.close();
        count += result.records.length;
    }

    return {
        count: count,
        executionTime: Date.now() - start
    };
}

// Pour une référence de produit donné, obtenir le nombre de personnes l’ayant commandé dans un cercle de followers « orienté » de niveau n
async function getFollowersByProduct(productId, userId, maxLevels) {
    const start = Date.now();

    const query = `
      MATCH (u:User) WHERE id(u) = ${parseInt(userId)}
      MATCH (follower)-[f:FOLLOWS*1..${parseInt(maxLevels)}]->(u)
      WITH DISTINCT follower
      MATCH (follower)-[:BOUGHT]->(p:Product) WHERE id(p) = ${parseInt(productId)}
      RETURN COUNT(DISTINCT follower) as count
    `;

    const session = neo4j.session();
    const result = await session.run(query);
    await session.close();

    return {
        count: result.records[0].get('count').low,
        executionTime: Date.now() - start
    };
}

module.exports = {
    create: create,
    createMany: createMany,
    getFollowersByProduct: getFollowersByProduct
};

const neo4j = require('../neo4j/neo4j-client');

const { randomUUID } = require('crypto');

async function create(email, name) {
    const session = neo4j.session();
    const result = await session.run(
        'CREATE (u:User {email: $email, name: $name}) RETURN u',
        {
            email: email,
            name: name
        }
    );
    await session.close();
    return result.records[0].get(0).properties;
}

async function createMany(number, batch) {
    let session = neo4j.session();
    let result = await session.run(
        'MATCH (:Product) RETURN count(*) as count'
    );
    await session.close();

    const productNumber = result.records[0].get(0).low;
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
            session = neo4j.session();
            result = await session.run(
                'UNWIND $users AS user CREATE (u:User {email: user.email, name: user.name}) RETURN u',
                {
                    users: users
                }
            );
            await session.close();
            count += result.records.length;
            users = [];

            let data = [];
            for (let j = 0; j < result.records.length; j++) {
                if (Math.random() > 0.5) {
                    const numberOfFollowers = Math.floor(Math.random() * 20) + 1;
                    for (let k = 0; k < numberOfFollowers; k++) {
                        data.push({
                            followingId: result.records[j].get(0).identity.low,
                            followerId: result.records[Math.floor(Math.random() * result.records.length)].get(0).identity.low
                        });
                    }
                }
            }
            if (data.length > 0) {
                session = neo4j.session();
                await session.run(
                    'UNWIND $data AS d MATCH (u:User), (f:User) WHERE id(u) = d.followingId AND id(f) = d.followerId CREATE (f)-[:FOLLOWS]->(u)',
                    {
                        data: data
                    }
                );
                await session.close();
            }

            data = [];
            for (let j = 0; j < result.records.length; j++) {
                const numberOfProducts = Math.floor(Math.random() * 5) + 1;
                for (let k = 0; k < numberOfProducts; k++) {
                    data.push({
                        userId: result.records[j].get(0).identity.low,
                        productId: Math.floor(Math.random() * productNumber) + 1
                    });
                }
            }
            if (data.length > 0) {
                session = neo4j.session();
                await session.run(
                    'UNWIND $data AS d MATCH (u:User), (p:Product) WHERE id(u) = d.userId AND id(p) = d.productId CREATE (u)-[:BOUGHT]->(p)',
                    {
                        data: data
                    }
                );
                await session.close();
            }

            data = [];
        }
    }

    if (users.length > 0) {
        session = neo4j.session();
        result = await session.run(
            'UNWIND $users AS user CREATE (u:User {email: user.email, name: user.name}) RETURN u',
            {
                users: users
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

// "Obtenir la liste et le nombre des produits commandés par les cercles de followers d’un individu (niveau 1, ..., niveau n)"
async function getProductsByFollowers(userId, maxLevels) {
    const query = `
      MATCH (u:User) WHERE id(u) = ${parseInt(userId)}
      MATCH (follower)-[f:FOLLOWS*1..${parseInt(maxLevels)}]->(u)
      WITH DISTINCT follower
      MATCH (follower)-[:BOUGHT]->(p:Product)
      RETURN p, COUNT(p) as count
    `;

    const session = neo4j.session();
    const result = await session.run(query);
    await session.close();

    return result.records.map((record) => ({
        product: record.get('p').properties,
        count: record.get('count').low
    }));
}

// Même requête mais avec spécification d’un produit particulier
async function getProductsByFollowersAndProduct(userId, productId, maxLevels) {
    const query = `
      MATCH (u:User) WHERE id(u) = ${parseInt(userId)}
      MATCH (follower)-[f:FOLLOWS*1..${parseInt(maxLevels)}]->(u)
      WITH DISTINCT follower
      MATCH (follower)-[:BOUGHT]->(p:Product) WHERE id(p) = ${parseInt(productId)}
      RETURN COUNT(p) as count
    `;

    const session = neo4j.session();
    const result = await session.run(query);
    await session.close();

    return { count: result.records[0].get('count').low };
}

module.exports = {
    create: create,
    createMany: createMany,
    getProductsByFollowers: getProductsByFollowers,
    getProductsByFollowersAndProduct: getProductsByFollowersAndProduct
};

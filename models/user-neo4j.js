const neo4j = require('../neo4j/neo4j-client');

const { randomUUID } = require('crypto');

async function create(email, name) {
    const session = neo4j.session();
    try {
        const result = await session.run(
            'CREATE (u:User {email: $email, name: $name}) RETURN u',
            {
                email: email,
                name: name
            }
        );
        return result.records[0].get(0).properties;
    } finally {
        await session.close();
    }
}

async function createMany(number, batch) {
    number = parseInt(number);
    batch = parseInt(batch);

    let users = [];
    let count = 0;

    let session = neo4j.session();
    try {
        for(let i = 0; i < number; i++) {
            users.push({
                email: randomUUID() + '@test.com',
                name: randomUUID()
            });

            if(users.length === batch) {
                const result = await session.run(
                    'UNWIND $users AS user CREATE (u:User {email: user.email, name: user.name}) RETURN u',
                    {
                        users: users
                    }
                );
                count += result.records.length;
                users = [];
            }
        }

        if(users.length > 0) {
            const result = await session.run(
                'UNWIND $users AS user CREATE (u:User {email: user.email, name: user.name}) RETURN u',
                {
                    users: users
                }
            );
            count += result.records.length;
        }

        return { "count": count };
    } finally {
        await session.close();
    }
}

module.exports = {
    create: create,
    createMany: createMany
};

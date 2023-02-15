const neo4j = require('../neo4j/neo4j-client');

async function create(email, name) {
    const result = await neo4j.run(
        'CREATE (u:User {email: $email, name: $name}) RETURN u',
        { email: email, name: name }
    );
    return result.records[0].get(0).properties;
}

module.exports = {
    create: create
};

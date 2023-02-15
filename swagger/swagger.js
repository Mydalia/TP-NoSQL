const swaggerAutogen = require('swagger-autogen')();

const endpointsFiles = ['../server/api.js'];
const outputFile = './swagger-doc.json';

const doc = {
    info: {
        version: '1.0.0',
        title: 'TP-NoSQL API',
        description: 'TP-NoSQL API Documentation'
    },
    host: '',
    basePath: '/api',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Postgres/Users',
            description: 'User with postgres endpoints'
        },
        {
            name: 'Neo4j/Users',
            description: 'User with neo4j endpoints'
        },
        {
            name: 'Postgres/Products',
            description: 'Product with postgres endpoints'
        },
        {
            name: 'Neo4j/Products',
            description: 'Product with neo4j endpoints'
        }
    ]
};

swaggerAutogen(outputFile, endpointsFiles, doc);

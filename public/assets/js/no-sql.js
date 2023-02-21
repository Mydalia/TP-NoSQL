const sgbdNumberOfUsers = document.getElementById('sgbd-number-of-users');
const sgbdNumberOfProducts = document.getElementById('sgbd-number-of-products');
const noSqlNumberOfUsers = document.getElementById('nosql-number-of-users');
const noSqlNumberOfProducts = document.getElementById('nosql-number-of-products');

function updateCounts() {
    fetch('http://localhost:3000/api/counts').then(result => result.json()).then(data => {
        sgbdNumberOfUsers.innerHTML = data.postgres.users;
        sgbdNumberOfProducts.innerHTML = data.postgres.products;
        noSqlNumberOfUsers.innerHTML = data.neo4j.users;
        noSqlNumberOfProducts.innerHTML = data.neo4j.products;
    });
}

updateCounts();

const sgbdInsertProductNumber = document.getElementById('sgbd-insert-product-number');
const sgbdInsertProductBatch = document.getElementById('sgbd-insert-product-batch');
const sgbdInsertProductBtn = document.getElementById('sgbd-insert-product-btn');
const sgbdResultTime = document.getElementById('sgbd-result-time');

sgbdInsertProductBtn.addEventListener('click', () => {
    const number = sgbdInsertProductNumber.value;
    const batch = sgbdInsertProductBatch.value;

    fetch('http://localhost:3000/api/postgres/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            batch: batch
        })
    }).then(result => result.json()).then(data => {
        sgbdResultTime.innerHTML = data.executionTime + ' ms';
        updateCounts();
    });
});

const sgbdInsertUserNumber = document.getElementById('sgbd-insert-user-number');
const sgbdInsertUserBatch = document.getElementById('sgbd-insert-user-batch');
const sgbdInsertUserBtn = document.getElementById('sgbd-insert-user-btn');

sgbdInsertUserBtn.addEventListener('click', () => {
    const number = sgbdInsertUserNumber.value;
    const batch = sgbdInsertUserBatch.value;

    fetch('http://localhost:3000/api/postgres/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            batch: batch
        })
    }).then(result => result.json()).then(data => {
        sgbdResultTime.innerHTML = data.executionTime + ' ms';
        updateCounts();
    });
});

const noSqlInsertProductNumber = document.getElementById('nosql-insert-product-number');
const noSqlInsertProductBatch = document.getElementById('nosql-insert-product-batch');
const noSqlInsertProductBtn = document.getElementById('nosql-insert-product-btn');
const noSqlResultTime = document.getElementById('nosql-result-time');

noSqlInsertProductBtn.addEventListener('click', () => {
    const number = noSqlInsertProductNumber.value;
    const batch = noSqlInsertProductBatch.value;

    fetch('http://localhost:3000/api/neo4j/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            batch: batch
        })
    }).then(result => result.json()).then(data => {
        noSqlResultTime.innerHTML = data.executionTime + ' ms';
        updateCounts();
    });
});

const noSqlInsertUserNumber = document.getElementById('nosql-insert-user-number');
const noSqlInsertUserBatch = document.getElementById('nosql-insert-user-batch');
const noSqlInsertUserBtn = document.getElementById('nosql-insert-user-btn');

noSqlInsertUserBtn.addEventListener('click', () => {
    const number = noSqlInsertUserNumber.value;
    const batch = noSqlInsertUserBatch.value;

    fetch('http://localhost:3000/api/neo4j/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: number,
            batch: batch
        })
    }).then(result => result.json()).then(data => {
        noSqlResultTime.innerHTML = data.executionTime + ' ms';
        updateCounts();
    });
});
const sgbdNumberOfUsers = document.getElementById('sgbd-number-of-users');
const sgbdNumberOfProducts = document.getElementById('sgbd-number-of-products');

function updateCounts() {
    fetch('http://localhost:3000/api/counts').then((result) => result.json()).then((data) => {
        sgbdNumberOfUsers.innerHTML = data.postgres.users;
        sgbdNumberOfProducts.innerHTML = data.postgres.products;
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
    }).then((result) => result.json()).then((data) => {
        sgbdResultTime.innerHTML = `${data.executionTime} ms`;
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
    }).then((result) => result.json()).then((data) => {
        sgbdResultTime.innerHTML = `${data.executionTime} ms`;
        updateCounts();
    });
});


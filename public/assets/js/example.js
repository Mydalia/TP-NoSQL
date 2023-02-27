const loader = document.getElementById('loader-box');

const noSqlNumberOfUsers = document.getElementById('nosql-number-of-users');
const noSqlNumberOfProducts = document.getElementById('nosql-number-of-products');
const sgbdNumberOfUsers = document.getElementById('sgbd-number-of-users');
const sgbdNumberOfProducts = document.getElementById('sgbd-number-of-products');

function toggleLoader(state) {
    if (state === 'on') {
        loader.style.display = 'block';
    } else if (state === 'off') {
        loader.style.display = 'none';
    }
}

function addExampleData() {
    fetch('http://localhost:3000/api/seed').then((result) => result.json()).then(() => {
        updateCounts();
    });
}

function updateCounts() {
    fetch('http://localhost:3000/api/counts').then((result) => result.json()).then((data) => {
        noSqlNumberOfUsers.innerHTML = data.neo4j.users;
        noSqlNumberOfProducts.innerHTML = data.neo4j.products;
        sgbdNumberOfUsers.innerHTML = data.postgres.users;
        sgbdNumberOfProducts.innerHTML = data.postgres.products;

        if (data.neo4j.users == 0 && data.neo4j.products == 0 && data.postgres.users == 0 && data.postgres.products == 0) {
            addExampleData();
        }

        toggleLoader('off');
    });
}

updateCounts();

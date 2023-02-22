const noSqlNumberOfUsers = document.getElementById('nosql-number-of-users');
const noSqlNumberOfProducts = document.getElementById('nosql-number-of-products');

function updateCounts() {
    fetch('http://localhost:3000/api/counts').then((result) => result.json()).then((data) => {
        noSqlNumberOfUsers.innerHTML = data.neo4j.users;
        noSqlNumberOfProducts.innerHTML = data.neo4j.products;
    });
}

updateCounts();

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
    }).then((result) => result.json()).then((data) => {
        noSqlResultTime.innerHTML = `${data.executionTime} ms`;
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
    }).then((result) => result.json()).then((data) => {
        noSqlResultTime.innerHTML = `${data.executionTime} ms`;
        updateCounts();
    });
});

const noSqlGetProductsByFollowersIdUser = document.getElementById('nosql-get-products-by-followers-iduser');
const noSqlGetProductsByFollowersDepth = document.getElementById('nosql-get-products-by-followers-depth');
const noSqlGetProductsByFollowersBtn = document.getElementById('nosql-get-products-by-followers-btn');
const noSqlResult = document.getElementById('nosql-result');

noSqlGetProductsByFollowersBtn.addEventListener('click', () => {
    const idUser = noSqlGetProductsByFollowersIdUser.value;
    const depth = noSqlGetProductsByFollowersDepth.value;

    fetch(`http://localhost:3000/api/neo4j/users/${idUser}/getProductsByFollowers?maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        noSqlResultTime.innerHTML = `${data.executionTime} ms`;
        noSqlResult.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Count</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.products.map((p) => ` 
                        <tr>
                            <td>${p.product.name}</td>
                            <td>${p.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
});

const noSqlGetProductByFollowersIdUser = document.getElementById('nosql-get-product-by-followers-iduser');
const noSqlGetProductByFollowersIdProduct = document.getElementById('nosql-get-product-by-followers-id-product');
const noSqlGetProductByFollowersDepth = document.getElementById('nosql-get-product-by-followers-depth');
const noSqlGetProductByFollowersBtn = document.getElementById('nosql-get-product-by-followers-btn');

noSqlGetProductByFollowersBtn.addEventListener('click', () => {
    const idUser = noSqlGetProductByFollowersIdUser.value;
    const idProduct = noSqlGetProductByFollowersIdProduct.value;
    const depth = noSqlGetProductByFollowersDepth.value;

    fetch(`http://localhost:3000/api/neo4j/users/${idUser}/getProductsByFollowersAndProduct?productId=${idProduct}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        noSqlResultTime.innerHTML = `${data.executionTime} ms`;
        noSqlResult.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${data.count}</td>
                    </tr>
                </tbody>
            </table>
        `;
    });
});

const noSqlGetFollowersByProductIdUser = document.getElementById('nosql-get-followers-by-product-id-user');
const noSqlGetFollowersByProductIdProduct = document.getElementById('nosql-get-followers-by-product-id-product');
const noSqlGetFollowersByProductDepth = document.getElementById('nosql-get-followers-by-product-depth');
const noSqlGetFollowersByProductBtn = document.getElementById('nosql-get-followers-by-product-btn');

noSqlGetFollowersByProductBtn.addEventListener('click', () => {
    const idUser = noSqlGetFollowersByProductIdUser.value;
    const idProduct = noSqlGetFollowersByProductIdProduct.value;
    const depth = noSqlGetFollowersByProductDepth.value;

    fetch(`http://localhost:3000/api/neo4j/products/${idProduct}/getFollowersByProduct?userId=${idUser}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        noSqlResultTime.innerHTML = `${data.executionTime} ms`;
        noSqlResult.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${data.count}</td>
                    </tr>
                </tbody>
            </table>
        `;
    });
});
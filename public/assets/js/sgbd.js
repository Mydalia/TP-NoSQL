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


const sgbdGetProductsByFollowersIdUser = document.getElementById('sgbd-get-products-by-followers-iduser');
const sgbdGetProductsByFollowersDepth = document.getElementById('sgbd-get-products-by-followers-depth');
const sgbdGetProductsByFollowersBtn = document.getElementById('sgbd-get-products-by-followers-btn');
const sgbdResult = document.getElementById('sgbd-result');

sgbdGetProductsByFollowersBtn.addEventListener('click', () => {
    const idUser = sgbdGetProductsByFollowersIdUser.value;
    const depth = sgbdGetProductsByFollowersDepth.value;

    fetch(`http://localhost:3000/api/postgres/users/${idUser}/getProductsByFollowers?maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        sgbdResultTime.innerHTML = `${data.executionTime} ms`;
        sgbdResult.innerHTML = `
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
                            <td>${p.name}</td>
                            <td>${p.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
});

const sgbdGetProductByFollowersIdUser = document.getElementById('sgbd-get-product-by-followers-iduser');
const sgbdGetProductByFollowersIdProduct = document.getElementById('sgbd-get-product-by-followers-id-product');
const sgbdGetProductByFollowersDepth = document.getElementById('sgbd-get-product-by-followers-depth');
const sgbdGetProductByFollowersBtn = document.getElementById('sgbd-get-product-by-followers-btn');

sgbdGetProductByFollowersBtn.addEventListener('click', () => {
    const idUser = sgbdGetProductByFollowersIdUser.value;
    const idProduct = sgbdGetProductByFollowersIdProduct.value;
    const depth = sgbdGetProductByFollowersDepth.value;

    fetch(`http://localhost:3000/api/neo4j/users/${idUser}/getProductsByFollowersAndProduct?productId=${idProduct}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        sgbdResultTime.innerHTML = `${data.executionTime} ms`;
        sgbdResult.innerHTML = `
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

const sgbdGetFollowersByProductIdUser = document.getElementById('sgbd-get-followers-by-product-id-user');
const sgbdGetFollowersByProductIdProduct = document.getElementById('sgbd-get-followers-by-product-id-product');
const sgbdGetFollowersByProductDepth = document.getElementById('sgbd-get-followers-by-product-depth');
const sgbdGetFollowersByProductBtn = document.getElementById('sgbd-get-followers-by-product-btn');

sgbdGetFollowersByProductBtn.addEventListener('click', () => {
    const idUser = sgbdGetFollowersByProductIdUser.value;
    const idProduct = sgbdGetFollowersByProductIdProduct.value;
    const depth = sgbdGetFollowersByProductDepth.value;

    fetch(`http://localhost:3000/api/neo4j/products/${idProduct}/getFollowersByProduct?userId=${idUser}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        sgbdResultTime.innerHTML = `${data.executionTime} ms`;
        sgbdResult.innerHTML = `
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

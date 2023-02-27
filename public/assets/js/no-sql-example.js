const noSqlResultTimeExemple = document.getElementById('nosql-result-time');
const noSqlResultExemple = document.getElementById('nosql-result');

const noSqlGetProductsByFollowersIdUserExemple = document.getElementById('nosql-get-products-by-followers-iduser');
const noSqlGetProductsByFollowersDepthExemple = document.getElementById('nosql-get-products-by-followers-depth');
const noSqlGetProductsByFollowersBtnExemple = document.getElementById('nosql-get-products-by-followers-btn');

noSqlGetProductsByFollowersBtnExemple.addEventListener('click', () => {
    toggleLoader('on');
    const idUser = noSqlGetProductsByFollowersIdUserExemple.value;
    const depth = noSqlGetProductsByFollowersDepthExemple.value;

    fetch(`http://localhost:3000/api/neo4j/users/${idUser}/getProductsByFollowers?maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        noSqlResultTimeExemple.innerHTML = `${data.executionTime} ms`;
        noSqlResultExemple.innerHTML = `
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
        toggleLoader('off');
    });
});

const noSqlGetProductByFollowersIdUserExemple = document.getElementById('nosql-get-product-by-followers-iduser');
const noSqlGetProductByFollowersIdProductExemple = document.getElementById('nosql-get-product-by-followers-id-product');
const noSqlGetProductByFollowersDepthExemple = document.getElementById('nosql-get-product-by-followers-depth');
const noSqlGetProductByFollowersBtnExemple = document.getElementById('nosql-get-product-by-followers-btn');

noSqlGetProductByFollowersBtnExemple.addEventListener('click', () => {
    toggleLoader('on');
    const idUser = noSqlGetProductByFollowersIdUserExemple.value;
    const idProduct = noSqlGetProductByFollowersIdProductExemple.value;
    const depth = noSqlGetProductByFollowersDepthExemple.value;

    fetch(`http://localhost:3000/api/neo4j/users/${idUser}/getProductsByFollowersAndProduct?productId=${idProduct}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        noSqlResultTimeExemple.innerHTML = `${data.executionTime} ms`;
        noSqlResultExemple.innerHTML = `
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
        toggleLoader('off');
    });
});

const noSqlGetFollowersByProductIdUserExemple = document.getElementById('nosql-get-followers-by-product-id-user');
const noSqlGetFollowersByProductIdProductExemple = document.getElementById('nosql-get-followers-by-product-id-product');
const noSqlGetFollowersByProductDepthExemple = document.getElementById('nosql-get-followers-by-product-depth');
const noSqlGetFollowersByProductBtnExemple = document.getElementById('nosql-get-followers-by-product-btn');

noSqlGetFollowersByProductBtnExemple.addEventListener('click', () => {
    toggleLoader('on');
    const idUser = noSqlGetFollowersByProductIdUserExemple.value;
    const idProduct = noSqlGetFollowersByProductIdProductExemple.value;
    const depth = noSqlGetFollowersByProductDepthExemple.value;

    fetch(`http://localhost:3000/api/neo4j/products/${idProduct}/getFollowersByProduct?userId=${idUser}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        noSqlResultTimeExemple.innerHTML = `${data.executionTime} ms`;
        noSqlResultExemple.innerHTML = `
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
        toggleLoader('off');
    });
});

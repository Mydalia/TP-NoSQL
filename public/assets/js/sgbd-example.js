const sgbdResultTimeExemple = document.getElementById('sgbd-result-time');
const sgbdResultExemple = document.getElementById('sgbd-result');

const sgbdGetProductsByFollowersIdUserExemple = document.getElementById('sgbd-get-products-by-followers-iduser');
const sgbdGetProductsByFollowersDepthExemple = document.getElementById('sgbd-get-products-by-followers-depth');
const sgbdGetProductsByFollowersBtnExemple = document.getElementById('sgbd-get-products-by-followers-btn');

sgbdGetProductsByFollowersBtnExemple.addEventListener('click', () => {
    const idUser = sgbdGetProductsByFollowersIdUserExemple.value;
    const depth = sgbdGetProductsByFollowersDepthExemple.value;

    fetch(`http://localhost:3000/api/postgres/users/${idUser}/getProductsByFollowers?maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        sgbdResultTimeExemple.innerHTML = `${data.executionTime} ms`;
        sgbdResultExemple.innerHTML = `
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

const sgbdGetProductByFollowersIdUserExemple = document.getElementById('sgbd-get-product-by-followers-iduser');
const sgbdGetProductByFollowersIdProductExemple = document.getElementById('sgbd-get-product-by-followers-id-product');
const sgbdGetProductByFollowersDepthExemple = document.getElementById('sgbd-get-product-by-followers-depth');
const sgbdGetProductByFollowersBtnExemple = document.getElementById('sgbd-get-product-by-followers-btn');

sgbdGetProductByFollowersBtnExemple.addEventListener('click', () => {
    const idUser = sgbdGetProductByFollowersIdUserExemple.value;
    const idProduct = sgbdGetProductByFollowersIdProductExemple.value;
    const depth = sgbdGetProductByFollowersDepthExemple.value;

    fetch(`http://localhost:3000/api/postgres/users/${idUser}/getProductsByFollowersAndProduct?productId=${idProduct}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        sgbdResultTimeExemple.innerHTML = `${data.executionTime} ms`;
        sgbdResultExemple.innerHTML = `
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

const sgbdGetFollowersByProductIdUserExemple = document.getElementById('sgbd-get-followers-by-product-id-user');
const sgbdGetFollowersByProductIdProductExemple = document.getElementById('sgbd-get-followers-by-product-id-product');
const sgbdGetFollowersByProductDepthExemple = document.getElementById('sgbd-get-followers-by-product-depth');
const sgbdGetFollowersByProductBtnExemple = document.getElementById('sgbd-get-followers-by-product-btn');

sgbdGetFollowersByProductBtnExemple.addEventListener('click', () => {
    const idUser = sgbdGetFollowersByProductIdUserExemple.value;
    const idProduct = sgbdGetFollowersByProductIdProductExemple.value;
    const depth = sgbdGetFollowersByProductDepthExemple.value;

    fetch(`http://localhost:3000/api/postgres/products/${idProduct}/getFollowersByProduct?userId=${idUser}&maxLevels=${depth}`).then((result) => result.json()).then((data) => {
        sgbdResultTimeExemple.innerHTML = `${data.executionTime} ms`;
        sgbdResultExemple.innerHTML = `
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

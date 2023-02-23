const noSqlResult = document.getElementById('nosql-list-user');
const sgbdResult = document.getElementById('sgbd-list-user');

function getNoSqlUsers() {
    fetch(`http://localhost:3000/api/neo4j/products/`).then((result) => result.json()).then((data) => {
    noSqlResult.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Serial Number</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((p) => ` 
                    <tr>
                        <td>${p.name}</td>
                        <td>${p.serialNumber}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    });
}

getNoSqlUsers();

function getSgbdUsers() {
    fetch(`http://localhost:3000/api/postgres/products/?take=10`).then((result) => result.json()).then((data) => {  
        sgbdResult.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nom</th>
                        <th scope="col">Serial Number</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((p) => ` 
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.serialNumber}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
}

getSgbdUsers();
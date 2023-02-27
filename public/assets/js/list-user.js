const noSqlResult = document.getElementById('nosql-list-user');
const sgbdResult = document.getElementById('sgdb-list-user');

function getNoSqlUsers() {
    fetch('http://localhost:3000/api/neo4j/users').then((result) => result.json()).then((data) => {
        noSqlResult.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((u) => ` 
                    <tr>
                        <td>${u.name}</td>
                        <td>${u.email}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    });
}

getNoSqlUsers();

function getSgbdUsers() {
    fetch('http://localhost:3000/api/postgres/users/?take=10').then((result) => result.json()).then((data) => {
        sgbdResult.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((u) => ` 
                    <tr>
                        <td>${u.name}</td>
                        <td>${u.email}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    });
}

getSgbdUsers();

const GATEWAY_URL = window.GATEWAY_URL || 'http://localhost:4000/graphql';

async function graphqlRequest(query, variables = {}) {
    try {
        const response = await fetch(GATEWAY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('GraphQL Request Error:', error);
        return {
            errors: [{ 
                message: `Network error: ${error.message}. Pastikan Gateway running di http://localhost:4000/graphql` 
            }]
        };
    }
}

function displayResults(data, isError = false) {
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    loadingDiv.style.display = 'none';
    resultsDiv.innerHTML = '';

    if (isError || data.errors) {
        const errorMessage = data.errors ? data.errors[0].message : 'An error occurred';
        resultsDiv.innerHTML = `
            <div class="error">
                <strong>❌ Error:</strong> ${errorMessage}
            </div>
        `;
        return;
    }

    if (data.data) {
        const dataStr = JSON.stringify(data.data, null, 2);
        resultsDiv.innerHTML = `
            <div class="success">
                <strong>✅ Success!</strong> Data retrieved successfully.
            </div>
            <pre>${dataStr}</pre>
        `;
    }
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').innerHTML = '';
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}


async function queryUsers() {
    showLoading();
    const query = `
        query {
            users {
                id
                name
                email
                role
            }
        }
    `;
    const data = await graphqlRequest(query);
    displayResults(data);
}

async function queryUserById() {
    const userId = document.getElementById('userId').value;
    if (!userId) {
        alert('Please enter a User ID');
        return;
    }

    showLoading();
    const query = `
        query {
            user(id: ${userId}) {
                id
                name
                email
                role
            }
        }
    `;
    const data = await graphqlRequest(query);
    displayResults(data);
}

async function queryProducts() {
    showLoading();
    const query = `
        query {
            products {
                id
                name
                price
                stock
                seller_id
            }
        }
    `;
    const data = await graphqlRequest(query);
    displayResults(data);
}

async function queryProductById() {
    const productId = document.getElementById('productId').value;
    if (!productId) {
        alert('Please enter a Product ID');
        return;
    }

    showLoading();
    const query = `
        query {
            product(id: ${productId}) {
                id
                name
                price
                stock
                seller_id
            }
        }
    `;
    const data = await graphqlRequest(query);
    displayResults(data);
}

async function queryOrders() {
    showLoading();
    const query = `
        query {
            orders {
                id
                user_id
                product_id
                product_name
                quantity
                price
                total_price
                created_at
            }
        }
    `;
    const data = await graphqlRequest(query);
    displayResults(data);
}

async function queryOrderById() {
    const orderId = document.getElementById('orderId').value;
    if (!orderId) {
        alert('Please enter an Order ID');
        return;
    }

    showLoading();
    const query = `
        query {
            order(id: ${orderId}) {
                id
                user_id
                product_id
                product_name
                quantity
                price
                total_price
                created_at
            }
        }
    `;
    const data = await graphqlRequest(query);
    displayResults(data);
}


async function createUser(event) {
    event.preventDefault();
    showLoading();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;

    const mutation = `
        mutation {
            createUser(
                name: "${name}"
                email: "${email}"
                role: "${role}"
            ) {
                id
                name
                email
                role
            }
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('createUserForm').reset();
        setTimeout(queryUsers, 500);
    }
}

async function deleteUser(event) {
    event.preventDefault();
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    showLoading();
    const userId = document.getElementById('deleteUserId').value;

    const mutation = `
        mutation {
            deleteUser(id: ${userId})
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('deleteUserForm').reset();
        setTimeout(queryUsers, 500);
    }
}

async function createProduct(event) {
    event.preventDefault();
    showLoading();

    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const sellerId = parseInt(document.getElementById('productSellerId').value);

    const mutation = `
        mutation {
            createProduct(
                name: "${name}"
                price: ${price}
                stock: ${stock}
                seller_id: ${sellerId}
            ) {
                id
                name
                price
                stock
                seller_id
            }
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('createProductForm').reset();
        setTimeout(queryProducts, 500);
    }
}

async function updateProductStock(event) {
    event.preventDefault();
    showLoading();

    const productId = parseInt(document.getElementById('updateProductId').value);
    const sellerId = parseInt(document.getElementById('updateSellerId').value);
    const stock = parseInt(document.getElementById('updateStock').value);

    const mutation = `
        mutation {
            updateProductStock(
                product_id: ${productId}
                seller_id: ${sellerId}
                stock: ${stock}
            ) {
                id
                name
                price
                stock
                seller_id
            }
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('updateStockForm').reset();
        setTimeout(queryProducts, 500);
    }
}

async function deleteProduct(event) {
    event.preventDefault();
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    showLoading();
    const productId = parseInt(document.getElementById('deleteProductId').value);
    const sellerId = parseInt(document.getElementById('deleteProductSellerId').value);

    const mutation = `
        mutation {
            deleteProduct(
                product_id: ${productId}
                seller_id: ${sellerId}
            )
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('deleteProductForm').reset();
        setTimeout(queryProducts, 500);
    }
}

async function createOrder(event) {
    event.preventDefault();
    showLoading();

    const userId = parseInt(document.getElementById('orderUserId').value);
    const productId = parseInt(document.getElementById('orderProductId').value);
    const quantity = parseInt(document.getElementById('orderQuantity').value);

    const mutation = `
        mutation {
            createOrder(
                user_id: ${userId}
                product_id: ${productId}
                quantity: ${quantity}
            ) {
                id
                user_id
                product_id
                product_name
                quantity
                price
                total_price
                created_at
            }
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('createOrderForm').reset();
        setTimeout(() => {
            queryOrders();
            queryProducts();
        }, 500);
    }
}

async function deleteOrder(event) {
    event.preventDefault();
    if (!confirm('Are you sure you want to delete this order?')) {
        return;
    }

    showLoading();
    const orderId = parseInt(document.getElementById('deleteOrderId').value);

    const mutation = `
        mutation {
            deleteOrder(id: ${orderId})
        }
    `;

    const data = await graphqlRequest(mutation);
    displayResults(data);
    
    if (!data.errors) {
        document.getElementById('deleteOrderForm').reset();
        setTimeout(queryOrders, 500);
    }
}

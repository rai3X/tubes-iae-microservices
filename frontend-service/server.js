const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:4000/graphql';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.error = req.session.error;
  res.locals.success = req.session.success;
  delete req.session.error;
  delete req.session.success;
  next();
});

async function graphqlRequest(query) {
  try {
    const response = await axios.post(GATEWAY_URL, {
      query: query
    });
    return response.data;
  } catch (error) {
    console.error('GraphQL Error:', error.message);
    return { errors: [{ message: error.message }] };
  }
}

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    if (req.session.user.role !== role) {
      return res.redirect(`/dashboard/${req.session.user.role}`);
    }
    next();
  };
};

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect(`/dashboard/${req.session.user.role}`);
  }
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect(`/dashboard/${req.session.user.role}`);
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
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
    
    if (data.errors) {
      return res.render('login', { error: data.errors[0].message });
    }

    const user = data.data.users.find(u => u.email === email);
    
    if (!user) {
      return res.render('login', { error: 'Email tidak ditemukan' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect(`/dashboard/${user.role}`);
  } catch (error) {
    res.render('login', { error: 'Terjadi kesalahan saat login' });
  }
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect(`/dashboard/${req.session.user.role}`);
  }
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { name, email, role } = req.body;

  try {
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
    
    if (data.errors) {
      return res.render('register', { error: data.errors[0].message });
    }

    req.session.user = {
      id: data.data.createUser.id,
      name: data.data.createUser.name,
      email: data.data.createUser.email,
      role: data.data.createUser.role
    };

    res.redirect(`/dashboard/${data.data.createUser.role}`);
  } catch (error) {
    res.render('register', { error: 'Terjadi kesalahan saat registrasi' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/dashboard/user', requireAuth, requireRole('user'), async (req, res) => {
  try {
    const productsQuery = `
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

    const ordersQuery = `
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

    const [productsData, ordersData] = await Promise.all([
      graphqlRequest(productsQuery),
      graphqlRequest(ordersQuery)
    ]);

    const products = productsData.data?.products || [];
    const allOrders = ordersData.data?.orders || [];
    const userOrders = allOrders.filter(o => o.user_id == req.session.user.id);

    res.render('dashboard-user', {
      user: req.session.user,
      products: products,
      orders: userOrders,
      error: res.locals.error,
      success: res.locals.success
    });
  } catch (error) {
    res.render('dashboard-user', {
      user: req.session.user,
      products: [],
      orders: [],
      error: 'Gagal memuat data'
    });
  }
});

app.get('/dashboard/seller', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const productsQuery = `
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

    const ordersQuery = `
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

    const [productsData, ordersData] = await Promise.all([
      graphqlRequest(productsQuery),
      graphqlRequest(ordersQuery)
    ]);

    const allProducts = productsData.data?.products || [];
    const sellerProducts = allProducts.filter(p => p.seller_id == req.session.user.id);
    
    const allOrders = ordersData.data?.orders || [];
    const sellerOrders = allOrders.filter(o => {
      const product = allProducts.find(p => p.id == o.product_id);
      return product && product.seller_id == req.session.user.id;
    });

    res.render('dashboard-seller', {
      user: req.session.user,
      products: sellerProducts,
      orders: sellerOrders,
      error: res.locals.error,
      success: res.locals.success
    });
  } catch (error) {
    res.render('dashboard-seller', {
      user: req.session.user,
      products: [],
      orders: [],
      error: 'Gagal memuat data'
    });
  }
});

app.post('/order/create', requireAuth, requireRole('user'), async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
    const mutation = `
      mutation {
        createOrder(
          user_id: ${req.session.user.id}
          product_id: ${product_id}
          quantity: ${parseInt(quantity)}
        ) {
          id
          product_name
          quantity
          total_price
        }
      }
    `;

    const data = await graphqlRequest(mutation);
    
    if (data.errors) {
      req.session.error = data.errors[0].message;
    } else {
      req.session.success = 'Order berhasil dibuat!';
    }
  } catch (error) {
    req.session.error = 'Gagal membuat order';
  }

  res.redirect('/dashboard/user');
});

app.post('/product/create', requireAuth, requireRole('seller'), async (req, res) => {
  const { name, price, stock } = req.body;

  try {
    const mutation = `
      mutation {
        createProduct(
          name: "${name}"
          price: ${parseInt(price)}
          stock: ${parseInt(stock)}
          seller_id: ${req.session.user.id}
        ) {
          id
          name
          price
          stock
        }
      }
    `;

    const data = await graphqlRequest(mutation);
    
    if (data.errors) {
      req.session.error = data.errors[0].message;
    } else {
      req.session.success = 'Produk berhasil ditambahkan!';
    }
  } catch (error) {
    req.session.error = 'Gagal menambahkan produk';
  }

  res.redirect('/dashboard/seller');
});

app.post('/product/update-stock', requireAuth, requireRole('seller'), async (req, res) => {
  const { product_id, stock } = req.body;

  try {
    const mutation = `
      mutation {
        updateProductStock(
          product_id: ${parseInt(product_id)}
          seller_id: ${req.session.user.id}
          stock: ${parseInt(stock)}
        ) {
          id
          name
          stock
        }
      }
    `;

    const data = await graphqlRequest(mutation);
    
    if (data.errors) {
      req.session.error = data.errors[0].message;
    } else {
      req.session.success = 'Stok produk berhasil diupdate!';
    }
  } catch (error) {
    req.session.error = 'Gagal update stok';
  }

  res.redirect('/dashboard/seller');
});

app.post('/product/delete', requireAuth, requireRole('seller'), async (req, res) => {
  const { product_id } = req.body;

  try {
    const mutation = `
      mutation {
        deleteProduct(
          product_id: ${parseInt(product_id)}
          seller_id: ${req.session.user.id}
        )
      }
    `;

    const data = await graphqlRequest(mutation);
    
    if (data.errors) {
      req.session.error = data.errors[0].message;
    } else {
      req.session.success = 'Produk berhasil dihapus!';
    }
  } catch (error) {
    req.session.error = 'Gagal menghapus produk';
  }

  res.redirect('/dashboard/seller');
});

app.post('/order/delete', requireAuth, requireRole('user'), async (req, res) => {
  const { order_id } = req.body;

  try {
    const mutation = `
      mutation {
        deleteOrder(id: ${parseInt(order_id)})
      }
    `;

    const data = await graphqlRequest(mutation);
    
    if (data.errors) {
      req.session.error = data.errors[0].message;
    } else {
      req.session.success = 'Order berhasil dihapus!';
    }
  } catch (error) {
    req.session.error = 'Gagal menghapus order';
  }

  res.redirect('/dashboard/user');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend Service running at http://localhost:${PORT}`);
  console.log(`Gateway URL: ${GATEWAY_URL}`);
});


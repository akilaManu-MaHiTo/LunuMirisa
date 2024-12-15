const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Local imports
const conDatabase = require('./database');
const USER = require('./controllers/UserController');
const EMPLOYEE = require('./controllers/EmployeeController');
const IMAGE = require('./controllers/ImageController');
const LOGIN = require('./controllers/LoginController');
const MENU = require('./controllers/AddMenuController');
const CART = require('./controllers/CartController');
const INVENTORY = require('./controllers/InventoryController');
const TABLE = require('./controllers/TableController');
const SUPPLIERORDER = require('./controllers/SupplierOrderController');
const SIGN = require('./controllers/SignUpController');
const SUPPLIERCATEGORY = require('./controllers/SupplierCategoryController');
const SUPPLIERPROFILE = require('./controllers/SupplierProfileController');
const PROFILEPIC = require('./controllers/ProfilePictureController');
const INVENTORYORDERS = require('./controllers/InventoryOrderController');
const ADDEMPLOYEE = require('./controllers/AddEmployee');
const RESERVEDTABLES = require('./controllers/ReservedTables');
const INTABLEORDER = require('./controllers/InOrderTableController');
const INORDER = require('./controllers/InOrderController');
const CARTFORM = require('./controllers/CartFormController');
const RATINGS = require('./controllers/ReviewController');
const Leave = require('./controllers/leaveRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: "https://lunu-mirisalk.vercel.app",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', USER);
app.use('/', EMPLOYEE);
app.use('/', IMAGE);
app.use('/', LOGIN);
app.use('/', MENU);
app.use('/', CART);
app.use('/', INVENTORY);
app.use('/', TABLE);
app.use('/', SUPPLIERORDER);
app.use('/', SIGN);
app.use('/', SUPPLIERCATEGORY);
app.use('/', SUPPLIERPROFILE);
app.use('/', PROFILEPIC);
app.use('/', INVENTORYORDERS);
app.use('/', ADDEMPLOYEE);
app.use('/', RESERVEDTABLES);
app.use('/', INTABLEORDER);
app.use('/', INORDER);
app.use('/', CARTFORM);
app.use('/', RATINGS);
app.use('/', Leave);

// Default route for root
app.get('/', (req, res) => {
    res.send('Welcome to the backend API!');
});

// Handle unmatched routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Connect to database and start server
const PORT = process.env.PORT || 3001;

conDatabase()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit process on DB connection failure
    });

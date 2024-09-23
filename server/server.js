const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Local imports
const conDatabase = require('./database');
const USER = require('./controllers/UserController')
const EMPLOYEE = require('./controllers/EmployeeController')
const IMAGE = require ('./controllers/ImageController')
const LOGIN = require ('./controllers/LoginController')
const MENU = require ('./controllers/AddMenuController')
const CART = require ('./controllers/CartController')
const INVENTORY = require ('./controllers/InventoryController')
const TABLE = require ('./controllers/TableController')
const SUPPLIERORDER = require ('./controllers/SupplierOrderController')
const SIGN = require ('./controllers/SignUpController')
const SUPPLIERCATEGORY = require ('./controllers/SupplierCategoryController')
const SUPPLIERPROFILE = require ('./controllers/SupplierProfileController')
const PROFILEPIC = require ('./controllers/ProfilePictureController')
const INVENTORYORDERS = require ('./controllers/InventoryOrderController')
const ADDEMPLOYEE = require ('./controllers/AddEmployee')
const RESERVEDTABLES =require('./controllers/ReservedTables')
const INTABLEORDER = require ('./controllers/InOrderTableController')
const INORDER = require ('./controllers/InOrderController')
const CARTFORM = require ('./controllers/CartFormController')


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

//handle routing
app.use('/',USER)
app.use('/',EMPLOYEE)
app.use('/',IMAGE)
app.use('/',LOGIN)
app.use('/',MENU)
app.use('/',CART)
app.use('/',INVENTORY)
app.use('/',TABLE)
app.use('/',SUPPLIERORDER)
app.use('/',SIGN)
app.use('/',SUPPLIERCATEGORY)
app.use('/',SUPPLIERPROFILE)
app.use('/',PROFILEPIC)
app.use('/',INVENTORYORDERS)
app.use('/',ADDEMPLOYEE)
app.use('/',RESERVEDTABLES)
app.use('/',INTABLEORDER)
app.use('/',INORDER)
app.use('/',CARTFORM)




conDatabase()
    .then(data => {
        console.log('Database Connected...');

        const server = app.listen(3001, () => {
            console.log('Server Started at 3001');
        }).on('error', err => {
            console.log('Server not started', err);
        });

        // Export the server for use in other files
        module.exports = server;
    })
    .catch(err => console.log('Database connection error:', err));

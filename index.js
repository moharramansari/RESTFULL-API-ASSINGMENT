const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin", "X-requested-With", "Content-Type", "Accept", "Authorization"
    );

    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

mongoose.Promise = global.Promise;

app.use('/products', productRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})



app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

const uri = 'mongodb+srv://moharram1:moharram12@cluster0.chesped.mongodb.net/?retryWrites=true&w=majority';

async function connect(){
    try{
        await mongoose.connect(uri)
        console.log('Connected to the MongoDB..')
    }catch(err){
        console.error(err);
    }
}

connect();

app.listen(3000, () => {
    console.log('Server is listening...')
})

module.exports = app;
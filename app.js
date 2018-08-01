const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1:27017');
const cors = require('cors');

const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())


app.set('view engine', 'pug');
// this is where we can put the public contents like css and js files
app.use(express.static(__dirname + '/public'));


//protege el contenido web de fallas
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
);
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
next();
});


app.use("/users", userRoutes);


app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{    
        message: error.message
    }
    });
});

module.exports = app;
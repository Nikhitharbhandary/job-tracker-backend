const express= require("express");
const cors= require("cors");
require('dotenv').config();
const app= express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const jobRoutes = require('./routes/job');

app.use('/users', userRoutes);
// app.use('/products', productRoutes);
app.use('/jobs', jobRoutes);

app.listen(port, ()=>{
    console.log("Running on port", port);
})

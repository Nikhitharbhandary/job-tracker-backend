const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');
const multer= require("multer");
const app= express();
const path= require('path');

app.use('uploads', express.static('uploads'));

const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/');
    },
    filename:(req, file,cb)=>{
        const uniqueName =  file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({storage :storage});
router.get("/products",verifyToken, (req, res)=>{
    sql= "SELECT * FROM products";
    db.query(sql, (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while fetching data"});
            return;
        }
        res.json({
            message: "Products fetched",
            user: req.user,
            data: result
        });
    })
})
router.get("/products_id", (req, res)=>{
    sql= "SELECT * FROM products WHERE id=?";
    const id= req.query.id;
    db.query(sql,[id], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while fetching data"});
            return;
        }
        res.json(result[0]);
    })
});
router.post("/add-product", verifyToken,(req, res)=>{
    const {name, price}=req.body;
    console.log("Received data is ", req.body);
    sql= "INSERT INTO products (name, price)VALUES (?, ?)";
    db.query(sql, [name, price], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while adding data"});
            return;
        }
        res.json({
            message: "product added successfully"
        });
    })
})
router.post("/update-product", (req, res)=>{
    const {name, price, id}=req.body;
    sql= "UPDATE products set name =?, price =? WHERE id =?";
    db.query(sql, [name, price, id], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while updating data"});
            return;
        }
        res.json({
            message: "product Updated successfully"
        });
    })
});
router.delete("/delete-product", (req, res)=>{
    const id= req.query.id;
    sql= "DELETE FROM  products WHERE id= ? ";
    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while deleting data"});
            return;
        }
        res.json({
            message: "product deleted successfully"
        });
    })
});

router.post("/add-file", upload.single('product_image'),(req, res)=>{
    const name = req.body.name;
    const product_image= req.file.filename;
    console.log("Received data is ", req.body);
    sql= "INSERT INTO products (name, image)VALUES (?, ?)";
    db.query(sql, [name, product_image], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while adding data"});
            return;
        }
        res.json({
            message: "product added successfully"
        });
    })
})
module.exports=router;

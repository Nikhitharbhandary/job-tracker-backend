
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


router.post("/user-login", (req, res)=>{
    sql= "SELECT * FROM user WHERE username= ? ";
    const {username, password}=req.body;
    console.log("login response is ", req.body);
    db.query(sql,[username], async (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while fetching data"});
            return;
        }
        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const user=result[0];
        const isMatch= await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const payload={
            id: user.id,
            username:user.username
        };
        const token=jwt.sign(payload, JWT_SECRET,{expiresIn :'1h'});
       res.status(200).json({
            message: "login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    })
});


router.post("/user-insert", (req, res)=>{
    checkuser= "SELECT * FROM user WHERE username= ? ";
    console.log("insert data is ", req.body);
    const {username, password}=req.body;
    db.query(checkuser,[username],async (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while fetching data"});
            return;
        }
        if (result.length > 0) {
            return res.status(409).json({ error: "Already exist" });
        }
        try{
            const hashedPassword= await bcrypt.hash(password,10);
             
            const inseruser= "INSERT INTO user(username, password) VALUES (?, ?)";
            db.query(inseruser, [username, hashedPassword], (err, result)=>{
                if(err){
                    console.log("error while inserting user", err);
                    res.status(500).json({error:"Error while inserting user"});
                    return;
                }
                res.json({
                    message: "user added successfully"
                });
            })
            console.log("hashed password is", hashedPassword);
        }
        catch(err){
            res.status(500).json({ message: "Error hashing password" });
        }
    })
});
module.exports=router;

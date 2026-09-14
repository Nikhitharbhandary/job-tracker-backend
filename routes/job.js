const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

router.post("/add-job", verifyToken,(req, res)=>{
    const {cname, role, status, location, note,applied_date, user_id}=req.body;
    console.log("Received data is ", req.body);
    sql= "INSERT INTO jobs (cname, role, status, location, note,applied_date, user_id)VALUES (?, ?, ?, ?,?,?,?)";
    db.query(sql, [cname, role, status, location, note,applied_date, user_id], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while adding data"});
            return;
        }
        res.json({
            message: "job added successfully"
        });
    })
})
router.get("/jobs",verifyToken, (req, res)=>{
    sql= "SELECT * FROM jobs";
    db.query(sql, (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while fetching data"});
            return;
        }
        res.json({
            message: "jobs fetched",
            user: req.user,
            data: result
        });
    })
})
router.get("/job_id", (req, res)=>{
    const sql = "SELECT *, DATE_FORMAT(applied_date, '%Y-%m-%d') AS applied_date FROM jobs WHERE id = ?";
    const id= req.query.id;
    db.query(sql,[id], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while fetching data"});
            return;
        }
        console.log(result[0]);
        res.json(result[0]);
    })
});
router.post("/update-job", (req, res)=>{
    const {cname, role,status, location, note,applied_date, id}=req.body;
    sql= "UPDATE jobs set cname =?, role =?, status=?, location=?, note=?,applied_date=? WHERE id =?";
    db.query(sql, [cname, role,status, location, note,applied_date, id], (err, result)=>{
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

router.delete("/delete-job", (req, res)=>{
    const id= req.query.id;
    sql= "DELETE FROM  jobs WHERE id= ? ";
    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log("error", err);
            res.status(500).json({error:"Error while deleting data"});
            return;
        }
        res.json({
            message: "job deleted successfully"
        });
    })
});
module.exports=router;

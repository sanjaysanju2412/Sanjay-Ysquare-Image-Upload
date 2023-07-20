const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require ("path");

const app = express()

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) =>{
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"6380804401",
    database:"imagegallery"
});

app.post('/upload',upload.single('image_name'),(req, res)=> {
    const image = req.file.filename;
    const imagepath = 'localhost:8800/public/images'
    const sql = "INSERT INTO gallery(image_url,image_name)VALUES(?,?)";
    db.query(sql, [imagepath,image], (error,result) =>{
        if(error) return res.json({Message: "Error"});
        return res.json({Status: "Success"});
    })
})

app.get('/', (req, res) => {
    const sql = 'select * from gallery';
    db.query(sql, (error,result) => {
        if(error) return res.json("Error");
        return res.json(result);
    })
})

app.post('/delete', (req, res) => {
    let id = req.body.id
    const sql = 'delete from gallery where id=?';
    db.query(sql, [id],(error,result)=>{
        if(error){
            let s={"status":"error"}
            console.log(error)
            res.send(s);

        }
        else{
            let s={"status":"success"}
            res.send(s);
        }
    })
})
app.listen(8800, ()=>{
    console.log("Connect the backend!!")
})
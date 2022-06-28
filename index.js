const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const app = express();
const notes = require("./model/notes")
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

const connectDB = async() => {
    try{
        let mongodbUri = process.env.mongodbUri;
        await mongoose.connect(mongodbUri,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Database Connected...");
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

app.get("/", async(req,res)=>{
    const data = await notes.find();
    res.send(data);
})

app.post("/", async(req,res) => {
    var newNote = new notes({title: req.body.title, content: req.body.content});
    await newNote.save(async function(err, data) {
        if(err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
})

app.delete("/:id", async(req,res) => {
    await notes.findByIdAndRemove(req.params.id);
    const data = await notes.find();
    res.send(data);
})

app.listen(5000, async (err) => {
    if(err){
        console.log(err);
    }else{
        await connectDB();
        console.log("Server running on port 5000.");
    }
})
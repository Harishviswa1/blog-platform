const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const fs = require('fs'); 

let initial_path = path.join(__dirname, "frontend");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})


app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();

    let imagename = date.getDate() + date.getTime() + file.name;

    let uploadPath = path.join(__dirname, 'frontend', 'uploads', imagename);

    const uploadsDir = path.join(__dirname, 'frontend', 'uploads');
    if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir, { recursive: true }); 
    }


    file.mv(uploadPath, (err, result) => {
        if(err){
            throw err;
        } else{
            res.json(`uploads/${imagename}`)
        }
    })
})

app.get("/dashboard",(req,res)=>{
    res.sendFile(path.join(initial_path,"dashboard.html"));
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.use((req, res) => {
    res.json("404");
})

app.listen("3000", () => {
    console.log('listening......');
})

var express=require('express');
var app=express()
var bodyParser=require('body-parser')
var mongoose= require('mongoose')
var imgModel= require('./model');
var multer = require('multer');
var fs=require('fs')
var path=require('path')
require('dotenv/config')





mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }, err=>{
        console.log('connected')
    });


    app.use(bodyParser.urlencoded({
        extended: false
    }))

    app.use(bodyParser.json())

    app.set("view engine", "ejs");


    var storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads')
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+"-"+Date.now())
        }
    });
    var upload=multer({storage: storage});


    app.get('/',(req,res)=>{
        imgModel.find({},(err,items)=>{
            if(err)
            {
                console.log(err);
                res.status(500).send('An error occured',err);

            }
            else{
                res.render('imagePage',{items:items});

            }
        });
    });


    app.post('/', upload.single('image'),(req,res,next)=>{
        var obj={
            name:req.body.name,
            desc:req.body.desc,
            img:{
                data:fs.readFileSync(path.join(__dirname+'/uploads'+req.file.filename)),
                contentType:'image/png'
            }
        }
        imgModel.create(obj,(err,itenm)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect('/')
            }
        });
    });


    var port=process.env.PORT || '3000'

    app.listen(port,err=>{
        if(err)
        
        throw err
        console.log('server listening to port',port)
        
    })

    
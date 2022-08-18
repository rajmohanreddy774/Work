var mongoose=require('mongoose')

var userSchema=new mongoose.Schema({
    name:String,
    desc:String,
    img:{
        data: Buffer,
        contentType:String
    }
});


module.exports=new mongoose.model('Image', userSchema);
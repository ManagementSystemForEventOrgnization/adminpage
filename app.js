const express = require('express');
const app = express();
const keys = require('./config/key');
const mongoose = require('mongoose');

mongoose.connect(keys.mongoURI,  {useNewUrlParser: true, useUnifiedTopology: true,'useCreateIndex': true, useFindAndModify: false });

require('./config/configApp')(app);
require('./config/loadMongoose');
require('./config/pushRouter')(app);


//Xử lý error 404
// app.use((req, res, next)=>{
//     res.render('404', {layout: false});
// })

//Xử lý lỗi tổng quát
// app.use((error,req, res, next)=>{
//     res.render('errors', {
//         layout: false, 
//         message: error.message, 
//         error
//     })
// })
app.listen(process.env.PORT || 3000, () => {
    console.log('http://localhost:3000');
})
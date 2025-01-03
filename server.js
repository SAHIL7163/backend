
require('dotenv').config();

const express =require('express');
const session = require('express-session');
const app =express();
const  cors =require('cors');
const corseOptions=require('./Config/corsOptions')
const  {Logger}=require('./middleware/logevent');
const  errorhandler=require('./middleware/errorhandler');
const verifyJWT =require('./middleware/verifyJWT');
const cookieParser =require('cookie-parser');
const credentials = require('./middleware/credentials');
const path=require('path');
const passport = require('passport');

const mongoose = require('mongoose');
const connectDB =require('./Config/dbConn');
const MongoStore = require('connect-mongo');
const PORT = process.env.PORT || 3500 ;

const { initializePassport } = require('./Controller/googleauthController');


//Connect to MongoDB
connectDB();


///custom middleware
app.use(Logger);


//Handle options credentials check-brfore cors
//and fetch cookies credentials requirement
app.use(credentials);


///cross access
app.use(cors(corseOptions));

//built
app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

/* app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET ,// Replace with your own secret key
    resave: false,
    saveUninitialized: true ,
    cookie : {secure : false },
})
); */


// Session management middleware
app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ // Configure connect-mongo for session storage
        mongoUrl: process.env.DATABASE_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
})); 





app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

/* app.get('^/$|/index(.html)?',(req,res)=>
{
 //  res.sendFile('./views/index.html',{ root:__dirname });
     res.sendFile(path.join(__dirname ,'views','index.html'));
});
app.get('/new-page(.html)?',(req,res)=>
{
   res.sendFile(path.join(__dirname ,'views','new-page.html'));
})
app.get('/old-page(.html)?',(req,res)=>
{ 
    res.redirect(301,'/new-page.html');  //302 by default

})  */
 
/* app.use('/' , express.static(path.join(__dirname,'public')));
app.use('/subdir',express.static(path.join(__dirname,'public')));
app.use('/employee' , express.static(path.join(__dirname,'public'))); */
app.use('/public' , express.static(path.join(__dirname,'public')));


//app.use('/' ,require('./router/root'));
app.use('/subdir',require('./router/subdir'));
app.use('/register',require('./router/register'));
app.use('/refresh',require('./router/refresh'));
app.use('/logout',require('./router/logout'));
app.use('/auth',require('./router/auth'));
app.use('/auth/google',require('./router/googleauth'));

app.use('/posts' , require('./router/api/posts'));

app.use('/payment',require('./router/payment'));

app.use(errorhandler);


//app.use(verifyJWT);
//app.use('/users', require('./router/api/users'));
//app.use('/employees',require('./router/api/employees'));  

 mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}); 
 
 //app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));  

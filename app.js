require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const {isActiveRoute} = require('./server/helpers/routerHelpers');
const app = express();
const PORT = process.env.PORT || 5000;


//connect to DB

connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
  store:MongoStore.create({
    mongoUrl:process.env.MONGODB_URI
  }),
}));

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

app.locals.isActiveRoute = isActiveRoute;




app.use(expressLayout);
app.use(methodOverride('_method'));
app.set('layout', './layouts/main');
app.set('view engine','ejs');

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT,()=>{
  console.log(`App listening on port ${PORT}`);
})
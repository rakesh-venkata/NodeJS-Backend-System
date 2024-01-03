//Node.js Backend-System
//Backend => NodeJS HTTP server + Database + Authentication
//server => should handle requests(process request and return response)

//NODEMON- Automatically restart the server
//install the nodemon using npm
//using npx nodemon filename.js(this will automatically rerun the file,if changes are made)

//Authentication
//Encryption is converting credentials to token ,and getting back credentails from token
//Hashing is only on way
//Here for every encryption method we need a unique secret key
//Use jsonwebtoken library for implementing encrption(sign()),decryption(verify())

//Mangoose
//It is a JS library that is used to connect to mongodb cluster,and give us methods to work on that cluster
//cluster contains many databases
//each database contains collections(tables)
//each collections contains documents(row)

const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');




mongoose.connect("mongodb+srv://19131a04d1:v7IeFiv28kUGDsoC@cluster0.trhnljw.mongodb.net/"); //use your connection string here.
//Bydefault it assigns some test database,to provide yours add database_name after '/' at last.( /database_name ).



const app = express()
const port = 3000;


const secretkey = "YOUR_SECRET_KEY";

app.use(bodyParser.json()); //common middleware

//define schemas
const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    purchasedCourses : [{type : mongoose.Schema.Types.ObjectId, ref :  'Courses'}]
});

const adminSchema = new mongoose.Schema({
    username : String,
    password : String
});

const courseSchema = new mongoose.Schema({
    random : String,
    title : String,
    description : String,
    price : Number,
    imageLink : String,
    published : Boolean
});

//create models

const Admins = mongoose.model('Admins',adminSchema);
const Users = mongoose.model('Users',userSchema);
const Courses = mongoose.model('Courses',courseSchema);




const userAuthentication = (req, res, next) => {
    var user = USERS.find(a => a.username === req.headers.username && a.password === req.headers.password);
    if (user){
        req.user = user;
        next();
    } else {
        res.status(403).send('Authentication failed');
    }
};

const generateJwt = (user) => {
    const payload = {username: user.username}
    return jwt.sign(payload,secretkey, {expiresIn : '1h'});
}

const authenticateJwt = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretkey, (err, user) => {
            if (err){
                return res.sendStatus(403);
            }
            else {
                req.user = user;
                next();
            }
        });
        
    }else {
        res.sendStatus(401);
    }
}

app.post('/admin/signup', async (req, res) => {
    const {username, password} = req.body;
    
    //const existingAdmin = ADMINS.find(a => a.username === admin.username);
    const existingAdmin = await Admins.findOne({username});
    console.log(existingAdmin);
    if (existingAdmin){
        res.status(403).json({message:'Admin already exists'});

    }else {
        const newAdmin = new Admins({username, password});
        await newAdmin.save();
        const token = generateJwt({username, password});
        res.json({message : 'Admin created successfully', token });
    }
});

app.post('/admin/login', async (req, res) => {
    const {username, password} = req.headers;
    const admin = await Admins.findOne({username, password});
    if (admin){
        const token = generateJwt(admin);
        res.json({message :'Loggin successful', token});
    }else {
        res.status(403).json({message : 'Admin auuthentication failed'});
    }
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {  //authenticateJwt is route specific middleware
    const course = req.body;
    course.courseId = Date.now();
    course.random = "hi";
    const newCourse  = new Courses(course);
    console.log(newCourse);
    await newCourse.save();
   
    
    res.json({message : 'Course created successfully',courseId : course.courseId});
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
    const courseId = parseInt(req.params.courseId);
    const course = await Courses.findByIdAndUpdate({courseId},req.body);
    if (course) {
        
        res.json({message : 'Course updated successfully'});
    } else {
        res.status(404).send({message : 'Course not found'});
    }
});

app.get('/admin/courses' , authenticateJwt, async (req, res) => {
    const courses = await Courses.find({});
    res.json({courses});
});

//use diffrent encryption secretkey for token generation
app.post('/user/signup', (req, res) => {
    var user = {...req.body, purchasedCourses: []};
    USERS.push(user);
    res.json({message : "Registered Successfully" });
    
});

app.post('/user/login', userAuthentication, (req, res) => {
    res.json({message : "Login Successfully" });
});

app.get('/user/courses', userAuthentication, (req, res) => {
    res.json({courses: COURSES.filter(c => c.published)});
});

app.post('/user/courses/:courseId', userAuthentication, (req, res) => {
     var course = COURSES.find(c => c.id === req.params.courseId);
     if (course) {
        req.user.purchasedCourses.push(course);
        res.send('successfully purchased successfully');
     }else {
        res.send('Purchase unsuccessful');
     }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
    const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
    res.json({courses: purchasedCourses});
})

app.listen(app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  }));

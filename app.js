const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const app = express()
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')


// connecting the database to the uri or url of our app 
mongoose.connect('mongodb://localhost:27017/koja-berim', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// creating the error handling phase of starting database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DataBase Connected')
});

// to tell express to parse the information comes from the req body into JSON
app.use(express.urlencoded({ extended: true }))
//
app.use(methodOverride('_method'))




// telling express that we are using ejs as the templating language
app.set('view engine', 'ejs')
// telling express that our path to views directory is this(making views directory an absolute directory)
app.set('views', path.join(__dirname, 'views'))
// telling expresss that we are using ejsmate as the partial creator.
app.engine('ejs', ejsMate)
//
app.use(express.static(path.join(__dirname, 'public')))

const sessionCofig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionCofig))
app.use(flash())


app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


//
app.use('/campgrounds', campgrounds)
//
app.use('/campgrounds/:id/reviews', reviews)



// root route of webapp
app.get('/', (req, res) => {
    res.render('home')
})










app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})



app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err
    if (!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error', { err })
})



// Rah andazi server 
app.listen(3000, () => {
    console.log('Serving on port 3000')
})
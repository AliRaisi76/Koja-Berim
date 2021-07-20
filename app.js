if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const app = express()
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const Campground = require('./models/campground')
const helmet = require('helmet')

const mongoSanitize = require('express-mongo-sanitize')



const userRoutes = require('./routes/users')
const residenceRoutes = require('./routes/residence')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const { serializeUser } = require('passport')
const { contentSecurityPolicy } = require('helmet')
const { Cookie } = require('express-session')


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

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
)

const sessionCofig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}




app.use(session(sessionCofig))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://maxcdn.bootstrapcdn.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",

];
const fontSrcUrls = ["https://maxcdn.bootstrapcdn.com/font-awesome/"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dsocdtkbf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://www.irangazette.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())












app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


//
app.use('/campgrounds', campgroundRoutes)
//
app.use('/campgrounds/:id/reviews', reviewRoutes)
//
app.use('/users', userRoutes)
app.use('/residences' ,residenceRoutes)




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
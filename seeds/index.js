const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers')
// connecting the database to the uri or url of our app 
mongoose.connect('mongodb://localhost:27017/koja-berim', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

// creating the error handling phase of starting database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DataBase Connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '60b9e5f81e2c2c2b04d9aa5e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}  `,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam sunt ullam vero officia corrupti recusandae dolor maiores. Animi, sequi, repudiandae commodi corrupti aspernatur in aliquid, iusto et nulla blanditiis ab.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
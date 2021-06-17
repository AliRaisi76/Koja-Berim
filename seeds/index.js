const mongoose = require('mongoose')
const Campground = require('../models/campground')
const User = require('../models/user')
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
  // await Campground.deleteMany({})
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '60c91e58a8a149090ce208e1',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}  `,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam sunt ullam vero officia corrupti recusandae dolor maiores. Animi, sequi, repudiandae commodi corrupti aspernatur in aliquid, iusto et nulla blanditiis ab.',
      price,
      geometry: {
        "coordinates": [
          cities[random1000].longitude,
          cities[random1000].latitude
        ],
        "type": "Point"
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dsocdtkbf/image/upload/v1622978722/Koja_Berim/hpdcazo8cfhfhscxnfix.jpg',
          filename: 'Koja_Berim/hpdcazo8cfhfhscxnfix'
        },
        {
          url: 'https://res.cloudinary.com/dsocdtkbf/image/upload/v1622978725/Koja_Berim/bs74g8tgyzrqkrfyguux.jpg',
          filename: 'Koja_Berim/bs74g8tgyzrqkrfyguux'
        },
        {
          url: 'https://res.cloudinary.com/dsocdtkbf/image/upload/v1622978729/Koja_Berim/dhcqlkclpcm8rz9di1if.jpg',
          filename: 'Koja_Berim/dhcqlkclpcm8rz9di1if'
        }
      ]
    })
    const user = await User.findById('60c91e58a8a149090ce208e1')
    user.campgrounds.push(camp._id)
    

    await camp.save()
    await user.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
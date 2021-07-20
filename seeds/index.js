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
    const camp = new Campground({
      author: '60d22879516ae909f04faa19',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}  `,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam sunt ullam vero officia corrupti recusandae dolor maiores. Animi, sequi, repudiandae commodi corrupti aspernatur in aliquid, iusto et nulla blanditiis ab.',
      geometry: {
        "coordinates": [
          cities[random1000].longitude,
          cities[random1000].latitude
        ],
        "type": "Point"
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dsocdtkbf/image/upload/v1624385264/Koja_Berim/p9et19jlhtr0qkflkxow.jpg',
          filename: 'Koja_Berim/p9et19jlhtr0qkflkxow'
        }
      ]
    })
    const user = await User.findById('60d22879516ae909f04faa19')
    user.campgrounds.push(camp._id)
    

    await camp.save()
    await user.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
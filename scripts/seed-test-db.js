const mongoose = require('mongoose');

const planets = [
  { id: 1, name: 'Mercury' },
  { id: 2, name: 'Venus' },
  { id: 3, name: 'Earth' },
  { id: 4, name: 'Mars' },
  { id: 5, name: 'Jupiter' },
  { id: 6, name: 'Saturn' },
  { id: 7, name: 'Uranus' },
  { id: 8, name: 'Neptune' }
];

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await mongoose.connection.collection('planets').insertMany(planets);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error('Failed to seed non-production MongoDB:', error);
  process.exitCode = 1;
});

const mongoose = require('mongoose');
// Set strictQuery option to prepare for Mongoose 7
mongoose.set('strictQuery', false);

const Usuario = require('../../models/usuario');
const Preferencias = require('../../models/preferencias');

// Connect to MongoDB - replace with your actual MongoDB URI
// const mongoURI = process.env.DB_MONGO; 
// const mongoURI = 'mongodb://localhost:27017/meetpay'; 
const mongoURI = 'mongodb+srv://mean_user:elaSqidX5XGon7XI@cluster0.9kln7.mongodb.net/meetpay'; 
// Configure mongoose connection
async function connectDB() {
  try {
    // await mongoose.connect(process.env.MONGODB_URI, {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

const usuarios = [
    // Male users
    { first_name: 'Juan', last_name: 'Pérez', email: 'juan1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '1', edad: 25 },
    { first_name: 'Carlos', last_name: 'Gómez', email: 'carlos1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '1', edad: 30 },
    { first_name: 'Luis', last_name: 'Martínez', email: 'luis1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '1', edad: 28 },
    { first_name: 'Andrés', last_name: 'Hernández', email: 'andres1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '1', edad: 35 },
    { first_name: 'Javier', last_name: 'López', email: 'javier1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '1', edad: 22 },
    { first_name: 'Fernando', last_name: 'Ramírez', email: 'fernando1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '1', edad: 27 },
    
    // Female users
    { first_name: 'Sofía', last_name: 'García', email: 'sofia1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '2', edad: 24 },
    { first_name: 'María', last_name: 'Rodríguez', email: 'maria1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '2', edad: 29 },
    { first_name: 'Ana', last_name: 'Fernández', email: 'ana1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '2', edad: 26 },
    { first_name: 'Laura', last_name: 'Torres', email: 'laura1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '2', edad: 31 },
    { first_name: 'Isabel', last_name: 'Morales', email: 'isabel1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '2', edad: 23 },
    { first_name: 'Patricia', last_name: 'Vásquez', email: 'patricia1@test.com', password: '$2a$10$hashedpassword', role: 'USER', genero: '2', edad: 32 },
];

async function seedDatabase() {
    try {
        console.log('Starting seed process...');
        
        // Clear existing data
        await Usuario.deleteMany({});
        await Preferencias.deleteMany({});
        console.log('Cleared existing data');
        
        // Create users and preferences
        for (const userData of usuarios) {
            const user = new Usuario(userData);
            await user.save();
            
            const preferencia = new Preferencias({
                user: user._id,
                gustos: ['música', 'deportes'],
                quiero: ['viajar', 'leer'],
                distancia: { min: 1, max: 100 },
                genero: userData.genero === '1' ? '2' : '1', // Opposite gender preference
                lang: 'es',
                edad: { min: 20, max: 40 }
            });
            await preferencia.save();
        }
        
        console.log('Successfully seeded 12 users (6 male, 6 female) with preferences');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

// Execute the seed
seedDatabase();

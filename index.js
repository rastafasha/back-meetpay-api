require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

//notifications
const webpush = require('web-push');
const bodyParser = require('body-parser');

//crear server de express
const app = express();

const server = require('http').Server(app);



app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const options = {
    cors: {
        // origin: 'http://localhost:4200, http://localhost:4201, http://localhost:4202',
        // origin: 'http://localhost:4200, http://localhost:4201, http://localhost:4202, http://localhost:4203, https://adminstorenodejs.malcolmcordova.com, https://storepwa.malcolmcordova.com, ',
        origin: '*'
    },
};


//sockets
const io = require('socket.io')(server, options);

io.on('connection', function(socket) {

    const idHandShake = socket.id; //genera un id unico por conexion

    let { nameRoom } = socket.handshake.query;

    // console.log(`${chalk.green(`Nuevo dispositivo: ${handshake}`)} conentado a la ${nameRoom}`);

    console.log(`Hola dispositivo: ${idHandShake} se unio a ${nameRoom}`);
    socket.join(nameRoom);


    socket.on('evento', (res) => {
        // const data = res;
        // console.log(res);

        // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje   
        socket.to(nameRoom).emit('evento', res); // envia los datos solo a los integrantes de la sala

        // socket.emit(nameRoom).emit('evento', res);//usando emit transmite a todos incluyendo a la persona que envia

    });

    socket.on('message', (message) => {
        console.log('a user connected');
        console.log('message : ' + message);
        socket.broadcast.emit('message', message);
    });

    socket.on('save-carrito', function(data) {
        io.emit('new-carrito', data);
        console.log(data);
    });


    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});



//lectura y parseo del body
app.use(express.json());

//db
dbConnection();

//directiorio publico de pruebas de google
app.use(express.static('public'));


//rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/preferencias', require('./routes/preferencias'));
app.use('/api/usercontact', require('./routes/usercontact'));
// app.use('/api/paises', require('./routes/pais'));

//tienda
app.use('/api/contactos', require('./routes/contacto'));
app.use('/api/galerias', require('./routes/galeria'));
app.use('/api/favoritos', require('./routes/favorito'));
app.use('/api/tipopago', require('./routes/tipopago'));
app.use('/api/transferencias', require('./routes/transferencia'));
app.use('/api/pagoefectivo', require('./routes/pago.efectivo'));


//test
app.get("/", (req, res) => {
  res.json({ message: "Welcome to nodejs." });
});

app.get("/welcome", (req, res) => res.type('html').send(html));

app.use(bodyParser.json());

//notification
const vapidKeys = {
    "publicKey": "BOD_CraUESbh9BhUEccgqin8vbZSKHAziTtpqvUFl8B8LO9zrMnfbectiViqWIsTLglTqEx3c0XsmqQQ5A-KALg",
    "privateKey": "34CA-EpxLdIf8fmJBj2zoDg5OIQIvveBcu7zWkTkPnw"
};

webpush.setVapidDetails(
    'mailto:example@youremail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,

);
//notification


//lo ultimo
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public')); //ruta para produccion, evita perder la ruta
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Backend Malcolm Nodejs!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Backend Nodejs!
    </section>
  </body>
</html>
`



server.listen(process.env.PORT, () => {
    console.log('Servidor en puerto: ' + process.env.PORT);
});
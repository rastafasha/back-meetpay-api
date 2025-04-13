const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, require: true, default: 'USER' },
    
    google: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    twitter: { type: Boolean, default: false },
    terminos: { type: Boolean, default: false },

    username: { type: String, },
    numdoc: { type: String },
    telefono: { type: String, },
    genero: { type: String },
    edad: { type: Number },
    lang: { type: String },
    img: { type: String, },
    pais: { type: String },
    ciudad: { type: String },
    direccion: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    description:{type:String},
    ocupacion:{type:String},
    want_kids:{type:String},
    smoke:{type:String},
    drink:{type:String},

    // preferencia_distancia: { type: String },
    // preferencia_sexo: { type: String },
    // preferencia_lang: { type: String },
    // preferencia_edad: { type: Number },
});

UsuarioSchema.method('toJSON', function() { // modificar el _id a uid, esconde el password
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('user', UsuarioSchema);
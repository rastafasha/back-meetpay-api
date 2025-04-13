var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreferenciasSchema = Schema({
    gustos: { type: Array },
    quiero: { type: Array },
    distancia: { type: String },
    genero: { type: String },
    lang: { type: String },
    edad: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
    user: { type: Schema.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('preferencias', PreferenciasSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserContactSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'user', required: true },
    //agregamos al usuario que seria el contacto agregado
    contact: { type: Schema.ObjectId, ref: 'user', required: true },
    status:{type:Boolean},
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('usercontact', UserContactSchema);
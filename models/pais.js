var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaisSchema = Schema({
    code: { type: String },
    title: { type: String   },
});

module.exports = mongoose.model('pais', PaisSchema);
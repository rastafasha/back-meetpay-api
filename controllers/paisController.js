const { response } = require('express');
const Pais = require('../models/pais');


const listaPaises = async(req, res) => {

    const paises = await Pais.find();
    
        res.json({
            ok: true,
            paises
        });
};



const getPais = async(req, res) => {

    const id = req.params.id;

    Pais.findById(id)
        .exec((err, pais) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pais',
                    errors: err
                });
            }
            if (!pais) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pais con el id ' + id + 'no existe',
                    errors: { message: 'No existe un pais con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                pais: pais
            });
        });

};




module.exports = {
    listaPaises,
    getPais

};
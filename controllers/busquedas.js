const { response } = require('express');
const Usuario = require('../models/usuario');
const Transferencia = require('../models/transferencia');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    /*const usuarios = await Usuario.find({ nombre: regex });
    const medicos = await Medico.find({ nombre: regex });
    const hospitales = await Hospital.find({ nombre: regex });*/

    const [usuarios, transferencias] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Transferencia.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        transferencias,

    });
}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        // case 'transferencias':
        //     data = await Transferencia.find({ nombre: regex })
        //         .populate('nombre img descripcion');
        //     break;


        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        
        case 'transferencias':
            data = await Transferencia.find({ nombre: regex });
            break;



        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla debe ser usuarios'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });

    const [usuarios, transferencias] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Transferencia.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        transferencias

    });
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}
const { response } = require('express');
const Preferencia = require('../models/preferencias');
const Usuario = require('../models/usuario');

const getPreferencias = async(req, res) => {

    const preferencias = await Preferencia.find();

    res.json({
        ok: true,
        preferencias
    });
};

const getPreferencia = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Preferencia.findById(id)
        .exec((err, preferencia) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar payment',
                    errors: err
                });
            }
            if (!preferencia) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El payment con el id ' + id + 'no existe',
                    errors: { message: 'No existe un preferencia con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                preferencia: preferencia
            });
        });

};

const crearPreferencia = async(req, res) => {

    const uid = req.uid;
    try {
        const preferencia = new Preferencia({
            user: uid,
            gustos: req.body.gustos || '',
            quiero: req.body.quiero || '', 
            genero: req.body.genero || req.body.genero || '',
            lang: req.body.lang || '',
            edad: req.body.edad || null,
            distancia: req.body.distancia || ''
        });

        const preferenciaDB = await preferencia.save();
        
        res.json({
            ok: true,
            preferencia: preferenciaDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarPreferenciabyuser = async(req, res) => {
    const userId = req.params.id;
    const uid = req.uid;

    try {
        // Buscar preferencia por ID de usuario
        const preferencia = await Preferencia.findOne({ user: userId });
        
        if (!preferencia) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron preferencias para este usuario'
            });
        }

        const cambiosPreferencia = {
            gustos: req.body.gustos || preferencia.gustos,
            quiero: req.body.quiero || preferencia.quiero,
            genero: req.body.genero || req.body.genero || preferencia.genero,
            lang: req.body.lang || preferencia.lang,
            edad: req.body.edad || preferencia.edad,
            distancia: req.body.distancia || preferencia.distancia,
            user: uid
        };

        const preferenciaActualizado = await Preferencia.findByIdAndUpdate(
            preferencia._id, 
            cambiosPreferencia, 
            { new: true }
        );

        res.json({
            ok: true,
            preferencia: preferenciaActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar preferencias'
        });
    }
};
const actualizarPreferencia = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const Preferencia = await Preferencia.findById(id);
        if (!preferencia) {
            return res.status(500).json({
                ok: false,
                msg: 'preferencia no encontrado por el id'
            });
        }

        const cambiosPreferencia = {
            ...req.body,
            usuario: uid
        }

        const preferenciaActualizado = await Preferencia.findByIdAndUpdate(id, cambiosPreferencia, { new: true });

        res.json({
            ok: true,
            preferenciaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarPreferencia = async(req, res) => {

    const id = req.params.id;

    try {

        const Preferencia = await Preferencia.findById(id);
        if (!preferencia) {
            return res.status(500).json({
                ok: false,
                msg: 'paymentMethod no encontrado por el id'
            });
        }

        await Preferencia.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'paymentMethod eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const listarPorUsuario = (req, res) => {
    var id = req.params['id'];
    Preferencia.find({ user: id }, (err, preferencia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar payment',
                errors: err
            });
        }
        if (!preferencia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El payment con el id ' + id + 'no existe',
                errors: { message: 'No existe un preferencia con ese ID' }
            });

        }
        res.status(200).json({
            ok: true,
            preferencia: preferencia
        });
    });

}


const updateStatus = async(req, res) =>{
    const id = req.params.id;
    const uid = req.uid;

    try {

        const Preferencia = await Preferencia.findById(id);
        if (!preferencia) {
            return res.status(500).json({
                ok: false,
                msg: 'transferencia no encontrado por el id'
            });
        }

        const cambiosPreferencia = {
            ...req.body,
            usuario: uid
        }

        const preferenciaActualizado = await Preferencia.findByIdAndUpdate(id, cambiosPreferencia, { new: true });

        res.json({
            ok: true,
            preferenciaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
}


module.exports = {
    getPreferencias,
    crearPreferencia,
    actualizarPreferencia,
    actualizarPreferenciabyuser,
    borrarPreferencia,
    getPreferencia,
    listarPorUsuario,
    updateStatus
};
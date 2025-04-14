const { response } = require('express');
const Preferencia = require('../models/preferencias');
const UsuarioContact = require('../models/usercontacts');

const crearContacto = async (req, res) => {

    const uid = req.uid;
    try {
        const usuarioContact = new UsuarioContact({
            user: uid,
            contact: req.body.contact,
            status: req.body.status
        });


        const usuarioContactDB = await usuarioContact.save();

        res.json({
            ok: true,
            usuarioContact: usuarioContactDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const listarPorUsuario = async (req, res) => {

    //traemos el uid del usuario
    var id = req.params['id'];
    // buscamos el usuario en la base de datos con los datos del usuario
    try {
        const usuarioContact = await UsuarioContact.find({ user: id });
        res.json({
            ok: true,
            usuarioContact
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }



}

const borrarContacto = async (req, res) => {

    const id = req.params.id;

    try {

        const usuarioContact = await UsuarioContact.findById(id);
        if (!usuarioContact) {
            return res.status(500).json({
                ok: false,
                msg: 'UsuarioContact no encontrado por el id'
            });
        }

        await UsuarioContact.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'UsuarioContact eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const updateStatus = async (req, res) => {
    const id = req.params.id;
    const uid = req.uid;

    try {

        const usuarioContact = await UsuarioContact.findById(id);
        if (!usuarioContact) {
            return res.status(500).json({
                ok: false,
                msg: 'usuarioContact no encontrado por el id'
            });
        }

        const cambiosUsuarioContact = {
            ...req.body,
            usuario: uid
        }

        const usuarioContactActualizado = await UsuarioContact.findByIdAndUpdate(
            id, cambiosUsuarioContact, { new: true });

        res.json({
            ok: true,
            usuarioContactActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
}

const actualizarContacto = async (req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const usuarioContact = await UsuarioContact.findById(id);
        if (!usuarioContact) {
            return res.status(500).json({
                ok: false,
                msg: 'usuarioContact no encontrado por el id'
            });
        }

        const cambiosUsuarioContact = {
            ...req.body,
            usuario: uid
        }

        const usuarioContactActualizado = await UsuarioContact.findByIdAndUpdate(
            id, cambiosUsuarioContact, { new: true });

        res.json({
            ok: true,
            usuarioContactActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

module.exports = {
    listarPorUsuario,
    crearContacto,
    actualizarContacto,
    updateStatus,
    borrarContacto,
};
const { response } = require('express');
const PaymentMethod = require('../models/tipopago');

const getPaymentMethods = async(req, res) => {

    const paymentMethods = await PaymentMethod.find();

    res.json({
        ok: true,
        paymentMethods
    });
};

const getPaymentMethod = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    PaymentMethod.findById(id)
        .exec((err, paymentMethod) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar payment',
                    errors: err
                });
            }
            if (!paymentMethod) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El payment con el id ' + id + 'no existe',
                    errors: { message: 'No existe un paymentMethod con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                paymentMethod: paymentMethod
            });
        });

};

const crearPaymentMethod = async(req, res) => {

    const uid = req.uid;
    const paymentMethod = new PaymentMethod({
        usuario: uid,
        ...req.body
    });

    try {

        const paymentMethodDB = await paymentMethod.save();

        res.json({
            ok: true,
            paymentMethod: paymentMethodDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarPaymentMethod = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const paymentMethod = await PaymentMethod.findById(id);
        if (!payment) {
            return res.status(500).json({
                ok: false,
                msg: 'paymentMethod no encontrado por el id'
            });
        }

        const cambiosPaymentMethod = {
            ...req.body,
            usuario: uid
        }

        const paymentMethodActualizado = await PaymentMethod.findByIdAndUpdate(id, cambiosPaymentMethod, { new: true });

        res.json({
            ok: true,
            paymentMethodActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarPaymentMethod = async(req, res) => {

    const id = req.params.id;

    try {

        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(500).json({
                ok: false,
                msg: 'paymentMethod no encontrado por el id'
            });
        }

        await PaymentMethod.findByIdAndDelete(id);

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
    PaymentMethod.find({ user: id }, (err, data_paymentMethod) => {
        if (!err) {
            if (data_paymentMethod) {
                res.status(200).send({ paymentMethods: data_paymentMethod });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });
}


const updateStatus = async(req, res) =>{
    const id = req.params.id;
    const uid = req.uid;

    try {

        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(500).json({
                ok: false,
                msg: 'transferencia no encontrado por el id'
            });
        }

        const cambiosPaymentMethod = {
            ...req.body,
            usuario: uid
        }

        const paymentMethodActualizado = await PaymentMethod.findByIdAndUpdate(id, cambiosPaymentMethod, { new: true });

        res.json({
            ok: true,
            paymentMethodActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
}


module.exports = {
    getPaymentMethods,
    crearPaymentMethod,
    actualizarPaymentMethod,
    borrarPaymentMethod,
    getPaymentMethod,
    listarPorUsuario,
    updateStatus
};
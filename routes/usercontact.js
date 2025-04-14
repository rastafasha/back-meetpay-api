/*
 Ruta: /api/usercontact
 */

const { Router } = require('express');
const router = Router();
const {
    listarPorUsuario,
    crearContacto,
    actualizarContacto,
    updateStatus,
    borrarContacto,
} = require('../controllers/userContactController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


router.post('/store', [
    validarJWT,
    validarCampos
], crearContacto);

router.put('/update/:id', [
    validarJWT,
    validarCampos
], actualizarContacto);

router.delete('/remove/:id', borrarContacto);

router.get('/user/:id', listarPorUsuario);

router.put('/statusupdate/:id', updateStatus);
 

module.exports = router;
/*
 Ruta: /api/preferencias
 */

 const { Router } = require('express');
 const router = Router();
 const {
     getPreferencias,
     crearPreferencia,
     actualizarPreferencia,
     borrarPreferencia,
     getPreferencia,
     listarPorUsuario,
     actualizarPreferenciabyuser,
     updateStatus
 } = require('../controllers/preferenciaController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getPreferencias);
 router.get('/:id', getPreferencia);
 
 router.post('/store', [
     validarJWT,
     validarCampos
 ], crearPreferencia);
 
 router.put('/update/:id', [
     validarJWT,
     validarCampos
 ], actualizarPreferencia);
 router.put('/userupdate/:id', [
     validarJWT,
     validarCampos
 ], actualizarPreferenciabyuser);
 
 router.delete('/delete/:id', borrarPreferencia);
 
 router.get('/user/:id', listarPorUsuario);
 
 router.put('/statusupdate/:id', updateStatus);
  
 
 module.exports = router;
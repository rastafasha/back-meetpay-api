/*
 Ruta: /api/paises
 */

 const { Router } = require('express');
 const router = Router();
 const {
    listaPaises,
    getPais,
 } = require('../controllers/paisController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 
 router.get('/', listaPaises);
 router.get('/:id', getPais);
 
 
 
 
 module.exports = router;
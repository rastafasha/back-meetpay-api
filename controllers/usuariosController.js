const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario
        .find({}, 'first_name email role google img ') //esto ultimo filtra el resultado
        .skip(desde)
        .sort({ createdAt: -1 })
        .limit(5),
        Usuario.countDocuments()

    ]);
    
    res.json({
        ok: true,
        usuarios,
        total,
        //uid: req.uid
    });
};

const getAllUsers = async(req, res) => {

    const allusuarios = await Usuario.find();
    // .populate('first_name img ');

    res.json({
        ok: true,
        allusuarios
    });
};


const getUsuario = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Usuario.findById(id)
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + 'no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                usuario: usuario
            });
        });
};


const getUsuariobyCedula = async(req, res) => {


        var numdoc = req.params['numdoc'];

        Usuario.findOne({ numdoc: numdoc }).exec((err, numdoc_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (numdoc_data) {
                res.status(200).send({ numdoc: numdoc_data });
            } else {
                res.status(404).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

};
const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    const body = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }
        const usuario = new Usuario({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            role: body.role,
            img: 'default.png',
        });

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar usuario
        await usuario.save();

        //generar el token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


};

const actualizarUAdmin = async(req, res = response) => {
    //todo: validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }

        //actualizaciones
        const { password, google, email, ...campos } = req.body;


        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDB.google) {

            campos.email = email;

        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no puede cambiar su correo'
            });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const actualizarUsuario = async(req, res = response) => {
    //todo: validar token y comprobar si el usuario es correcto

    // const uid = req.body._id;
    // const uid = req.params.id;

    const id = req.params.id;
    const uid = req.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }

        //actualizaciones
        // const { password, google, ...campos } = req.body;
        
        const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            local: req.body.local,
            role: req.body.role,
            telefono: req.body.telefono,
            numdoc: req.body.numdoc,
            email: req.body.email,
            google: req.body.google,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            genero: req.body.genero,
            pais: req.body.pais,
            ciudad: req.body.ciudad,
            direccion: req.body.direccion,
            descripcion: req.body.descripcion,
            ocupacion: req.body.ocupacion,
            lang: req.body.lang,
            edad: req.body.edad,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        }

        // si en el req viene una password se agrega al objeto data para realizar el update
        if(req.body.password){
            data.password = req.body.password;
        }
        // console.log('data: ',data)
        const email = data.email;

        if (usuarioDB.email !== data.email) {

            const existeEmail = await Usuario.findOne( {email: email} );
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDB.google) {

            // campos.email = email;

        } else if (usuarioDB.email !== data.email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no puede cambiar su correo'
            });
        }

        // verificar si en el req hay una password
        if(req.body.password){
            //encriptar password
            const salt = bcrypt.genSaltSync();
            data.password = bcrypt.hashSync(data.password, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, data, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};
const actualizarStatusUsuario = async(req, res = response) => {
    //todo: validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {
        // buscamos el usuarios
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }

        //actualizamos solo el role
        const { role } = req.body;
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, role, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado.role
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const borrarUsuario = async(req, res) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const set_token_recovery = (req, res) => {
    var email = req.params['email'];
    const token = Math.floor(Math.random() * (999999 - 100000) + 100000);


    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'mercadocreativo@gmail.com ',
            pass: 'pdnknnhpjijutcau'
        }
    }));

    var mailOptions = {
        from: 'mercadocreativo@gmail.com',
        to: email,
        subject: 'Código de recuperación.',
        text: 'Tu código de recuperacion es: ' + token
    };


    Usuario.findOne({ email: email }, (err, user) => {

        if (err) {
            res.status(500).send({ message: "Error en el servidor" });
        } else {
            if (user == null) {
                res.status(500).send({ message: "El correo electrónico no se encuentra registrado, intente nuevamente." });
            } else {
                Usuario.findByIdAndUpdate({ _id: user._id }, { recovery_token: token }, (err, user_update) => {
                    if (err) {

                    } else {
                        res.status(200).send({ data: user_update });

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {

                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }
                })
            }
        }
    });
}

const verify_token_recovery = (req, res) => {
    var email = req.params['email'];
    var codigo = req.params['codigo'];

    Usuario.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor" });
        } else {
            if (user.recovery_token == codigo) {
                res.status(200).send({ data: true });
            } else {
                res.status(200).send({ data: false });
            }
        }
    });
}

const change_password = (req, res) => {
    var email = req.params['email'];
    var params = req.body;
    Usuario.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor" });
        } else {
            if (user == null) {
                res.status(500).send({ message: "El correo electrónico no se encuentra registrado, intente nuevamente." });
            } else {
                bcrypt.hash(params.password, null, null, function(err, hash) {
                    Usuario.findByIdAndUpdate({ _id: user._id }, { password: hash }, (err, user_update) => {
                        res.status(200).send({ data: user_update });
                    });
                });

            }
        }
    });
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    actualizarUAdmin,
    borrarUsuario,
    getUsuario,
    getAllUsers,
    set_token_recovery,
    verify_token_recovery,
    change_password,
    actualizarStatusUsuario,
    getUsuariobyCedula,
};
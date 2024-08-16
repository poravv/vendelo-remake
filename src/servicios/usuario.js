const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const usuario = require("../model/model_usuario")
const sucursal = require("../model/model_sucursal")
const persona = require("../model/model_persona")
const database = require('../database')
const { keycloak } = require('../middleware/keycloak_validate');
const md5 = require('md5')
require("dotenv").config()

routes.post('/login/', async (req, res) => {
    //console.log(`select * from usuario where nick = '${nick}' and password = '${md5(password)}'`)
    try {
        //console.log(req.body)
        const { nick, password } = req.body;
        const rsusuario = await usuario.findOne(
            {
                where: { nick: nick, password: md5(password) },
                include: [
                    { model: sucursal },
                    { model: persona }
                ]
            })
        await database.query('CALL cargaInventarioCab(@a)');

        if (rsusuario.length != 0) {
            //console.log('Mi usuario: ', rsusuario)
            jwt.sign({ rsusuario }, process.env.CLAVESECRETA
                , { expiresIn: '12h' }//Para personalizar el tiempo para expirar
                , (error, token) => {
                    //console.log("-------------->",token);
                    res.json({ estado: "succesfully", token, body: rsusuario })
                });
        } else {
            return res.status(400).json(
                {
                    estado: "error",
                    mensaje: "Usuario no existe"
                }
            );
        }
    } catch (error) {
        return res.status(400).json(
            {
                estado: "error",
                mensaje: "Error de login"
            }
        );
    }
})

routes.get('/get/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await usuario.findAll({
        include: [
            { model: sucursal },
            { model: persona }
        ]
    }).then((response) => {
        res.json({
            mensaje: "successfully",
            authData: authData,
            body: response
        });
    }).catch(error => {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    });
})

routes.get('/get/:idusuario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await usuario.findByPk(req.params.idusuario, {
        include: [
            { model: sucursal },
            { model: persona }
        ]
    }).then((response) => {
        res.json({
            mensaje: "successfully",
            authData: authData,
            body: response
        });
    }).catch(error => {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    });
})


routes.put('/reset/:idusuario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    //console.log(req.body)
    req.body.password = md5(req.body.password);
    try {
        await usuario.update(req.body, { where: { idusuario: req.params.idusuario }, transaction: t })
            .then(response => {
                t.commit();
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Registro actualizado satisfactoriamente",
                    authData: authData,
                    body: response
                });
            });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }
})

routes.post('/post/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        req.body.password = md5(req.body.password);
        const usuarios = await usuario.create(req.body, { transaction: t })
            .then(response => {
                t.commit();
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Registro almacenado satisfactoriamente",
                    authData: authData,
                    body: response
                });
            });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }
})

routes.put('/put/:idusuario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await usuario.update(req.body, { where: { idusuario: req.params.idusuario }, transaction: t })
            .then(response => {
                t.commit();
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Registro actualizado satisfactoriamente",
                    authData: authData,
                    body: response
                });
            });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }

})

routes.delete('/del/:idusuario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await usuario.destroy({ where: { idusuario: req.params.idusuario }, transaction: t })
            .then(response => {
                t.commit();
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Registro eliminado satisfactoriamente",
                    authData: authData,
                    body: response
                });
            });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }
})


module.exports = routes;
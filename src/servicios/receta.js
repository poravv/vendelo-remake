const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const receta = require("../model/model_receta")
const producto_final = require("../model/model_producto_final")
const database = require('../database');
const e = require('express');
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const recetas = await receta.findAll({ include: producto_final })
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error })
        } else {
            res.json({
                estado: "successfully",
                body: recetas
            })
        }
    })
})

routes.get('/get/:idreceta', verificaToken, async (req, res) => {
    const recetas = await receta.findByPk(req.params.idreceta, { include: producto_final })
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error })
        } else {
            res.json({
                estado: "successfully",
                body: recetas
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    console.log('Entra en receta-----------------------------------------------')
    try {
        const recetas = await receta.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado correctamente",
                    body: recetas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

routes.put('/put/:idreceta', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const recetas = await receta.update(req.body, { where: { idreceta: req.params.idreceta }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado correctamente",
                    body: recetas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

routes.delete('/del/:idreceta', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const recetas = await receta.destroy({ where: { idreceta: req.params.idreceta }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: recetas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})


module.exports = routes;
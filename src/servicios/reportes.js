const express = require('express');
const routes = express.Router();
const database = require('../database')
const { QueryTypes } = require("sequelize");
const { keycloak } = require('../middleware/keycloak_validate');
require("dotenv").config()


routes.get('/get-report/:reportId?', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const { reportId } = req.params;

    try {
        let query;
        let replacements = [];

        if (reportId) {
            // Obtener un reporte específico por ID
            query = 'SELECT * FROM reportes WHERE id = ?';
            replacements = [reportId];
        } else {
            // Obtener todos los reportes
            query = 'SELECT * FROM reportes';
        }

        const reportes = await database.query(query, {
            replacements: replacements,
            type: QueryTypes.SELECT
        });

        // Si se solicita un reporte específico y no se encuentra
        if (reportId && reportes.length === 0) {
            return res.status(404).json({
                mensaje: "error",
                detmensaje: `No se encontró el reporte con id ${reportId}.`
            });
        }

        res.json({
            mensaje: "successfully",
            authData: authData,
            data: reportes
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "error",
            error: error.message,
            detmensaje: `Error en el servidor, ${error.message}`
        });
    }
});


routes.post('/execute-saved-report', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const { reportId, fromDate, toDate } = req.body;
    if (!reportId) {
        return res.status(400).json({
            mensaje: "error",
            detmensaje: "El 'reportId' es obligatorio."
        });
    }
    try {
        // Primero, obtenemos el SQL guardado en la base de datos
        const [report] = await database.query('SELECT sql_query FROM reportes WHERE id = ?', {
            replacements: [reportId],
            type: QueryTypes.SELECT
        });


        if (!report) {
            return res.status(404).send('Reporte no encontrado');
        }

        let sqlQuery = report.sql_query;

        // Reemplazamos los placeholders con los parámetros de fecha
        sqlQuery = sqlQuery.replace(':fromDate', database.escape(fromDate));
        sqlQuery = sqlQuery.replace(':toDate', database.escape(toDate));

        // Ejecutamos el SQL con los parámetros proporcionados
        const [results] = await database.query(sqlQuery);

        res.json({
            mensaje: "successfully",
            authData: authData,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "error",
            error: error.message,
            detmensaje: `Error en el servidor, ${error.message}`
        });
    }
});


routes.post('/save-report', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    const { nombre, sqlQuery } = req.body;

    if (!nombre || !sqlQuery) {
        return res.status(400).json({
            mensaje: "error",
            detmensaje: "Los campos 'nombre' y 'sqlQuery' son obligatorios."
        });
    }

    try {
        const response = await database.query(
            'INSERT INTO reportes (nombre, sql_query) VALUES (?, ?)',
            {
                replacements: [nombre, sqlQuery],
                type: QueryTypes.INSERT
            }
        );
        res.json({
            mensaje: "successfully",
            authData: authData,
            body: response
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "error",
            error: error.message,
            detmensaje: `Error en el servidor, ${error.message}`
        });
    }
});

routes.put('/update-report/:reportId', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const { reportId } = req.params;
    const { nombre, sqlQuery } = req.body;

    if (!nombre && !sqlQuery) {
        return res.status(400).json({
            mensaje: "error",
            detmensaje: "Debe proporcionar al menos un campo ('nombre' o 'sqlQuery') para actualizar."
        });
    }

    try {
        // Crear el query dinámico según los campos proporcionados
        let updateQuery = 'UPDATE reportes SET ';
        const replacements = [];

        if (nombre) {
            updateQuery += 'nombre = ?';
            replacements.push(nombre);
        }
        if (sqlQuery) {
            if (nombre) updateQuery += ', ';
            updateQuery += 'sql_query = ?';
            replacements.push(sqlQuery);
        }

        updateQuery += ' WHERE id = ?';
        replacements.push(reportId);

        const result = await database.query(updateQuery, {
            replacements: replacements,
            type: QueryTypes.UPDATE
        });

        if (result[1] === 0) {
            return res.status(404).json({
                mensaje: "error",
                detmensaje: `No se encontró el reporte con id ${reportId}.`
            });
        }

        res.json({
            mensaje: "Reporte actualizado exitosamente",
            authData: authData,
            body: result
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "error",
            error: error.message,
            detmensaje: `Error en el servidor, ${error.message}`
        });
    }
});


routes.delete('/delete-report/:reportId', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const { reportId } = req.params;

    try {
        const result = await database.query('DELETE FROM reportes WHERE id = ?', {
            replacements: [reportId],
            type: QueryTypes.DELETE
        });

        if (result[1] === 0) {
            return res.status(404).json({
                mensaje: "error",
                detmensaje: `No se encontró el reporte con id ${reportId}.`
            });
        }

        res.json({
            mensaje: "Reporte eliminado exitosamente",
            authData: authData,
            body: result
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "error",
            error: error.message,
            detmensaje: `Error en el servidor, ${error.message}`
        });
    }
});



module.exports = routes;
const pool = require("@database/postgresql/db");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const GetOrgList = require('@use_cases/org/GetOrgList')

const getOrgList = async (req, res) => {
    try {
        var sqlVar = {};
        if (req.query.p == undefined) sqlVar.page = '0';
        else sqlVar.page = (req.query.p - 1) * 10;
        if (req.query.c == undefined) sqlVar.city = '%';
        else sqlVar.city = req.query.c;
        if (req.query.t == undefined) sqlVar.category = '{0, 1, 2}';
        else sqlVar.category = "{" + req.query.t + "}";
        GetOrgListCommand = GetOrgList()
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка при обработке запроса", //Database connection error
        });
    };
}

module.exports = getOrgList;
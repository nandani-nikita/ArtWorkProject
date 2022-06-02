const { conn } = require('../DBs/db');
const findFunction = async (table) => {
    try {
        const findQuery = `select * from ${table}`
        var data = await conn.query(findQuery);
        return { msg: data.rows };
    } catch (e) {
        return { error: e };
    }

}

const findOnConditionFunction = async (table, whereClause) => {
    try {
        const findQuery = `select * from ${table} where ${whereClause}`
        var data = await conn.query(findQuery);
        if(data.rows.length) {
            return { error: 'Email taken', data: data.rows };
        }
        return null;
    } catch (e) {
        return { error: e };
    }

}

const insertFunction = async (table, columns, values) => {

    try {
        const insertQuery = `insert into ${table} (${columns}) values (${values});`
        const insert = await conn.query(insertQuery);
        return {msg: true, data: insert};
    } catch (e) {
        return { error: e };
    }

}
module.exports = {
    findFunction,
    findOnConditionFunction,
    insertFunction
}
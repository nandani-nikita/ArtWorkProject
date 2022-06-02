const { conn } = require('../DBs/db');
const findFunction = async (table) => {
    try {
        const findQuery = `select * from ${table}`
        var data = await conn.query(findQuery);
        console.log('Table exists', data.rows);
        // console.log('finding', data.rows);
        return { msg: data.rows };
    } catch (e) {
        console.log('error occured while finding table: ', e);
        // console.log(e);
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
        console.log('error occured while finding table: ', e);
        return { error: e };
    }

}

const insertFunction = async (table, columns, values) => {

    try {

        const insertQuery = `insert into ${table} (${columns}) values (${values});`

        // const insert = await conn.query(insertQuery, (err) => {
        //     if (!err) {
        //         console.log('data added');
        //         return { msg: 'Inserted' }
        //     } else {
        //         console.log('error occured: ', err);
        //         return { error: err };
        //     }
        // });
        const insert = await conn.query(insertQuery);
        console.log('-------------------');
        console.log("\n\n\n", insert);
        return {msg: true};
    } catch (e) {
        // console.log('catch error: ', e);
        return { error: e };
    }

}
module.exports = {
    findFunction,
    findOnConditionFunction,
    insertFunction
}
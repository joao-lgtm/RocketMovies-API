const sqliteConnection = require("../../sqlite");
const createdUsers = require("./createUser");



async function migrationRun(){
    const schemas = [
        createdUsers
    ].join('');


    sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error));

}

module.exports = migrationRun;
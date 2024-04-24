const sqliteConnection = require("../database/sqlite");

class UserRepository {
    async findByEmail(email){
        const dataBase = await sqliteConnection();
        const user = await dataBase.get("SELECT * FROM users WHERE email = (?)", [email]);

        return user;
    }

    async createUser({name, email, password, avatar}){
        const dataBase = await sqliteConnection();
   

       const userId = await dataBase.run("INSERT INTO users (name,email,password,avatar) values ( ?, ?, ? ,?)", [name, email, password, avatar]);


        return { id: userId};
    }

}


module.exports = UserRepository;
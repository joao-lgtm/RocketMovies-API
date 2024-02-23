const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UserController {

    async create(request, response) {
        const { name, email, password, avatar } = request.body;

        const dataBase = await sqliteConnection();
        const checkUserExists = await dataBase.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso");
        }

        const hashdpassword = await hash(password, 8);

        await dataBase.run("INSERT INTO users (name,email,password,avatar) values ( ?, ?, ? ,?)", [name, email, hashdpassword, avatar]);


        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);



        if (!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso.");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
        }

        if (password && old_password) {
            const checkOldpassword = await compare(old_password, user.password)

            if (!checkOldpassword) {
                throw new AppError("A senha antiga não confere.")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            update users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`
            , [user.name, user.email, user.password, user_id])

        return response.json()
    }

    async getUser(request, response) {
        const id = request.params.user_id
        

        const database = await sqliteConnection();
        const user = await database.get("SELECT name,avatar FROM users WHERE id = (?)", [id]);

        return response.json(user);
    }
}

module.exports = UserController
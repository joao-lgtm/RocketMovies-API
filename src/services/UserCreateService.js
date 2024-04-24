const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");


class UserCreateService {
    constructor(userRepository){
        this.userRepository = userRepository
    }
    async execute({ name, email, password}){
        const checkUserExists = await this.userRepository.findByEmail(email)

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso");
        }

        const hashdpassword = await hash(password, 8);

        const userCerated = await this.userRepository.createUser({name, email, password: hashdpassword});

        return userCerated;
    }
}

module.exports = UserCreateService
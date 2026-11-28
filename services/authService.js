const argon2 = require('argon2');

const HASH_OWASP = { // OWASP Password Storage Cheat Sheet
    type: argon2.argon2id,
    memoryCost: 19456, //19mib converted to kib
    timeCost:2, //iterations
    parallelism: 1
}
class AuthService {
    constructor(userRepo){
        this.users = userRepo;
    }

    static hashPassword(password){ //returns hashed value and hash
        return argon2.hash(password, HASH_OWASP);
    }


    async register(username, email, password) {
        try {
            const passwordHash = await AuthService.hashPassword(password);
            const result = await this.users.create(username, email, passwordHash); //registers new user
            return result;
        } catch (error) {//sends generic message about existing credential
            if (error.code === 'SQLITE_CONSTRAINT') {
                const e = new Error('Username or email already exists');
                e.expose = true; //prevents raw error messages being shown to user
                throw e;
            }
            throw error;
        }
    }

    async login(username, password) {
        const user = await this.users.findByUsername(username);

        if(!user) { //checks if user exists
            return null;
        }

        const valid = await argon2.verify(user.password_hash, password);

        return valid ? user : null;
    }
}

module.exports = AuthService;
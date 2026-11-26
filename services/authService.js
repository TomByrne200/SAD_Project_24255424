class AuthService {
    constructor(userRepo){
        this.users = userRepo;
    }


    async register(username, email, password) {
        try {
            const result = await this.users.create(username, email, password); //registers new user
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

        if (user.password !== password){ //compares given password with stored password, returns null if not matching
            return null;
        }

        return user;
    }
}

module.exports = AuthService;
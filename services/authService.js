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
        const user = await this.users.findByCredentials(username,password); //INSECURE: part of SQL Injection vulnerability
        return user || null;
    }
}

module.exports = AuthService;
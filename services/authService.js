class AuthService {
    constructor(userRepo){
        this.users = userRepo;
    }


    async register(username, email, password) {
        return this.users.create(username, email, password); //INSECURE: error handling removed
    }

    async login(username, password) {
        const user = await this.users.findByCredentials(username,password); //INSECURE: part of SQL Injection vulnerability
        return user || null;
    }
}

module.exports = AuthService;
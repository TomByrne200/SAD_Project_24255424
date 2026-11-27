class UserRepo{
    constructor(db){
        this.db = db;
    }

    findByUsername(username) {//finds user by username
        return this.db.get(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
    }

    findById(id) { //finds user by their ID
        return this.db.get(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
    }

    create(username, email, password) { //create new user and return the created user
        return this.db.run(
            'INSERT INTO users (username, email, password) VALUES (?,?,?)',
            [username,email,password]
        );
    }

    findByCredentials(username, password) {
        return this.db.get(`SELECT * FROM users WHERE username ='${username}' AND password = '${password}'`); //INSECURE: SQL Injection: credential check straight to database using SQL query
    }
}
module.exports = UserRepo;
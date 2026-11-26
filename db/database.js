const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database{
    //private static instance 
    static #instance = null; 

    constructor(){ //returns instance if one is created 
        if(Database.#instance){
            return Database.#instance;
        }

        //creates SQLite3 database connection
        this.db = new sqlite3.Database(path.join (__dirname, '..', 'database.db'), (err) => {
            if (err){
                console.error('Database connection error:', err.message); //if connection error, send message to console
                process.exit(1);
            } else {
                console.log('Connected to SQLite database.'); //shows successfull connection
            }
        });
        Database.#instance = this;
        this.db.run('PRAGMA foreign_keys = ON'); //enforce foreign keys during connection
    }

    static getInstance(){ //creates new db instance if there is not one already
        if (!Database.#instance){
            Database.#instance = new Database();
        }
        return Database.#instance;
    }

    run(sql, params = []){ //allows to run db queries
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err){
                if(err){ 
                    reject(err);
                } else {
                    resolve({
                        lastID: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }

    get(sql, params = []){ //allows to retrieve a db row
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) =>{
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []){ //allows to retrieve all db rows
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) =>{
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    exec(sql){ //exec method runs all schemas rather than just one
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => (err ? reject(err) : resolve()));
        });
    }
}

module.exports = Database;
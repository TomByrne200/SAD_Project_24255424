class PostRepo{
    constructor(db){
        this.db = db;
    }

    findAll() {//all latest post by username
        return this.db.all(
            `SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC`
        );
    }

    findById(id) { //finds single post by id with username
        return this.db.get(
            `SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?`,
            [id]
        );
    }

    create(userId, title, body) { //create new post and return the created post
        return this.db.run(
            'INSERT INTO posts (user_id, title, body) VALUES (?,?,?)',
            [userId,title,body]
        );
    }

    delete(id){
        return this.db.run(
            'DELETE FROM posts WHERE id = ?',
            [id]
        );
    }

    search(term) {// search and posts title or body containing keyword; INSECURE: user input joined to SQL string
        return this.db.all(
            `SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.title LIKE '%${term}%' OR posts.body LIKE '%${term}%' ORDER BY posts.created_at DESC`,
        );
    }
}
module.exports = PostRepo;
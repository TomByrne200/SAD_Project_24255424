class CommentRepo{
    constructor(db){
        this.db = db;
    }

    findByPost(postId) { //finds all comments on a post, ordered oldest first
        return this.db.all(
            `SELECT comments.*, users.username 
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at ASC`,
            [postId]
        );
    }

    create(postId, userId, body) { //create new comment and returns its ID
        return this.db.run(
            'INSERT INTO comments(post_id, user_id, body) VALUES (?,?,?)',
            [postId, userId, body]
        );
    }

    delete(id){ //delete id
        return this.db.run(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
    }

    findById(id){// finds single comment by ID
        return this.db.get('SELECT * FROM comments WHERE id = ?', [id]);
    }
}
module.exports = CommentRepo;
const fs = require('fs');
const path = require('path');
const Database = require('./database');
const AuthService = require('../services/authService');

async function seed() {
    const db = Database.getInstance(); //gets db connection

    try{
        const schema = fs.readFileSync( //reads and executes db schema 
            path.join(__dirname,'schema.sql'),
            'utf8'
        );

        await db.exec(schema);
        console.log('Database schema successfully created.');

        const admin = await db.run( //INSERT users to db schema
            'INSERT INTO users (username, email, password_hash, role) VALUES ( ?, ?,?,?)',
            ['admin', 'admin@blogspace.com', await AuthService.hashPassword('AdminPwd1999!'), 'admin']
        );

        const bruno = await db.run(
            'INSERT INTO users (username, email, password_hash) VALUES ( ?, ?,?)',
            ['bruno', 'bruno@blogspace.com', await AuthService.hashPassword('BrunoPwd2026!')]
        );

        const alex = await db.run(
            'INSERT INTO users (username, email, password_hash) VALUES ( ?, ?,?)',
            ['alex', 'alex@blogspace.com', await AuthService.hashPassword('AlexPwd2008!')]
        );

        console.log('Users inserted successfully');

        const adminPost = await db.run( //INSERT user posts
            'INSERT INTO posts (user_id, title, body) VALUES (?,?,?)',
            [admin.lastID, 'WELCOME TO BLOGSPACE', 'BLOG BLOG BLOG']
        );

        const brunoPost = await db.run(
            'INSERT INTO posts (user_id, title, body) VALUES (?,?,?)',
            [bruno.lastID, 'Why Dalot is Useless at Football', 'Watch any game he has played.']
        );

        const alexPost = await db.run(
            'INSERT INTO posts (user_id, title, body) VALUES (?,?,?)',
            [alex.lastID, 'I am Coming out of Retirement', 'Someone needs to save these boys from relegation.']
        );

        console.log('Posts inserted successfully');

        await db.run(// INSERT user comments
            'INSERT INTO comments(post_id, user_id, body) VALUES (?,?,?)',
            [brunoPost.lastID, admin.lastID, 'AGREED! Get him and the rest of them out.']
        );

        await db.run(
            'INSERT INTO comments(post_id, user_id, body) VALUES (?,?,?)',
            [brunoPost.lastID, alex.lastID, 'Check my new post pal, I have some good news.']
        );

        await db.run(
            'INSERT INTO comments(post_id, user_id, body) VALUES (?,?,?)',
            [alexPost.lastID, bruno.lastID, 'Thanks gaffer! Get Scholesy back too.']
        );

        console.log('comments inserted successfully');

        console.log('Database successfully seeded');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Failed', error);

        process.exit(1);
    }
}
seed();//run seed function

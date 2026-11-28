const express = require('express');
const Database = require('../db/database');
const UserRepo = require('../repositories/userRepo');
const AuthService = require('../services/authService');

const router = express.Router();
const auth = new AuthService(// new authService
    new UserRepo(Database.getInstance())
);

router.get('/register', (req, res) => { //Displays registration, gets GET /register
    res.render('register', {
        title: 'Register',   
        error: null
    });
});

router.post('/register', async (req, res) =>{ //POST /register
    const {username,email, password, confirmPassword} = req.body;

     //register validation
     let error = null;
     if( !username || !email || !password) error = 'all fields must be entered';
     else if (password.length <12) error = 'Password must be at least 12 characters long';
     else if (password !== confirmPassword) error = 'Passwords do not match';

     if (error) {
         return res.status(400).render('register', {
             title: 'Register', 
             error, 
             username, 
             email
            });
     }

    try {
        
        await auth.register(username,email,password);
        res.redirect('/login?registered=1');//redirects user to login after registration
    } catch (error){
        res.status(400).render('register', {
            title: 'Register', 
            error: error.message, //INSECURE displays database errors to user
            username,
            email
        });
    }
});

router.post('/login', async (req, res) =>  { // POST /login + authentication
    try{
        const{username, password} = req.body;

        const user = await auth.login(username, password);

        if (!user) {
            return res.status(401).render('login', {
                title: 'Log In',
                error: 'Invalid username or password',
                registered: false
            });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        res.redirect('/');
    } catch (error){
        res.status(500).render('login', {
            title: 'Log In',
            error: 'unexpected error or server issue occurred',
            registered: false
        });
    }
});

router.post('/logout', (req,res) => { //POST /logout + kill session
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send('unable to log out');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

router.get('/login', (req, res) => { //GET login 
    res.render('login', {
        title: 'Log In',
        error: null, 
        registered: req.query.registered === '1'
    });
});

router.get('/api/users', async (req, res) => { //INSECURE: returns all user info through json 
    const users = await auth.users.findAll();
    res.json(users);
});

module.exports = router;


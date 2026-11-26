const express = require('express'); 
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);


const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db', dir:'.'
    }),
    secret: 'dev-secret-change-me',
    resave: false, 
    saveUninitialized: false
}));

app.use((req, res, next) => { // navigation bar is available to user
    res.locals.user = req.session.user || null;
    next();
}) 

app.use(require('./routes/auth'));

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.listen(PORT, () => console.log(`Running at http//localhost:${PORT}`));
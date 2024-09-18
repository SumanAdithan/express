import express, { request, response } from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose, { mongo } from 'mongoose';
import './strategies/local-strategies.mjs';

const app = express();

mongoose
    .connect('mongodb://localhost/express_tutorial')
    .then(() => console.log('connected to database'))
    .catch(err => console.log(`Error:${err}`));

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(
    session({
        secret: 'world to hello',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

app.get('/api/auth/status', (req, res) => {
    console.log('Inside /auth/status endpoint');
    console.log(req.user);
    console.log(req.session);
    return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logOut(err => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

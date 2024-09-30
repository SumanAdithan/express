import express, { request, response } from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose, { mongo } from 'mongoose';
// import './strategies/local-strategies.mjs';
import MongoStore from 'connect-mongo';
import './strategies/discord-strategies.mjs';

const app = express();

mongoose
    .connect('mongodb://localhost/express_tutorial')
    .then(() => console.log('connected to database'))
    .catch((err) => console.log(`Error:${err}`));

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
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
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
    req.logOut((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    });
});

app.get('/api/auth/discord', passport.authenticate('discord'));
app.get('/api/auth/discord/redirect', passport.authenticate('discord'), (req, res) => {
    console.log(req.session);
    console.log(req.user);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

// app id - 1286362979784200192
// public key - fb9bdfa4859499ae701c11b40fc1bf02885809a935484e94591a4607d6c5b007
// redirect url - http://localhost:3000/api/auth/discord/redirect

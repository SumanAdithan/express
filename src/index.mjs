import express, { request, response } from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

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
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    req.session.visited = true;
    res.cookie('hello', 'world', { maxAge: 30000, signed: true });
    res.status(201).send({ msg: 'hello' });
});

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

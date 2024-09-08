import express, { request, response } from 'express';
import routes from './routes/index.mjs';
const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(201).send({ msg: 'hello' });
});

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

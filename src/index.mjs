import express, { request, response } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { createUserValidationSchema } from './utils/validationSchemas.mjs';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};

const resolveIndexByUserId = (req, res, next) => {
    const {
        params: { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);

    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
};

const mockUsers = [
    { id: 1, username: 'john', displayName: 'John' },
    { id: 2, username: 'wick', displayName: 'Wick' },
    { id: 3, username: 'hulk', displayName: 'Hulk' },
    { id: 4, username: 'spiderman', displayName: 'Spiderman' },
    { id: 5, username: 'thor', displayName: 'Thor' },
    { id: 6, username: 'batman', displayName: 'Batman' },
    { id: 7, username: 'superman', displayName: 'Superman' },
];

// middleware
app.get(
    '/',
    (req, res, next) => {
        console.log('Base URL 1');
        next();
    },
    (req, res, next) => {
        console.log('Base URL 2');
        next();
    },
    (req, res, next) => {
        console.log('Base URL 3');
        next();
    },
    (req, res) => {
        res.status(201).send({ msg: 'hello' });
    }
);

// query params - localhost:3000/users or localhost:3000/users?filter=username&value=jo
app.get(
    '/api/users',
    query('filter')
        .isString()
        .notEmpty()
        .withMessage('Must not be empty')
        .isLength({ min: 3, max: 10 })
        .withMessage('Must be at least 3-10 characters'),
    (req, res) => {
        const result = validationResult(req);
        console.log(result);
        const {
            query: { filter, value },
        } = req;

        if (filter && value)
            return res.send(mockUsers.filter(user => user[filter].includes(value)));

        return res.send(mockUsers);
    }
);

// route params - localhost:3000/users/1
app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

// get request - localhost:3000/api/products
app.get('/api/products', (req, res) => {
    res.send([{ id: 123, name: 'chicken rice', price: 12.99 }]);
});

app.use(loggingMiddleware, (req, res, next) => {
    console.log('Finished Logging...');
    next();
}); // middleware called when below post request handler (handler also a middleware)

// post request - localhost:3000/api/users
app.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
});

// put request - localhost:3000/api/users/1
app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

// patch request - localhost:3000/api/users/1
app.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
});

// delete request
app.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

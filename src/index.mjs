import express from 'express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: 'john', displayName: 'John' },
    { id: 2, username: 'wick', displayName: 'Wick' },
    { id: 3, username: 'hulk', displayName: 'Hulk' },
    { id: 4, username: 'spiderman', displayName: 'Spiderman' },
    { id: 5, username: 'thor', displayName: 'Thor' },
    { id: 6, username: 'batman', displayName: 'Batman' },
    { id: 7, username: 'superman', displayName: 'Superman' },
];

// get request - localhost:3000
app.get('/', (req, res) => {
    res.status(201).send({ msg: 'hello' });
});

// query params - localhost:3000/users or localhost:3000/users?filter=username&value=jo
app.get('/api/users', (req, res) => {
    console.log(req.query);
    const {
        query: { filter, value },
    } = req;

    if (filter && value) return res.send(mockUsers.filter(user => user[filter].includes(value)));

    return res.send(mockUsers);
});

// route params - localhost:3000/users/1
app.get('/api/users/:id', (req, res) => {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId)) return res.status(400).send({ msg: 'Bad Request. Invalid ID.' });
    const findUser = mockUsers.find(user => user.id === parsedId);

    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

// post request - localhost:3000/api/users
app.post('/api/users', (req, res) => {
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return res.status(200).send(newUser);
});

app.get('/api/products', (req, res) => {
    res.send([{ id: 123, name: 'chicken rice', price: 12.99 }]);
});

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

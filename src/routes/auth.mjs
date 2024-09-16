import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    req.session.visited = true;
    res.cookie('hello', 'world', { maxAge: 30000, signed: true });
    res.status(201).send({ msg: 'hello' });
});

router.post('/api/auth', (req, res) => {
    const {
        body: { username, password },
    } = req;
    console.log(username);
    const findUser = mockUsers.find(user => user.username === username);
    if (!findUser || findUser.password !== password)
        return res.status(401).send({ msg: 'BAD CREDENTIALS' });

    req.session.user = findUser;
    return res.status(200).send(findUser);
});

router.get('/api/auth/status', (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    });
    return req.session.user
        ? res.status(200).send(req.session.user)
        : res.status(401).send({ msg: 'Not Authenticated' });
});

router.post('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    const { body: item } = req;

    const { cart } = req.session;

    if (cart) {
        cart.push(item);
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

router.get('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    return res.send(req.session.cart ?? []);
});

export default router;

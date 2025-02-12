import { Router } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { resolveIndexByUserId } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schemas/user.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { createUserHandler, getUserByIdHandler } from '../handlers/users.mjs';

const router = Router();

// route params - localhost:3000/users/1
router.get('/api/users/:id', resolveIndexByUserId, getUserByIdHandler);

// query params - localhost:3000/api/users or localhost:3000/api/users?filter=username&value=jo
router.get(
    '/api/users',
    query('filter')
        .isString()
        .notEmpty()
        .withMessage('Must not be empty')
        .isLength({ min: 3, max: 10 })
        .withMessage('Must be at least 3-10 characters'),
    (req, res) => {
        console.log(req.session);
        console.log(req.sessionID);
        req.sessionStore.get(req.sessionID, (err, sessionData) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(sessionData);
        });
        const result = validationResult(req);
        const {
            query: { filter, value },
        } = req;

        if (filter && value)
            return res.send(mockUsers.filter((user) => user[filter].includes(value)));

        return res.send(mockUsers);
    }
);

// post request - localhost:3000/api/users
router.post('/api/users', checkSchema(createUserValidationSchema), createUserHandler);

// put request - localhost:3000/api/users/1
router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

// patch request - localhost:3000/api/users/1
router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
});

// delete request
router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

export default router;

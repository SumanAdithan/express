import { Router } from 'express';
const router = Router();

// get request - localhost:3000/api/products
router.get('/api/products', (req, res) => {
    res.send([{ id: 123, name: 'chicken rice', price: 12.99 }]);
});

export default router;

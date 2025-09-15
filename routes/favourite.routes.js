const router = require('express').Router();
const favController = require('../controllers/favourite.controller');
const auth = require('../middleware/auth');

router.post('/add/:id', auth, favController.addToFavorite);
router.post('/remove/:id', auth, favController.removeFromFavorite);
router.get('/', auth, favController.getFavorites);

module.exports = router;

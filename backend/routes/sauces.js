const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', saucesCtrl.getAllSauces);
router.get('/:id', saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', saucesCtrl.likeSauce);


module.exports = router;
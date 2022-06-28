/**
 * Router va ici nous permettre ce créer nos routes, associer des verbes http à des fonctions.
 */
const express = require('express');
const router = express.Router();

/**
 * On importe ici les controllers et middleware dont on va avoir besoin pour nos routes.
 */
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/**
 * On créer ici nos routes, en y rattachant le middleware d'authenfication à chaque fois, le multer si besoin et les différents controllers.
 */
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

/**
 * Enfin on exporte ici toutes les routes.
 */
module.exports = router;
/**
 * Router va ici nous permettre ce créer nos routes, associer des verbes http à des fonctions.
 */
const express = require('express');
const router = express.Router();

/**
 * On importe ici les controllers signup et login.
 */
const userCtrl = require('../controllers/user');

/**
 * On créer ici les routes signup et login en y rattachant les controllers correspondants.
 */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/**
 * On exporte ici nos routes.
 */
module.exports = router;
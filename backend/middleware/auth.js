/**
 * On importe le package jwt qui nous permet de manipuler le token d'authentification.
 */
const jwt = require('jsonwebtoken');

/**
 * On importe ici nos variables d'environnement.
 */
 require('dotenv').config();

/**
 * Ceci est le middleware d'authenfication qui va nous permettre d'authentifier nos routes une fois qu'on les aura rattachées à celui-ci.
 * Tout d'abord on isole le token de la requête puisque celui-ci arrive précédé du mot clé Bearer.
 * Ensuite on décode le token grâce à la méthode verify. On y passe le token de la requête ainsi que la clé secrète.
 * Ensuite on récupère le userId depuis le token décodé.
 * Puis on rattache à la requête un paramètre auth auquel on assigne la valeur userId.
 * Si la requête contient un userId et que celui-ci ne correspond pas à celui récupéré dans le token on renvoie une erreur.
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error: error | 'Requête non authentifié !'});
    }
};
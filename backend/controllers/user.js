/**
 * On importe les packages bcrypt et jwt qui vont nous permettre de crypter les mots de passe et de manipuler un token d'identification.
 * On importe également le modèle User.
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/**
 * Ce controller va permettre à l'utilisateur de créer un compte.
 * Tout d'abord on hache le mot de passe et on utilise un salage multiple pour le sécuriser.
 * Ensuite on enregistre dans la base données ce nouvel User avec son email et le hash de son mot de passe grâce à la méthode save.
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * Ce controller va permettre à l'utilisateur de se connecter à son compte.
 * On va chercher l'utilisateur dans la base de données grâce à la méthode findOne.
 * Si l'utilisateur n'existe pas on retourne une erreur.
 * Sinon on compare le hash du mot de passe de la requête avec le hash du mot de passe de l'utilisateur dans la base de données.
 * S'ils ne correspondent pas on renvoie une erreur.
 * S'ils correspondent on renvoie un token d'authentification valable 24h.
 */
exports.login =(req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
               return res.status(401).json({ error: 'Utilisateur non trouvé !' }) 
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'fxpizolzmbqrmq7x20zd5qoi9fg5j5u8d1z9w5je83uvhd6k6nay8z3hc3ndphrh',
                            { expiresIn: '24h' }
                        )
                    }); 
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * On importe la modèle Sauce ainsi que le package file system qui va nous permettre de manipuler les fichiers locaux.
 */
const Sauce = require('../models/Sauce');
const fs = require('fs');

/**
 * Ce controller sert à aller chercher toutes les sauces dans la base de données grâce à la méthode find.
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Ce controller sert à aller chercher une sauce en particulier dans la base de données grâce à la méthode findOne.
 */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/**
 * Ce controller sert à créer une sauce dans la base de données.
 * On supprime l'id de l'objet dans la requête puisque une fois rentré dans la base de données, un id va automatiquement être attribué à celui-ci.
 * On assigne à imageUrl ce qui sera l'URL de l'image et on initialise les valeurs de likes dislikes usersLiked et usersDisliked.
 * Enfin on enregistre la sauce dans la base de données grâce à la méthode save.
 */
exports.createSauce = (req, res ,next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));     
};

/**
 * Ce controller sert à modifier une sauce dans la base de données.
 * On créer un objet sauceObject à partir de ce qui se trouve dans la requête.
 * Tout d'abord on vérifie s'il y a un file, en l'occurence une image dans la requête.
 * Si c'est le cas on modifie la valeur d'imageUrl de sauceObject pour y mettre l'URL de l'image de la requête.
 * Si ce n'est pas le cas on récupère simplement l'objet sauceObject.
 * Ensuite, grâce à la méthode findOne on va chercher dans la base de données la sauce que l'on veut mettre à jour.
 * Si la sauce n'existe pas on renvoie une erreur.
 * Si le userId ratatché à la sauce ne correspond pas à l'userId de celui qui effectue la requête on renvoie une erreur.
 * Si la requête ne contient pas d'image on met simplement à jour la sauce avec l'objet sauceObject grâce à la méthode updateOne.
 * Si la requête contient une image, on supprime tout d'abord l'ancienne image rattachée à la sauce puis on met à jour celle-ci avec sauceObject grâce à updateOne.
 */
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: new Error('Sauce inexistante !') });
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ error: new Error('Requête non authorisée !') });
            } 
            if (!req.file) {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'Sauce modifiée !'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'Sauce modifiée !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error })); 
};

/**
 * Ce controller sert à supprimer une sauce de la base de données.
 * On va rechercher la sauce en question dans la base de données grâce à la méthode findOne.
 * Si la sauce n'existe pas on renvoie une erreur.
 * Si le userId ratatché à la sauce ne correspond pas à l'userId de celui qui effectue la requête on renvoie une erreur.
 * Sinon, on supprime tout d'abord l'ancienne image rattachée à la sauce puis on supprime cette dernière de la base de données grâce à la méthode deleteOne.
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: new Error('Sauce inexistante !') });
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ error: new Error('Requête non authorisée !') });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce suprrimée !' }))
                    .catch((error) => res.status(400).json({ error: error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * Ce controller va permettre à l'utilisateur de liker/disliker des sauces.
 * Tout d'abord on va chercher la sauce en question dans la base de données grâce à la méthode findOne.
 * Si l'userId de celui qui effectue la requête ne se trouve pas dans le tableau usersLiked de la sauce et que la valeur de like dans la requête est de 1, on incrémente
 la valeur likes de la sauce et on ajoute l'userId dans le tableau usersLiked de la sauce grâce à la méthode updateOne.
 * Si l'userId de celui qui effectue la requête se trouve dans le tableau usersLiked de la sauce et que la valeur de like dans la requête est de 0, on décrémente
 la valeur likes de la sauce et on retire l'userId dans le tableau usersLiked de la sauce grâce à la méthode updateOne.
 * Si l'userId de celui qui effectue la requête ne se trouve pas dans le tableau usersDisliked de la sauce et que la valeur de like dans la requête est de -1, on incrémente
 la valeur dislikes de la sauce et on ajoute l'userId dans le tableau usersDisliked de la sauce grâce à la méthode updateOne.
 * Si l'userId de celui qui effectue la requête se trouve dans le tableau usersDisliked de la sauce et que la valeur de like dans la requête est de 0, on décrémente
 la valeur dislikes de la sauce et on ajoute l'userId dans le tableau usersDisliked de la sauce grâce à la méthode updateOne.
 */
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: 1}, $push: {usersLiked: req.body.userId} })
                    .then(() => res.status(201).json({ message: 'Sauce likée !'}))
                    .catch((error) => res.status(400).json({ error: error }));
            }
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $pull: {usersLiked: req.body.userId} })
                    .then(() => res.status(201).json({ message: 'Like enlevé !'}))
                    .catch((error) => res.status(400).json({ error: error }));
            }
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId} })
                    .then(() => res.status(201).json({ message: 'Sauce dislikée !'}))
                    .catch((error) => res.status(400).json({ error: error }));
            }
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId} })
                    .then(() => res.status(201).json({ message: 'Dislike enlevé !'}))
                    .catch((error) => res.status(400).json({ error: error }));
            }
        })
        .catch(error => res.status(404).json({ error }));
};


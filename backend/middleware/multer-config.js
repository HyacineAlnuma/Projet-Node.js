/**
 * On importe le package multer qui va nous permettre de gérer les fichiers entrants dans kes requêtes http.
 */
const multer = require('multer');

/**
 * On créer un dictionnaire MIME_TYPES ou l'on traduit les informations reçues du frontend en extensions valables.
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * Ce middleware va nous permettre d'enregistrer les images en local grâce à la méthode diskStorage.
 * Destination explique à multer dans quel dossier enregistrer les fichiers.
 * Filename va expliquer à multer quel nom de fichier utiliser (on ne peut pas utiliser les noms d’origines car si 2 fichiers ont le même nom ça pose problème).
 * On créer le nom du fichier avec le nom d'origine (les espaces contenus dans celui-ci on été remplacés par des underscores), un timestamp pour rendre le nom unique 
 et l'extension (récupérée grâce au mimetype du fichier).
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

/**
 * On exporte le middleware en signifiant single pour dire que c'est un fichier unique et 'image' pour dire que c'est une image.
 */
module.exports = multer({ storage }).single('image');
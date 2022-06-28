/**
 * On importe ici tous les packages dont nous avons besoin.
 * Path permet d'accéder au path de notre serveur.
 * Helmet et xss nous permettent de nous protéger contre les failles de sécurité les plus courantes.
 */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss');

/**
 * On importe ici nos routes pour les sauces et pour les users.
 */
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces')

const app = express();

/**
 * On se connecte ici à notre base de donnée.
 */
mongoose.connect('mongodb+srv://halnuma:2m6aNhtuWwKPrHGp@cluster0.zrs8lay.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/**
 * Ici on va paramétrer les headers des réponses afin d'autoriser toutes les origines à effectuer des requête à l'API, et autoriser toutes les méthodes.
 * Cela va entre autres nous permettre d'éviter d'avoir des erreurs CORS.
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**
 * Le code suivant va nous permettre de parser les requêtes arrivant en JSON.
 */
app.use(express.json());
/**
 * On paramètre ici le package helmet afin d'éviter d'avoir des erreurs CORS.
 */
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

/**
 * Le code suivant va nous permettre de gérer la route images de manière statique.
 */
app.use('/images', express.static(path.join(__dirname, 'images')));

/**
 * Ici on configure nos différentes routes.
 */
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

/**
 * Ici on exporte notre application.
 */
module.exports = app;

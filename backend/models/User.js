/**
 * On importe le package mongoose-unique-validator qui va nous permettre de vérifier l'unicité de nos users. 
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * On créer ici un modèle pour les utilisateurs.
 */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
});

/**
 * On applique ici l'unique validator à notre schéma.
 */
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
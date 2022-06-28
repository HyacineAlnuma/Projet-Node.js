/**
 * On importe notre application.
 */
const http = require('http');
const app = require('./app');

/**
 * Le code suivant va nous permettre de normaliser le port.
 */
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

/**
 * Ici on configure le port qui va être utilisé.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Le code suivant va nous permettre de gérer les erreurs.
 */
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * On créer ici le serveur.
 */
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(process.env.PORT || 3000);
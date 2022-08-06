/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* importar o módulo do express-session */
var expressSession = require('express-session');

/* importar o módulo do qs */
var qs = require('qs')

/* iniciar o objeto do express */
var app = express();

/* configurar o middleware body-parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* configurar o middleware express-validator */
app.use(expressValidator());

/* configurar o middleware express-session */
app.use(expressSession({
	secret: 'kdfhakdfkjahdkfjhasdlkfjhlakjdfhlaksdjfdkashfdkahsldf',
	resave: false,
	saveUninitialized: false
}));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Tipo-Usuario, Id-Usuario");
    next();
});


/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign({cwd: 'src'})
	.include('routes')
	.then('models.js')
	.then('controllers')
	.then('services')
	.then('utils')
	.into(app);

// Autoload das variáveis de ambiente
consign({cwd: 'environments'})
	.include('env.js')
	.into(app);

/* exportar o objeto app */
module.exports = app;
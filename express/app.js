﻿/* Importando as configurações do servidor */
var app = require('./config/server');

/* Colocar o servidor online */
app.listen(3000, function(){
	console.log('Servidor online na porta 3000');
})
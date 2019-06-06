const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new mongoose.Schema({
	usuario: {
		type: Schema.ObjectId,
		ref: "User"
	},
  tipoDeServicio: {
		nombre: String,
		especificamente: String,
	},
  cliente: {
		tipo: String,
		tipoDocumento: String,
		documento: String,
		nombreEmpresa: String
	},
  origen: String,
  destino: String,
	mensaje: String,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	estado: {
		type: String,
		default: 'recibido'
	},
	operadorId: {
		type: Schema.ObjectId,
		ref: "User"
	},
});

module.exports = mongoose.model('Request', requestSchema)

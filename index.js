// index.js

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Rota do webhook para receber os dados do Meeting Baas
app.post("/webhook", (req, res) => {
	const { event, data } = req.body;

	console.log(`Evento recebido: ${event}`);

	switch (event) {
		case "bot.status_change":
			console.log("Status do bot mudou:", data);
			// Tratar o status do bot
			break;

		case "complete":
			console.log("Reunião completa!");
			const { mp4, speakers, transcript } = data;
			console.log("URL do MP4:", mp4);
			console.log("Participantes:", speakers);
			console.log("Transcrição:", transcript);
			// Armazenar ou processar dados pós-reunião
			break;

		case "failed":
			console.log("Erro ao processar a reunião:", data.error);
			// Tratar falha
			break;

		default:
			console.log("Evento desconhecido:", event);
	}

	// Responder com sucesso
	res.status(200).send("Evento recebido");
});

// Iniciar o servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

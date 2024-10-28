// index.js

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Rota para iniciar o fluxo OAuth
app.get("/auth", (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/calendar.readonly"],
	});
	res.redirect(url);
});

// Rota de callback após autorização
app.get("/oauth2callback", async (req, res) => {
	const { code } = req.query;
	try {
		const { tokens } = await oauth2Client.getToken(code);
		// Armazene os tokens (access_token e refresh_token) de forma segura
		// Exemplo: salvar em um banco de dados
		console.log(tokens);
		res.send("Autorização bem-sucedida!");
	} catch (error) {
		res.status(500).send("Erro ao obter tokens: " + error.message);
	}
});

app.listen(3000, () => {
	console.log("Servidor rodando na porta 3000");
});

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

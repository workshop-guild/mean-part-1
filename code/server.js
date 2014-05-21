var express = require('express'),
		http = require('http'),
		bodyParser = require('body-parser'),
		game = require('./game'),
		app;

function init(){
	// express
	app = express();
	game = game();
	
	// middleware
	app.use('/public', express.static('code/public')); // this middleware serves static files in code/public at the route /public
	app.use(bodyParser()); // this middleware parses the body of the html request, and populates req.body
	
	// routing
	var router = express.Router();
	
	router.get('/', function(req, res){
		res.set('Content-Type', 'text/html');
		res.sendfile('code/public/index.html');
	})
	
	router.get('/404', function(req, res){
		res.send(404, "Oops!");
	})
	
	router.get('/start', function(req, res){
		var state = game.start();
		game.saveState(req.ip, state);
		var result = {
			display: state.display,
			guesses: state.guesses,
			lives: state.lives
		}
		res.send(result);
	})
	
	router.post('/guess', function(req, res){
		var state = game.getState(req.ip);
		game.guess(req.body.guess, state);
		var result = {
			display: state.display,
			guesses: state.guesses,
			lives: state.lives
		}
		res.send(result);
	})
	
	router.all('*', function(req, res){
		res.redirect('/404');
	});
	
	app.use('/', router);

	// start server
	var server = http.createServer(app).listen(8080, function(){
		console.log(server.address());
		console.log("Hangman server running...");
	});
}

init();
$(document).ready(function hangman(){
	var debug = true;
	if ( debug ){
		$('body > *').addClass("debug");
	}
	
	var display = $('#hangman-display'),
		guesses = $('#hangman-guesses'),
		hearts = $('#hangman-lives');
	
	// initialize the game state
	$.ajax({
		type: "GET",
		url: "start"
	})
	.done(function(res){
		updateGame(res);
	});
	
	guesses.find('button').each(function(){
		// Uppercase character in ASCII
		$(this).text(String.fromCharCode(64 + parseInt($(this).text())));
		
		$(this).click(function(e){
			e.preventDefault();
			
			$.ajax({
				type: "POST",
				url: "guess",
				data: { guess: $(e.toElement).text() }
			})
			.done(function(res){
				updateGame(res);
			});
		})
	});
	
	function updateGame(res){
		updateGuesses(res.guesses);
		updateDisplay(res.display);
		updateLives(res.lives);
	};
	
	function updateGuesses(letters){
		guesses.find('button').each(function(){
			if (letters.indexOf($(this).text()) >= 0){
				$(this).prop('disabled', true);
			}
		});
	}
	
	function updateDisplay(word){
		display.html("<h1>" + word + "</h1>");
	}
	
	function updateLives(lives){
		var i = 0;
		hearts.empty();
		for (i = 0; i < lives; ++i){
			hearts.append("<i class='fa fa-heart'>");
		}
		for (i = 0; i < 5 - lives; ++i){
			hearts.append("<i class='fa fa-heart-o'>");
		}
	}
});
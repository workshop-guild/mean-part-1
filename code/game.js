var request = require('request'),
		words; // storing words in-process memory, this is not scalable since requests can be sent to different processes on multi-node, or proxied.

var game = function(){
	// game state
	var states = {};
	var game = {
		init: function(){
			request({
				url: 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=8&maxLength=-1&limit=50&api_key=f0c77cb001282a51595e30318ac5f7aff8c03ad49b528bed4',				
				//proxy: "http://10.25.2.16:8080"
			}, function(err, res, body){
				if (!err && res.statusCode == 200) {
					words = JSON.parse(body).map(function(pair){ return pair.word; });
				}
			});
			return this;
		},
		// game actions
		start: function(){
			var word = words[Math.floor(Math.random()*words.length)].toUpperCase();
			var obj = {
				word: word,
				display: word.replace(/[A-Z]/gi, "_"),
				guesses: [],
				lives: 5
			};
			console.log(obj);
			return obj;
		},
		guess: function(letter, state){
			state.guesses.push(letter);
			var indices = this.getIndices_r(letter, state.word);
			if (indices.length > 0){
				state.display = this.updateDisplay(state.display, letter, indices);
			} else {
				state.lives -= 1;
				if (state.lives <= 0){
				}
			}
		},
		// game state
		getState: function(key){
			return states[key];
		},
		saveState: function(key, value){
			states[key] = value;
		},
		// helper functions
		getIndices_r: function(letter, word, offset){
			var index = word.indexOf(letter);
			offset = offset || 0;
			if (index < 0){
				return [];
			} else {
				return [index + offset].concat(this.getIndices_r(letter, word.substr(index + 1), index + 1 + offset));
			}
		},
		updateDisplay: function(displayString, letter, indices){
			var result = displayString;
			indices.forEach(function(i){
				result = result.substr(0, i) + letter + result.substr(i+1);
			});
			return result;
		}
	};
	return game.init();
};

module.exports = game;
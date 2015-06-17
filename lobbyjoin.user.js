// ==UserScript==
// @name        rShadowhand's Steam Summer Game Lobby Joiner
// @namespace   *steamcommunity.com/minigame*
// @description A script that makes it easier to join to lobbies.
// @version     1.0.6
// @match       *://steamcommunity.com/minigame*
// @match       *://steamcommunity.com//minigame*
// @exclude     *://steamcommunity.com/minigame/towerattack*
// @grant       none
// @updateURL https://raw.githubusercontent.com/RShadowhand/monsterGameLobbyJoin/master/lobbyjoin.user.js
// @downloadURL https://raw.githubusercontent.com/RShadowhand/monsterGameLobbyJoin/master/lobbyjoin.user.js
// ==/UserScript==

if (location.toString().indexOf("no=") > -1) {
	var realURL = location.toString().substring(0, location.toString().indexOf("no=") - 1)
} else {
	var realURL = location;
}

game_div = document.getElementsByClassName('player_count')[0]
	game_div.innerHTML = "<input name='lobbyno' id='lobbyno' type='text'>"

	game_div.addEventListener("keydown", function (e) {
		if (e.keyCode == 13) {
			JoinGame(game_div.children[0].value);
		}
	}, false);

if (location.toString().indexOf("no=") > -1) {
	game_div.children[0].value = location.toString().substring(location.toString().indexOf("no=") + 3)
}

function JoinGameHelper(gameid) {
	$J.post(
		'http://steamcommunity.com/minigame/ajaxjoingame/', {
		'gameid' : gameid
	}).done(function (json) {
		if (json.success == '1') {
			top.location.href = 'http://steamcommunity.com/minigame/towerattack/';
		} else {
			ShowAlertDialog('Error', 'There was a problem trying to join a game. Please try again later.');
			top.location.href = realURL + "?no=" + game_div.children[0].value;
		}
	}).fail(function (jqXHR) {
		var responseJSON = jqXHR.responseText.evalJSON();
		if (responseJSON.success == '24' && responseJSON.errorMsg) {
			ShowAlertDialog('Error', responseJSON.errorMsg);
		} else if (responseJSON.success == '25') {
			ShowAlertDialog('Error', 'There was a problem trying to join the game: it already has the maximum number of players.');
		} else {
			ShowAlertDialog('Error', 'There was a problem trying to join a game. Please try again later.');
			top.location.href = realURL + "?no=" + game_div.children[0].value;
		}
	});
}

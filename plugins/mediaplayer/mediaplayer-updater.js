/*\
title: $:/plugins/bimlas/mediaplayer/mediaplayer-updater.js
type: application/javascript
module-type: widget

Play music, video continuously, without interruption.

\*/
(function() {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	var Widget = require("$:/core/modules/widgets/widget.js").widget;

	var MediaplayerUpdaterWidget = function(parseTreeNode,options) {
		this.initialise(parseTreeNode,options);
	};

	/*
	Inherit from the base widget class
	*/
	MediaplayerUpdaterWidget.prototype = new Widget();

	MediaplayerUpdaterWidget.prototype._stateTiddler = "$:/state/bimlas/mediaplayer";
	MediaplayerUpdaterWidget.prototype._previousStoryList = '';
	MediaplayerUpdaterWidget.prototype._currentPlayer = undefined;

	MediaplayerUpdaterWidget.prototype._updatePlayers = function() {
		var self = this;
		var data = this.wiki.getTiddlerData(this._stateTiddler, {});
		var players = document.getElementsByTagName('audio');
		var shouldRepeat = this.wiki.extractTiddlerDataItem(this._stateTiddler,'repeat','no') === 'yes';
		var shouldPlayPause = this.wiki.extractTiddlerDataItem(this._stateTiddler,'play-pause','') === 'yes';
		var shouldJumpTrack = this.wiki.extractTiddlerDataItem(this._stateTiddler,'jump','');

		if(players.length) {
			for(var i = 0; i < players.length; i++) {
				players[i].addEventListener('playing',function() {
					self._currentPlayer = this;
				});
				players[i].nextPlayer = players[i + 1];
				players[i].prevPlayer = players[i + -1];
				players[i].addEventListener('ended',function() {
					if(this.nextPlayer) {
						this.nextPlayer.play();
					}
				});
			}
			players[players.length - 1].nextPlayer = shouldRepeat ? players[0] : undefined;
			players[0].prevPlayer = shouldRepeat ? players[players.length - 1] : undefined;
		}

		if(shouldPlayPause) {
			data["play-pause"] = '';
			this.wiki.setTiddlerData(this._stateTiddler, data);

			if(!this._currentPlayer) {
				this._currentPlayer = document.querySelector('audio');
			}
			if(this._currentPlayer.paused) {
				this._currentPlayer.play();
			} else {
				this._currentPlayer.pause();
			}
		}

		if(shouldJumpTrack) {
			data.jump = '';
			this.wiki.setTiddlerData(this._stateTiddler, data);

			if(!this._currentPlayer) {
				return;
			}

			this._currentPlayer.pause();
			this._currentPlayer.currentTime = 0;

			if((shouldJumpTrack === "next") && this._currentPlayer.nextPlayer) {
				this._currentPlayer.nextPlayer.play();
			} else if((shouldJumpTrack === "prev") && this._currentPlayer.prevPlayer) {
				this._currentPlayer.prevPlayer.play();
			} else {
				this._currentPlayer = undefined;
			}
		}

	};

	/*
	Render this widget into the DOM
	*/
	MediaplayerUpdaterWidget.prototype.render = function(parent,nextSibling) {
	};

	/*
	Compute the internal state of the widget
	*/
	MediaplayerUpdaterWidget.prototype.execute = function() {
	};

	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	MediaplayerUpdaterWidget.prototype.refresh = function(changedTiddlers) {
		var currentStoryList = this.wiki.getTiddlerList('$:/StoryList').toString();
		if((this._stateTiddler in changedTiddlers) || (currentStoryList !== this._previousStoryList)) {
			this._updatePlayers();
			this._previousStoryList = currentStoryList;
		}
		return false;
	};

	exports["mediaplayer-updater"] = MediaplayerUpdaterWidget;

})();

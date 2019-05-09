/*\
title: $:/plugins/bimlas/mediaplayer/mediaplayer-updater.js
type: application/javascript
module-type: widget

Play music, video continuously, without interruption.

\*/
(function() {

	/*jslint node: true, browser: true */
	/*global $tw: true */
	"use strict";

	var Widget = require("$:/core/modules/widgets/widget.js").widget;

	var MediaplayerUpdaterWidget = function(parseTreeNode,options) {
		this.initialise(parseTreeNode,options);
	};

	/*
	Inherit from the base widget class
	*/
	MediaplayerUpdaterWidget.prototype = new Widget();

	MediaplayerUpdaterWidget.prototype._play = function(tiddlerTitle) {
		var data = this.wiki.getTiddlerData(this._stateTiddler, {});
		data.currentSource = tiddlerTitle;
		this.wiki.setTiddlerData(this._stateTiddler, data);

		var tiddler = this.wiki.getTiddler(tiddlerTitle);
		if(!tiddler) {
			this._player.pause();
			this._player.currentTime = 0;
			this._player.source = undefined;
			this._player._tiddler = undefined;
			return;
		}

		this._player._tiddler = tiddler.fields.title;
		this._player.src = tiddler.fields._canonical_uri || tiddler.fields.title;
		this._player.currentTime = 0;
		this._player.play();
	};

	MediaplayerUpdaterWidget.prototype._jump = function(direction = 1) {
		var playlist = this.wiki.filterTiddlers(this.getVariable("filterExpression"));

		if(!playlist) return;

		var tiddler = playlist[playlist.indexOf(this._player._tiddler) + direction];
		var shouldRepeat = this.wiki.getTiddlerData(this._stateTiddler, {}).repeat === 'yes';
		if(!tiddler && shouldRepeat) {
			tiddler = direction === 1 ? playlist[0] : playlist[playlist.length-1];
		}

		this._play(tiddler);
	};

	/*
	Render this widget into the DOM
	*/
	MediaplayerUpdaterWidget.prototype.render = function(parent,nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();
		this.execute();
		parent.insertBefore(this._player,nextSibling);
		this.domNodes.push(this._player);
	};

	/*
	Compute the internal state of the widget
	*/
	MediaplayerUpdaterWidget.prototype.execute = function() {
		var self = this;

		this._stateTiddler = "$:/state/bimlas/mediaplayer";
		this._player = this.document.createElement("video");
		this._player.controls = true;
		this._player.id = "bimlas-mediaplayer-widget";

		this._player.addEventListener('ended', function() {
			self._jump();
		});

		$tw.rootWidget.addEventListener("bimlas-mediaplayer-change-source",function(event) {
			self._play(event.tiddlerTitle);
		});
		$tw.rootWidget.addEventListener("bimlas-mediaplayer-jump-next",function() {
			self._jump(1);
		});
		$tw.rootWidget.addEventListener("bimlas-mediaplayer-jump-prev",function() {
			self._jump(-1);
		});
	};

	exports["mediaplayer-updater"] = MediaplayerUpdaterWidget;

})();

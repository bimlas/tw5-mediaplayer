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
	};

	/*
	Render this widget into the DOM
	*/
	MediaplayerUpdaterWidget.prototype.render = function(parent,nextSibling) {
		// this.parentDomNode = parent;
		// this.computeAttributes();
		this.execute();
		// parent.insertBefore(this._player,nextSibling);
		// this.domNodes.push(this._player);
	};

	/*
	Compute the internal state of the widget
	*/
	MediaplayerUpdaterWidget.prototype.execute = function() {
		var self = this;
		this._stateTiddler = "$:/state/bimlas/mediaplayer";

		// TODO: Let it continue playing automatically
		// TODO: Add a timeout setting for non-media tiddlers (e.g. images)
		// this._player.addEventListener('ended', function() {
		// 	self._play(???);
		// });
	};

	exports["mediaplayer-updater"] = MediaplayerUpdaterWidget;

})();

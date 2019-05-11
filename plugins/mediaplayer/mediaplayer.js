/*\
title: $:/plugins/bimlas/mediaplayer/mediaplayer.js
type: application/javascript
module-type: widget

Play music, video continuously, without interruption.

\*/
(function() {

	/*jslint node: true, browser: true */
	/*global $tw: true */
	"use strict";

	var Transclude = require("$:/core/modules/widgets/transclude.js").transclude;

	var MediaplayerWidget = function(parseTreeNode,options) {
		this.initialise(parseTreeNode,options);
	};

	/*
	Inherit from the base widget class
	*/
	MediaplayerWidget.prototype = new Transclude();

	/*
	Render this widget into the DOM
	*/
	// TODO: Add event listener when updated, so call super.extend()
	// TODO: Add class
	// MediaplayerWidget.prototype.execute = function(parent,nextSibling) {
	// 	parent.execute(parent,nextSibling);
	// 	console.log(this.children);
	// };

	exports["mediaplayer"] = MediaplayerWidget;

})();

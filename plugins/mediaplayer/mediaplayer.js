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
	// TODO: Add class
	MediaplayerWidget.prototype.execute = function(parent,nextSibling) {
		Transclude.prototype.execute.call(this,parent,nextSibling);

		var self = this;
		$tw.utils.nextTick(function() {
			var domNode = self.findFirstDomNode();
			if(domNode) {
				var clickEvent = this.document.createEvent("Events");
				clickEvent.initEvent("click",true,false);
				if(domNode.tagName === "AUDIO" || domNode.tagName === "VIDEO") {
					domNode.addEventListener('ended',function() {
						document.getElementsByClassName("bimlas-mediaplayer-next")[0].dispatchEvent(clickEvent);
					});
				} else {
					setTimeout(function() {
						document.getElementsByClassName("bimlas-mediaplayer-next")[0].dispatchEvent(clickEvent);
					}, self.wiki.extractTiddlerDataItem("$:/state/bimlas/mediaplayer", "timeout"));
				}
			}
		});
	};

	exports["mediaplayer"] = MediaplayerWidget;

})();

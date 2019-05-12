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
	MediaplayerWidget.prototype.execute = function(parent,nextSibling) {
		Transclude.prototype.execute.call(this,parent,nextSibling);

		var self = this;
		self._stateTiddler = "$:/state/bimlas/mediaplayer";

		$tw.utils.nextTick(function() {
			var domNode = self.findFirstDomNode();
			if(!domNode) return;

			domNode.className = "bimlas-mediaplayer-player";

			if(self.wiki.extractTiddlerDataItem(self._stateTiddler, "play") !== "yes") return;

			var clickEvent = this.document.createEvent("Events");
			clickEvent.initEvent("click",true,false);
			if(domNode.tagName === "AUDIO" || domNode.tagName === "VIDEO") {
				domNode.play();
				domNode.addEventListener('ended',function() {
					document.getElementsByClassName("bimlas-mediaplayer-next")[0].dispatchEvent(clickEvent);
				});
			} else {
				setTimeout(function() {
					document.getElementsByClassName("bimlas-mediaplayer-next")[0].dispatchEvent(clickEvent);
				}, self.wiki.extractTiddlerDataItem(self._stateTiddler, "timeout"));
			}
		});
	};

	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	MediaplayerWidget.prototype.refresh = function(changedTiddlers) {
		var results = Transclude.prototype.refresh.call(this,changedTiddlers);
		if (this._stateTiddler in changedTiddlers) {
			this.refreshSelf();
			return true;
		}
		return results;
	};

	exports["mediaplayer"] = MediaplayerWidget;

})();

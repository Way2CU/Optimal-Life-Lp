/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

handle_dialog_video = function(event) {
	event.preventDefault();
	Site.dialog_video
		.setTitle(this.getAttribute('title'))
		.setContentFromURL(this.getAttribute('href'))
		.set_size('600px', '400px')
		.showWhenReady();
}

handle_dialog_form = function(event) {
	event.preventDefault();
	Site.dialog_form.show();

}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	//Video link connected to click event
	Site.video_link = document.querySelector('a.youtube_link');
	Site.video_link.addEventListener('click', handle_dialog_video);
	// New dialog video
	Site.dialog_video = new Caracal.Dialog();

	var id_list = ['stomach', 'cure', 'bariatric', 'nutrition', 'emotion', 'fitness', 'sleep'];

	Site.dialogs = new Object();

	for(var i=0; i < id_list.length; i++) {
	    var id = id_list[i];
	    var links = document.querySelectorAll('a[href="#' + id + '"]');

	    Site.dialogs[id] = new Caracal.Dialog();
	    Site.dialogs[id].set_content_from_dom('#' + id);

	    var handle_click = function(event) {
	        event.preventDefault();

	        var id = this.getAttribute('href').substr(1);
	        Site.dialogs[id].open();
	    };

	    links[0].addEventListener('click', handle_click);
	    links[1].addEventListener('click', handle_click);
	}

	// dialog which contains form
	Site.dialog_form = new Caracal.Dialog();
	Site.dialog_form
		.set_content_from_dom('div#contact_dialog')
		.add_class('dialog_form')
		.set_title(language_handler.getText(null, 'form_title'));

	if (!Site.is_mobile()) {
		Site.show_dialog_button = document.querySelector('a.call');
		Site.show_dialog_button.addEventListener('click', handle_dialog_form);
	}

	// push site version to data layer
	var version = document.querySelector('header').classList.contains('first_version') ? 'first' : 'second';
	window.dataLayer = window.dataLayer || new Array();
	window.dataLayer.push({'version': version});
};


// connect document `load` event with handler function
$(Site.on_load);

'use strict';

/* Filters */

angular

.module('Infoscreenv2.filters', [])

.filter('interpolate', interpolate)
.filter('highlight', highlight)
.filter('cut', cut)
.filter('sumByKey', sumByKey);

interpolate.$inject = ['version'];
highlight.$inject = ['$sce'];
cut.$inject = [];
sumByKey.$inject = [];

function interpolate(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
}

function highlight($sce) {
	return function(text, searchvalue) {
		if (searchvalue) text = text.replace(new RegExp('('+searchvalue+')', 'gi'),
			'<strong>$1</strong>'
		)
		return $sce.trustAsHtml(text)
	}
}

function cut() {
	return function (value, wordwise, max, tail) {
			value = String(value);
			if (!value) return '';

			max = parseInt(max, 10);
			if (!max) return value;
			if (value.length <= max) return value;

			value = value.substr(0, max);
			if (wordwise) {
					var lastspace = value.lastIndexOf(' ');
					if (lastspace !== -1) {
						//Also remove . and , so its gives a cleaner result.
						if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
							lastspace = lastspace - 1;
						}
						value = value.substr(0, lastspace);
					}
			}
			//return value + (tail || ' …');
			return value + (tail || ' …');
	};
}

function sumByKey() {
	return function(data, key) {
		if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
				return 0;
		}

		var sum = 0;
		angular.forEach(data, function(obj, objKey){
				//sum+= parseFloat(obj[key]);
				sum+= obj[key];
		});

		return sum;
	};
}

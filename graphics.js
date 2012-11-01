(function(App, $, _, undefined){


App.Graphics = function(canvasId) {

	var screen = document.getElementById(canvasId),
		context = screen.getContext('2d'),
		_width = screen.width,
		_height = screen.height;

	var clear = function (color) {
		context.fillStyle = color || '#fff';
		context.fillRect(0, 0, _width, _height);
	};

	return {
		
		circle: function(x, y, r) {

		},

		rect: function(x, y, w, h, fillColor) {
			context.rect(x, y, w, h);
			context.stroke();
		},

		clear: clear
	};

};


}(window[window.APPNS], window.jQuery, window._));
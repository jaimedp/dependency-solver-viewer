(function(App, _, undefined) {
	var Vector = function (x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

	_.extend(Vector.prototype, {
		mag: function () {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},

		normal: function () {
			return Math.sqrt(this.dot(this));
		},

		normalized: function () {
			var mag = this.mag();
			return new Vector(this.x / mag, this.y / mag);
		},

		add: function(vector) {
			if(typeof vector === 'number') {
				return new Vector(this.x + vector, this.y + vector);
			} else {
				return new Vector(this.x + vector.x, this.y + vector.y);
			}
		},

		sub: function(vector) {
			if(typeof vector === 'number') {
				return new Vector(this.x - vector, this.y - vector);
			} else {
				return new Vector(this.x - vector.x, this.y - vector.y);
			}
		},

		mul: function (number) {
			return new Vector(this.x * number, this.y * number);
		},

		dot: function (vector) {
			return this.x * vector.x + this.y * vector.y;
		},

		neg: function () {
			return new Vector(-this.x, -this.y);
		},

		perp: function () {
			return new Vector(this.x, -this.y);
		},

		random: function (low, high) {
			var x = low + Math.floor(Math.random() * high),
				y = low + Math.floor(Math.random() * high);

			return new Vector(x, y);
		}
	});

	App.Point = App.Vector = Vector;
})(window[window.APPNS], window._);
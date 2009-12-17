/*
Script: ART.Shape.js

License:
	MIT-style license.
*/

// ART.Shape Class stub.
// Will probably support defining shapes as json at some point.
// Right now, its just functions.

ART.Shape = function(shape){
	return shape;
};

ART.Shape.define = function(name, shape){
	if ($type(name) == "object") {
		for (var shape in shapes) arguments.callee(shape, shapes[shape]);
	} else {
		ART.Shape[name.camelCase()] = new ART.Shape(shape);
	}
	return this;
};

ART.Shape.lookup = function(name){
	return ART.Shape[name.camelCase()];
};

// connect to ART.Paint

ART.Paint.implement({

	shape: function(shape){
		var args = Array.slice(arguments, 1);
		if (typeof shape == 'string') shape = ART.Shape.lookup(shape.camelCase());
		if (!shape) return this;
		this.save();
		shape.apply(this, args);
		return this.restore();
	}
	
});

// default shapes

ART.Shape.define('rectangle', function(end){
	this.lineBy({x: end.x, y: 0}).lineBy({x: 0, y: end.y}).lineBy({x: -end.x, y: 0}).lineBy({x: 0, y: -end.y});
});

ART.Shape.define('ellipse', function(end){
	var radius = {x: end.x / 2, y: end.y / 2};
	this.moveBy({x: 0, y: radius.y});
	this.roundCapLeftBy({x: radius.x, y: -radius.y}).roundCapRightBy({x: radius.x, y: radius.y});
	this.roundCapLeftBy({x: -radius.x, y: radius.y}).roundCapRightBy({x: -radius.x, y: -radius.y});
	this.moveBy({x: end.x, y: - radius.y + end.y});
});
	
ART.Shape.define('rounded-rectangle', function(end, radius){
	if (radius == null) radius = [5, 5, 5, 5];
	if (typeof radius == 'number') radius = [radius, radius, radius, radius];
	
	var tl = radius[0], tr = radius[1], br = radius[2], bl = radius[3];
		
	this.moveBy({x: 0, y: tl});
	
	if (end.x < 0) this.moveBy({x: end.x, y: 0});
	if (end.y < 0) this.moveBy({x: 0, y: end.y});
	
	if (tl > 0) this.roundCapLeftBy({x: tl, y: -tl});
	this.lineBy({x: Math.abs(end.x) - (tr + tl), y: 0});
	
	if (tr > 0) this.roundCapRightBy({x: tr, y: tr});
	this.lineBy({x: 0, y: Math.abs(end.y) - (tr + br)});
	
	if (br > 0) this.roundCapLeftBy({x: -br, y: br});
	this.lineBy({x: - Math.abs(end.x) + (br + bl), y: 0});
	
	if (bl > 0) this.roundCapRightBy({x: -bl, y: -bl});
	this.lineBy({x: 0, y: - Math.abs(end.y) + (bl + tl)});
	
	this.moveBy({x: end.x, y: -tl + end.y});
});

// And some extra glyphs

ART.Shape.define('drag-handle', function(size) {
	this.lineBy({x: -size, y: size});
	this.moveBy({x: 0.4 * size, y: 0});
	this.lineBy({x: 0.6 * size, y: - 0.6 * size});
	this.moveBy({x: 0, y: 0.4 * size});
	this.lineBy({x: - 0.2 * size, y: 0.2 * size});
})

ART.Shape.define('horizontal-pill', function(size){
	var r = (size.y / 2);
	this.shape('rounded-rectangle', {x: size.x, y: size.y}, r);
});

ART.Shape.define('vertical-pill', function(size){
	var r = (size.x / 2);
	this.shape('rounded-rectangle', {x: size.x, y: size.y}, r);
});

ART.Shape.define('plus-icon', function(size){
	this.moveBy({x: 0, y: (size.y / 2)});
	this.lineBy({x: size.x, y: 0});
	this.moveBy({x: -(size.x / 2), y: -(size.y / 2)});
	this.lineBy({x: 0, y: size.y});
});

ART.Shape.define('resize-icon', function(size){
	this.moveBy({x: size.x, y: 0});
	this.lineBy({x: -size.x, y: size.y});
});

ART.Shape.define('minus-icon', function(size){
	this.moveBy({x: 0, y: (size.y / 2)});
	this.lineBy({x: size.x, y: 0});
});

ART.Shape.define('search-icon', function(size){
	ratio = 0.8;
	var max = ratio, min = 1 - ratio;
	this.shape('ellipse', {x: size.x * max, y: size.y * max});
	var lift = {x: -(size.x * min) / 2, y: -(size.y * min) / 2};
	this.moveBy(lift);
	this.lineBy({x: (size.x * min) - lift.x, y: (size.y * min) - lift.y});
});

ART.Shape.define('close-icon', function(size){
	this.moveBy({x: size.x, y: 0});
	this.lineBy({x: -size.x, y: size.y});
	this.moveBy({x: 0, y: -size.y});
	this.lineBy({x: size.x, y: size.y});
});

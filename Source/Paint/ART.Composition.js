ART.Composition = function(Composition){
	return Composition;
};

ART.Composition.define = function(name, Composition){
	if ($type(name) == "object") {
		for (var Composition in Compositions) arguments.callee(Composition, Compositions[Composition]);
	} else {
		ART.Composition[name.camelCase()] = new ART.Composition(Composition);
	}
	return this;
};

ART.Composition.lookup = function(name){
	return ART.Composition[name.camelCase()];
};


ART.Composition.define('rectangle', function() {
	this.shape('rounded-rectangle', {x: style.width - 2, y: style.headerHeight - 2}, [style.borderRadiusTopLeft, style.borderRadiusTopRight, 0, 0]);
	this.end({'fill': true, 'fillColor': style.headerReflectionColor});
      
	this.moveBy({x: 1, y: 2});
	this.shape('rounded-rectangle', {x: style.width - 2, y: style.headerHeight - 3}, [style.borderRadiusBottomLeft, style.borderRadiusBottomRight, 0, 0]);
	this.end({'fill': true, 'fillColor': style.headerBackgroundColor});
});

ART.Paint.implement({

	composition: function(composition){
		var args = Array.slice(arguments, 1);
		if (typeof shape == 'string') composition = ART.Shape.lookup(composition.camelCase());
		if (!composition) return this;
		this.save();
		composition.apply(this, args);
		return this.restore();
	}
	
});
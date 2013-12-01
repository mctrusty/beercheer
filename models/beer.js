var uu = require('underscore');
module.exports = function(sequelize, DataTypes){
    return sequelize.define("beer", {
	beer: {
	    type: DataTypes.STRING
	    /*get : function(){ this.getDataValue('beer'); },
	    set : function(v) { this.setDataValue('beer', v.toString());}*/
	},
	brewer: {type: DataTypes.STRING}
    },{
	classMethods: {
	    allByBrewer: function(brewer, cb) {
		this.findAll({where: {brewer: brewer}}).success(function(brews){
		    cb(uu.invoke(brews, 'toJSON'));
		});
	    }
	}
    }
    );
};

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
	    allByBrewer: function(brewer, successcb, errcb) {
		this.findAll({where: {brewer: brewer}}).success(function(brews){
		    successcb(uu.invoke(brews, 'toJSON'));
		}).error(errcb);
	    }
	}
    }
    );
};

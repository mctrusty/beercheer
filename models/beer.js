var uu = require('underscore');
module.exports = function(sequelize, DataTypes){
    return sequelize.define("beer", {
	beer: {type: DataTypes.STRING},
	brewer: {type: DataTypes.STRING}
    },{
	classMethods: {
	    allByBrewer: function(brewer) {
		this.findAll({where: {brewer: brewer}}).success(function(brews){
		    console.log(uu.invoke(brews, 'toJSON'));
		});
	    }
	}
    }
    );
};

var uu = require('underscore');
var qstring = "SELECT * FROM beers WHERE to_tsvector(coalesce(beer,'1') || ' ' || coalesce(brewer, '')) @@ plainto_tsquery(:qterms)";
module.exports = function(sequelize, DataTypes){
    return sequelize.define("beer", {
	beer: {
	    type: DataTypes.STRING
	    /*get : function(){ this.getDataValue('beer'); },
	    set : function(v) { this.setDataValue('beer', v.toString());}*/
	},
	brewer: {type: DataTypes.STRING},
	store: {type: DataTypes.STRING},
	qty: {type: DataTypes.STRING},
	price: {type: DataTypes.STRING}
    },{
	classMethods: {
	    allByBrewer: function(brewer, successcb, errcb) {
		this.findAll({where: {brewer: brewer}}).success(function(brews){
		    successcb(uu.invoke(brews, 'toJSON'));
		}).error(errcb);
	    },
	    fullTextSearch: function(qparms, successcb, errcb) {
		sequelize.query(qstring, this, {raw: false}, {qterms: qparms}).success(function(brews) {
		    successcb(uu.invoke(brews, 'toJSON'));
		}).error(errcb);
	    }
	}
    }
    );
};

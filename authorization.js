var acl = require('acl');
var mongoose = require('mongoose');
var config = require('./config');

acl = new acl(new acl.mongodbBackend(mongoose.connection.db, config.db.aclCollectionPrefix), { debug: function(string) { console.log(string); } });

module.exports = {
	init: function() {
		//acl.addRoleParents('superAdmin', 'admin');
		//acl.addRoleParents('admin', 'user');

		acl.allow([
			{
				roles: ['superAdmin', 'partnerAdmin', 'partnerUser', 'customer', 'guest' ],
				allows: [
					{ resources: '/api/menu/getByMenuId', permissions: 'get'}
				]
			},
			{
				roles: ['superAdmin', 'partnerAdmin', 'partnerUser'],
				allows: [
					{resources: '/api/menu/postMenuEntry', permissions:['post', 'put', 'delete']}
				]
			},
			{
				roles: ['superAdmin1', 'partnerAdmin1', 'partnerUser1'],
				allows: [
					{resources: '/api/order/getByEntityIdAndRestaurantIdAndOrderStatus/1', permissions:['get','post', 'put', 'delete']},
					{resources: '/api/order/updateOrder/1', permissions:['get','post', 'put', 'delete']},
					{resources: '/api/order/getByOrderStatus?', permissions:['get','post', 'put', 'delete']}
				]
			}
		]);
	},

	getAcl: function() {
		return acl;
	}
};

const mongoose = require('mongoose');
const createQuery = require('@wandererin/odata-v4-mongodb').createQuery;
const ObjectID = require('mongodb').ObjectID;

const Product = mongoose.model('Product', {name: String, quantity: Number, description: String, price: Number});

mongoose
  .connect('mongodb://localhost:27017/sample',
	{useNewUrlParser: true, useUnifiedTopology: true}
  );

const productCollections = new Product(
  {
	  name: 'Some product',
	  quantity: 1,
	  description: "description",
	  price: 1.2
  }
);

productCollections.save().then(() => console.log('saved'));

class ProductCollection {
	
	collections = Product;

	objectIdWithTimestamp(timestamp) {
		timestamp = new Date(parseFloat(timestamp));
		const hexSeconds = Math.floor(timestamp / 1000).toString(16);
		return new ObjectID(hexSeconds + '0000000000000000');
	}
	
	isObject(value) {
		return (typeof value === 'object' && value !== null);
	}
	
	list(queryParams) {
		
		if (queryParams) {
			
			if (this.isObject(queryParams)) {
				queryParams = this.queryParamsToString(queryParams);
			}
			
			if (queryParams[0] === '&') {
				queryParams = queryParams.substring(1);
			}
			queryParams = queryParams.replace('&&', '&');
		}
		
		const query = createQuery(queryParams);
		const page = {};
		
		return this.collections.find(query.query || {})
		  .select(query.projection || {})
		  .sort(query.sort || {_id: -1})
		  .skip(query.skip || 0)
		  .limit(query.limit || 100)
		  .then(data => {
			  page.items = data || [];
			  return page;
		  })
		  .catch((e) => {
			  throw new Error(e.message, 'LIST');
		  });
	}
	
	queryParamsToString(query) {
		let str = '';
		
		for (const prop in query) {
			if (query.hasOwnProperty(prop)) {
				if (prop === '$filter') {
					// used for skip special character in eq and other
					// some framework and server aplayed default URI transfor this just to be safe
					query[prop] = encodeURIComponent(query[prop]);
				}
				str += `${prop}=${query[prop]}&`;
			}
		}
		
		return str.substr(0, str.length - 1);
	}
}

let product = new ProductCollection()

module.exports = product;

const request = require('supertest')
const app = require('../app')

describe('Product odata', () => {
	
	it('should filter with zero filter', async () => {
		const res = await request(app)
		  .get('/api/products')
		  .query({
			  "$filter": "description eq description and price gt 2"
		  })
		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('items')
	})
	
	it('should filter with 1 item', async () => {
		const res = await request(app)
		  .get('/api/products')
		  .query({
			  "$filter": "description eq description and price lt 1",
			  "$top": '1',
		  })
		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('items')
	})
})

const request = require('supertest');
const app = require('/home/niveus/nodeassignment31/main.js'); 


describe('Express.js application', () => {
  it('should post a user', async () => {
    const data = {
      name: 'shreya123',
      email: 'sshreyasudhakar@gmail.com',
      id: 13
    };

    const response = await request(app)
      .post('/post')
      .send(data);

    expect(response.status).toBe(200);
    expect(response.text).toBe('posted');
  });

  it('should update a user', async () => {
    const data = {
      name: 'Updated12 Name',
      email: 'updated@example.com'
    };

    const response = await request(app)
      .put('/update/1') // Assuming there's a user with id 1
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(data.name);
    expect(response.body.email).toBe(data.email);
  });

  it('should get all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Adjust based on your test data
  });
});

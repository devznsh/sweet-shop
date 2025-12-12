import request from 'supertest';
import { app } from '../src/app';
import { prisma } from './setup';

describe('Sweets API', () => {
  let userToken: string;
  let adminToken: string;
  let sweetId: string;

  beforeEach(async () => {
    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123',
        name: 'Regular User'
      });
    userToken = userRes.body.token;

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'hashedpassword',
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    // Generate admin token manually
    const jwt = require('jsonwebtoken');
    const config = require('../src/config').config;
    adminToken = jwt.sign(
      { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Create a test sweet
    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Chocolate Bar',
        category: 'Chocolates',
        price: 2.99,
        quantity: 100,
        description: 'Delicious chocolate bar'
      });
    sweetId = sweetRes.body.id;
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet (admin only)', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Candy Cane',
          category: 'Candies',
          price: 1.99,
          quantity: 50,
          description: 'Peppermint candy cane'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Candy Cane');
      expect(response.body.category).toBe('Candies');
      expect(response.body.price).toBe(1.99);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Candy Cane',
          category: 'Candies',
          price: 1.99,
          quantity: 50
        });

      expect(response.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Candy Cane',
          category: 'Candies',
          price: 1.99,
          quantity: 50
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets', () => {
    it('should list all sweets with pagination', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweets');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.sweets)).toBe(true);
    });

    it('should support pagination parameters', async () => {
      const response = await request(app)
        .get('/api/sweets?page=1&limit=5')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(5);
    });
  });

  describe('GET /api/sweets/:id', () => {
    it('should get a single sweet by ID', async () => {
      const response = await request(app)
        .get(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(sweetId);
      expect(response.body.name).toBe('Chocolate Bar');
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .get('/api/sweets/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/sweets/search', () => {
    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBeGreaterThan(0);
      expect(response.body.sweets[0].name).toContain('Chocolate');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolates')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweets[0].category).toBe('Chocolates');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=3')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      response.body.sweets.forEach((sweet: any) => {
        expect(sweet.price).toBeGreaterThanOrEqual(2);
        expect(sweet.price).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update a sweet (admin only)', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Chocolate',
          price: 3.99
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Chocolate');
      expect(response.body.price).toBe(3.99);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated Chocolate'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete a sweet (admin only)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});

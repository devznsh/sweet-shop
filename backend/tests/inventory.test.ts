import request from 'supertest';
import { app } from '../src/app';
import { prisma } from './setup';

describe('Inventory API', () => {
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
        quantity: 10,
        description: 'Delicious chocolate bar'
      });
    sweetId = sweetRes.body.id;
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(8); // 10 - 2

      // Verify in database
      const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
      expect(sweet?.quantity).toBe(8);
    });

    it('should return 400 when purchasing more than available', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('stock');
    });

    it('should return 400 when quantity is 0', async () => {
      // Update sweet to have 0 quantity
      await prisma.sweet.update({
        where: { id: sweetId },
        data: { quantity: 0 }
      });

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('stock');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 1 });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock a sweet (admin only)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(60); // 10 + 50

      // Verify in database
      const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
      expect(sweet?.quantity).toBe(60);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(403);
    });

    it('should require positive quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 });

      expect(response.status).toBe(400);
    });
  });
});

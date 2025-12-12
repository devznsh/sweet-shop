import { PrismaClient } from '@prisma/client';
import { 
  CreateSweetInput, 
  UpdateSweetInput, 
  SearchInput,
  PurchaseInput,
  RestockInput
} from '../validators/sweets.validator';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class SweetsService {
  async createSweet(data: CreateSweetInput) {
    const sweet = await prisma.sweet.create({
      data
    });

    return sweet;
  }

  async getAllSweets(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [sweets, total] = await Promise.all([
      prisma.sweet.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sweet.count()
    ]);

    return {
      sweets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getSweetById(id: string) {
    const sweet = await prisma.sweet.findUnique({
      where: { id }
    });

    if (!sweet) {
      throw new AppError(404, 'Sweet not found');
    }

    return sweet;
  }

  async searchSweets(params: SearchInput) {
    const { name, category, minPrice, maxPrice, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    const [sweets, total] = await Promise.all([
      prisma.sweet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sweet.count({ where })
    ]);

    return {
      sweets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateSweet(id: string, data: UpdateSweetInput) {
    const existingSweet = await prisma.sweet.findUnique({
      where: { id }
    });

    if (!existingSweet) {
      throw new AppError(404, 'Sweet not found');
    }

    const sweet = await prisma.sweet.update({
      where: { id },
      data
    });

    return sweet;
  }

  async deleteSweet(id: string) {
    const existingSweet = await prisma.sweet.findUnique({
      where: { id }
    });

    if (!existingSweet) {
      throw new AppError(404, 'Sweet not found');
    }

    await prisma.sweet.delete({
      where: { id }
    });
  }

  async purchaseSweet(id: string, data: PurchaseInput) {
    const sweet = await prisma.sweet.findUnique({
      where: { id }
    });

    if (!sweet) {
      throw new AppError(404, 'Sweet not found');
    }

    if (sweet.quantity < data.quantity) {
      throw new AppError(400, 'Insufficient stock');
    }

    const updatedSweet = await prisma.sweet.update({
      where: { id },
      data: {
        quantity: sweet.quantity - data.quantity
      }
    });

    return updatedSweet;
  }

  async restockSweet(id: string, data: RestockInput) {
    const sweet = await prisma.sweet.findUnique({
      where: { id }
    });

    if (!sweet) {
      throw new AppError(404, 'Sweet not found');
    }

    const updatedSweet = await prisma.sweet.update({
      where: { id },
      data: {
        quantity: sweet.quantity + data.quantity
      }
    });

    return updatedSweet;
  }
}

export const sweetsService = new SweetsService();

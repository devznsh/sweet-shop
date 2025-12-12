import { Request, Response, NextFunction } from 'express';
import { sweetsService } from '../services/sweets.service';
import {
  createSweetSchema,
  updateSweetSchema,
  searchSchema,
  purchaseSchema,
  restockSchema
} from '../validators/sweets.validator';
import { AppError } from '../middleware/errorHandler';

export class SweetsController {
  async createSweet(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createSweetSchema.parse(req.body);
      const sweet = await sweetsService.createSweet(validatedData);
      res.status(201).json(sweet);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        next(new AppError(400, 'Validation error', error));
      } else {
        next(error);
      }
    }
  }

  async getAllSweets(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await sweetsService.getAllSweets(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSweetById(req: Request, res: Response, next: NextFunction) {
    try {
      const sweet = await sweetsService.getSweetById(req.params.id);
      res.status(200).json(sweet);
    } catch (error) {
      next(error);
    }
  }

  async searchSweets(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        name: req.query.name as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };

      const validatedParams = searchSchema.parse(params);
      const result = await sweetsService.searchSweets(validatedParams);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        next(new AppError(400, 'Validation error', error));
      } else {
        next(error);
      }
    }
  }

  async updateSweet(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateSweetSchema.parse(req.body);
      const sweet = await sweetsService.updateSweet(req.params.id, validatedData);
      res.status(200).json(sweet);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        next(new AppError(400, 'Validation error', error));
      } else {
        next(error);
      }
    }
  }

  async deleteSweet(req: Request, res: Response, next: NextFunction) {
    try {
      await sweetsService.deleteSweet(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async purchaseSweet(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = purchaseSchema.parse(req.body);
      const sweet = await sweetsService.purchaseSweet(req.params.id, validatedData);
      res.status(200).json(sweet);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        next(new AppError(400, 'Validation error', error));
      } else {
        next(error);
      }
    }
  }

  async restockSweet(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = restockSchema.parse(req.body);
      const sweet = await sweetsService.restockSweet(req.params.id, validatedData);
      res.status(200).json(sweet);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        next(new AppError(400, 'Validation error', error));
      } else {
        next(error);
      }
    }
  }
}

export const sweetsController = new SweetsController();

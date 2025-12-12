import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetshop.com' },
    update: {},
    create: {
      email: 'admin@sweetshop.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  console.log('✓ Admin user created');

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@sweetshop.com' },
    update: {},
    create: {
      email: 'user@sweetshop.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER'
    }
  });
  console.log('✓ Regular user created');

  // Create sample sweets
  const sweets = [
    {
      name: 'Dark Chocolate Bar',
      category: 'Chocolates',
      price: 3.99,
      quantity: 100,
      description: 'Rich dark chocolate with 70% cocoa',
      imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'
    },
    {
      name: 'Milk Chocolate Truffles',
      category: 'Chocolates',
      price: 5.99,
      quantity: 75,
      description: 'Creamy milk chocolate truffles',
      imageUrl: 'https://images.unsplash.com/photo-1548848149-54e29e6ea42d?w=400'
    },
    {
      name: 'Gummy Bears',
      category: 'Candies',
      price: 2.49,
      quantity: 150,
      description: 'Colorful fruity gummy bears',
      imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'
    },
    {
      name: 'Candy Canes',
      category: 'Candies',
      price: 1.99,
      quantity: 200,
      description: 'Classic peppermint candy canes',
      imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400'
    },
    {
      name: 'Lollipops',
      category: 'Candies',
      price: 0.99,
      quantity: 300,
      description: 'Assorted flavored lollipops',
      imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400'
    },
    {
      name: 'Chocolate Cake',
      category: 'Cakes',
      price: 12.99,
      quantity: 20,
      description: 'Decadent chocolate layer cake',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
    },
    {
      name: 'Red Velvet Cake',
      category: 'Cakes',
      price: 14.99,
      quantity: 15,
      description: 'Classic red velvet cake with cream cheese frosting',
      imageUrl: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=400'
    },
    {
      name: 'Vanilla Ice Cream',
      category: 'Ice Cream',
      price: 4.99,
      quantity: 50,
      description: 'Creamy vanilla ice cream',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
    },
    {
      name: 'Strawberry Ice Cream',
      category: 'Ice Cream',
      price: 5.49,
      quantity: 45,
      description: 'Fresh strawberry ice cream',
      imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400'
    },
    {
      name: 'Chocolate Croissant',
      category: 'Pastries',
      price: 3.49,
      quantity: 40,
      description: 'Buttery croissant with chocolate filling',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'
    },
    {
      name: 'Cinnamon Roll',
      category: 'Pastries',
      price: 3.99,
      quantity: 35,
      description: 'Sweet cinnamon roll with cream cheese icing',
      imageUrl: 'https://images.unsplash.com/photo-1612182062355-07b8a4c6e25c?w=400'
    },
    {
      name: 'Glazed Donuts',
      category: 'Pastries',
      price: 2.99,
      quantity: 60,
      description: 'Classic glazed donuts',
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'
    },
    {
      name: 'Butterscotch Candy',
      category: 'Candies',
      price: 1.49,
      quantity: 120,
      description: 'Classic butterscotch hard candy',
      imageUrl: 'https://images.unsplash.com/photo-1609875746953-f3e48c05de8b?w=400'
    },
    {
      name: 'Mint Chocolate Chip Ice Cream',
      category: 'Ice Cream',
      price: 5.99,
      quantity: 40,
      description: 'Refreshing mint ice cream with chocolate chips',
      imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400'
    },
    {
      name: 'Tiramisu',
      category: 'Cakes',
      price: 16.99,
      quantity: 12,
      description: 'Italian coffee-flavored dessert',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'
    }
  ];

  for (const sweet of sweets) {
    await prisma.sweet.upsert({
      where: { name: sweet.name },
      update: {},
      create: sweet
    });
  }

  console.log(`✓ Created ${sweets.length} sweets`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const owners = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus.johnson@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
];

const sampleProducts = [
  { name: 'Wireless Bluetooth Headphones', sku: 'WBH-001', price: 79.99, inventory: 150, status: 'ACTIVE' as const },
  { name: 'USB-C Charging Cable', sku: 'UCC-002', price: 12.99, inventory: 500, status: 'ACTIVE' as const },
  { name: 'Laptop Stand Aluminum', sku: 'LSA-003', price: 45.99, inventory: 75, status: 'ACTIVE' as const },
  { name: 'Mechanical Keyboard RGB', sku: 'MKR-004', price: 129.99, inventory: 30, status: 'ACTIVE' as const },
  { name: 'Wireless Mouse Ergonomic', sku: 'WME-005', price: 34.99, inventory: 200, status: 'ACTIVE' as const },
  { name: 'Monitor Light Bar', sku: 'MLB-006', price: 59.99, inventory: 8, status: 'ACTIVE' as const },
  { name: 'Webcam HD 1080p', sku: 'WHD-007', price: 69.99, inventory: 45, status: 'DRAFT' as const },
  { name: 'Desk Mat XL', sku: 'DMX-008', price: 29.99, inventory: 120, status: 'ACTIVE' as const },
  { name: 'Phone Stand Adjustable', sku: 'PSA-009', price: 19.99, inventory: 300, status: 'ACTIVE' as const },
  { name: 'Cable Management Kit', sku: 'CMK-010', price: 24.99, inventory: 5, status: 'ARCHIVED' as const },
  { name: 'USB Hub 7-Port', sku: 'UH7-011', price: 39.99, inventory: 60, status: 'ACTIVE' as const },
  { name: 'Portable SSD 1TB', sku: 'PS1-012', price: 109.99, inventory: 25, status: 'ACTIVE' as const },
];

async function main() {
  console.log('Seeding database...');

  await prisma.product.deleteMany();
  await prisma.owner.deleteMany();

  console.log('Creating owners...');
  const createdOwners = await Promise.all(
    owners.map((owner) =>
      prisma.owner.create({
        data: owner,
      })
    )
  );
  console.log(`Created ${createdOwners.length} owners`);

  console.log('Creating products...');
  const createdProducts = await Promise.all(
    sampleProducts.map((product, index) =>
      prisma.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          price: new Decimal(product.price),
          inventory: product.inventory,
          status: product.status,
          ownerId: createdOwners[index % createdOwners.length]!.id,
        },
      })
    )
  );
  console.log(`Created ${createdProducts.length} products`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

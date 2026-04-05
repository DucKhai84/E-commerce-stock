const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkInventory() {
    try {
        const products = await prisma.product.findMany({
            include: { inventory: true }
        });

        console.log(`Total Products: ${products.length}`);
        const missingInventory = products.filter(p => !p.inventory);
        console.log(`Products Missing Inventory: ${missingInventory.length}`);

        if (missingInventory.length > 0) {
            console.log("Fixing missing inventory records...");
            for (const p of missingInventory) {
                await prisma.inventory.create({
                    data: {
                        productId: p.id,
                        quantity: p.stock || 0,
                        reserved: 0,
                        location: 'Default Warehouse'
                    }
                });
                console.log(`Created inventory for product: ${p.name}`);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkInventory();

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run Prisma seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl })
});

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🗑️  Cleaning database...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database cleaned\n");

  // Create users
  console.log("👥 Creating users...");

  // Hash password for all users
  const password = "12345678";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create sellers
  const seller1 = await prisma.user.create({
    data: {
      email: "joao@vendedor.com",
      password: hashedPassword,
      name: "João Vendedor",
      role: "SELLER"
    }
  });

  const seller2 = await prisma.user.create({
    data: {
      email: "maria@vendedor.com",
      password: hashedPassword,
      name: "Maria Silva",
      role: "SELLER"
    }
  });

  // Create clients
  const client1 = await prisma.user.create({
    data: {
      email: "carlos@cliente.com",
      password: hashedPassword,
      name: "Carlos Santos",
      role: "CLIENT"
    }
  });

  const client2 = await prisma.user.create({
    data: {
      email: "ana@cliente.com",
      password: hashedPassword,
      name: "Ana Costa",
      role: "CLIENT"
    }
  });

  console.log(`✅ Created 4 users (2 sellers, 2 clients)\n`);

  // Create products for seller 1
  console.log("📦 Creating products...");

  const products = await prisma.product.createMany({
    data: [
      // Seller 1 products - Electronics
      {
        name: "Notebook Dell Inspiron",
        price: 3499.99,
        description:
          "Notebook Dell Inspiron 15 com Intel Core i5 de 11ª geração, 16GB RAM, 512GB SSD, tela Full HD de 15.6 polegadas, ideal para trabalho e estudos.",
        imageUrl:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
        sellerId: seller1.id
      },
      {
        name: "Mouse Gamer RGB",
        price: 149.9,
        description:
          "Mouse gamer com iluminação RGB personalizável, 7 botões programáveis, DPI ajustável até 16000, sensor óptico de alta precisão.",
        imageUrl:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
        sellerId: seller1.id
      },
      {
        name: "Teclado Mecânico",
        price: 299.99,
        description:
          "Teclado mecânico com switches blue, retroiluminação RGB, estrutura em alumínio, ABNT2, anti-ghosting completo.",
        imageUrl:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
        sellerId: seller1.id
      },
      {
        name: "Monitor 27 polegadas",
        price: 899.0,
        description:
          "Monitor Full HD 27 polegadas IPS, 75Hz, FreeSync, bordas ultrafinas, ideal para produtividade e entretenimento.",
        imageUrl:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        sellerId: seller1.id
      },
      {
        name: "Headset Gamer",
        price: 199.9,
        description:
          "Headset gamer com som surround 7.1, microfone retrátil com cancelamento de ruído, almofadas em couro sintético.",
        imageUrl:
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
        sellerId: seller1.id
      },
      {
        name: "Webcam Full HD",
        price: 249.99,
        description:
          "Webcam 1080p 60fps com microfone integrado, autofoco, correção de luz, ideal para streaming e videoconferências.",
        imageUrl:
          "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
        sellerId: seller1.id
      },
      {
        name: "SSD 1TB NVMe",
        price: 449.0,
        description:
          "SSD M.2 NVMe 1TB, velocidade de leitura até 3500MB/s, perfeito para upgrade de desempenho.",
        imageUrl:
          "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
        sellerId: seller1.id
      },

      // Seller 2 products - Office & Accessories
      {
        name: "Cadeira Gamer",
        price: 899.99,
        description:
          "Cadeira gamer ergonômica com apoio lombar ajustável, reclinável até 180°, rodas silenciosas, suporta até 150kg.",
        imageUrl:
          "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
        sellerId: seller2.id
      },
      {
        name: "Mesa para Computador",
        price: 499.0,
        description:
          "Mesa para computador em MDF, 120cm de largura, com suporte para monitor, gaveta para teclado, design moderno.",
        imageUrl:
          "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800",
        sellerId: seller2.id
      },
      {
        name: "Mousepad Extended",
        price: 79.9,
        description:
          "Mousepad gamer tamanho estendido 90x40cm, base antiderrapante, superfície de tecido, bordas costuradas.",
        imageUrl:
          "https://images.unsplash.com/photo-1625225233840-695456021cde?w=800",
        sellerId: seller2.id
      },
      {
        name: "Suporte para Notebook",
        price: 89.9,
        description:
          "Suporte ajustável para notebook até 17 polegadas, 6 níveis de altura, ventilação otimizada, alumínio premium.",
        imageUrl:
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
        sellerId: seller2.id
      },
      {
        name: "Hub USB-C 7 em 1",
        price: 159.9,
        description:
          "Hub USB-C com HDMI 4K, 3x USB 3.0, leitor SD/microSD, USB-C PD 100W, design compacto em alumínio.",
        imageUrl:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
        sellerId: seller2.id
      },
      {
        name: "Luminária LED",
        price: 129.0,
        description:
          "Luminária LED para mesa com 3 temperaturas de cor, controle de brilho, braço articulado, base com carregador wireless.",
        imageUrl:
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
        sellerId: seller2.id
      },
      {
        name: "Organizador de Cabos",
        price: 39.9,
        description:
          "Kit organizador de cabos com 10 peças, prendedores magnéticos, clipes adesivos, velcro reutilizável.",
        imageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        sellerId: seller2.id
      },
      {
        name: "Power Bank 20000mAh",
        price: 149.9,
        description:
          "Power bank 20000mAh com carga rápida 18W, 2 portas USB, 1 USB-C, display digital, compatível com todos os dispositivos.",
        imageUrl:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
        sellerId: seller2.id
      }
    ]
  });

  console.log(`✅ Created ${products.count} products\n`);

  // Get all products to create orders
  const allProducts = await prisma.product.findMany();
  const price = (index: number) => Number(allProducts[index].price);

  // Create some orders (simulating past purchases)
  console.log("🛒 Creating sample orders...");

  // Order 1 - Client 1 buys from Seller 1
  await prisma.order.create({
    data: {
      userId: client1.id,
      total: price(0) * 1 + price(1) * 2,
      items: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 1,
            price: allProducts[0].price,
            productName: allProducts[0].name
          },
          {
            productId: allProducts[1].id,
            quantity: 2,
            price: allProducts[1].price,
            productName: allProducts[1].name
          }
        ]
      }
    }
  });

  // Order 2 - Client 2 buys from Seller 2
  await prisma.order.create({
    data: {
      userId: client2.id,
      total: price(7) * 1 + price(9) * 1,
      items: {
        create: [
          {
            productId: allProducts[7].id,
            quantity: 1,
            price: allProducts[7].price,
            productName: allProducts[7].name
          },
          {
            productId: allProducts[9].id,
            quantity: 1,
            price: allProducts[9].price,
            productName: allProducts[9].name
          }
        ]
      }
    }
  });

  // Order 3 - Client 1 buys from both sellers
  await prisma.order.create({
    data: {
      userId: client1.id,
      total: price(2) * 1 + price(10) * 3,
      items: {
        create: [
          {
            productId: allProducts[2].id,
            quantity: 1,
            price: allProducts[2].price,
            productName: allProducts[2].name
          },
          {
            productId: allProducts[10].id,
            quantity: 3,
            price: allProducts[10].price,
            productName: allProducts[10].name
          }
        ]
      }
    }
  });

  console.log(`✅ Created 3 orders\n`);

  // Create some favorites
  console.log("❤️  Creating favorites...");

  await prisma.favorite.createMany({
    data: [
      { userId: client1.id, productId: allProducts[3].id },
      { userId: client1.id, productId: allProducts[4].id },
      { userId: client2.id, productId: allProducts[0].id },
      { userId: client2.id, productId: allProducts[8].id }
    ]
  });

  console.log(`✅ Created 4 favorites\n`);

  // Create some cart items
  console.log("🛒 Creating cart items...");

  await prisma.cartItem.createMany({
    data: [
      { userId: client1.id, productId: allProducts[5].id, quantity: 1 },
      { userId: client2.id, productId: allProducts[11].id, quantity: 2 },
      { userId: client2.id, productId: allProducts[12].id, quantity: 1 }
    ]
  });

  console.log(`✅ Created 3 cart items\n`);

  // Summary
  console.log("📊 Seed Summary:");
  console.log("================");
  console.log(`👥 Users: 4 (2 sellers, 2 clients)`);
  console.log(`📦 Products: ${products.count}`);
  console.log(`🛒 Orders: 3`);
  console.log(`❤️  Favorites: 4`);
  console.log(`🛒 Cart Items: 3`);
  console.log("\n✅ Database seeded successfully!\n");

  console.log("🔐 Login Credentials:");
  console.log("==================");
  console.log("Sellers:");
  console.log(`  - joao@vendedor.com / ${password}`);
  console.log(`  - maria@vendedor.com / ${password}`);
  console.log("\nClients:");
  console.log(`  - carlos@cliente.com / ${password}`);
  console.log(`  - ana@cliente.com / ${password}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

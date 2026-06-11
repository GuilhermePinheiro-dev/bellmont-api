import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Iniciando seed de produtos...");

  // Limpar produtos existentes (opcional)
  await prisma.product.deleteMany({});
  console.log("✅ Produtos anteriores removidos");

  const products = [
    {
      name: "Camiseta Premium Comfort",
      slug: "camiseta-premium-comfort",
      description:
        "Camiseta 100% algodão com acabamento premium. Confortável e durável para o dia a dia.",
      price: 79.9,
      stock: 150,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1578925078519-cf2b6f2f9ec7?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["P", "M", "G", "GG"] },
      active: true,
    },
    {
      name: "Jeans Slim Fit",
      slug: "jeans-slim-fit",
      description:
        "Calça jeans clássica com corte slim fit moderno. Perfeita para qualquer ocasião.",
      price: 189.9,
      stock: 85,
      images: [
        "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1584865288642-42078afe6ff3?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["28", "30", "32", "34", "36", "38"] },
      active: true,
    },
    {
      name: "Tênis Running Pro",
      slug: "tenis-running-pro",
      description:
        "Tênis high-tech com tecnologia de amortecimento para corrida profissional.",
      price: 349.9,
      stock: 42,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
      ],
      sizes: {
        sizes: [
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
        ],
      },
      active: true,
    },
    {
      name: "Relógio Smartwatch Elite",
      slug: "relogio-smartwatch-elite",
      description:
        "Smartwatch com monitores de saúde avançados, GPS e bateria de longa duração.",
      price: 699.9,
      stock: 28,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["Único"] },
      active: true,
    },
    {
      name: "Mochila Urbana 30L",
      slug: "mochila-urbana-30l",
      description:
        "Mochila ergonômica com compartimentos para laptop e acessórios. Ideal para viagens e trabalho.",
      price: 249.9,
      stock: 65,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1492707892657-8ca18f45c857?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["Único"] },
      active: true,
    },
    {
      name: "Óculos de Sol Polarizado",
      slug: "oculos-sol-polarizado",
      description:
        "Óculos com lentes polarizadas UV400 para proteção total contra raios solares.",
      price: 159.9,
      stock: 110,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1591076482161-ea6876ad9622?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["Único"] },
      active: true,
    },
    {
      name: "Jaqueta Corta-Vento",
      slug: "jaqueta-corta-vento",
      description:
        "Jaqueta impermeável e respirável. Proteção contra chuva e vento em qualquer estação.",
      price: 299.9,
      stock: 45,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1539533057440-7f85acead474?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["P", "M", "G", "GG", "GGG"] },
      active: true,
    },
    {
      name: "Boné Ajustável Classic",
      slug: "bone-ajustavel-classic",
      description:
        "Boné clássico com ajuste traseiro. Perfeito para o dia a dia e atividades outdoor.",
      price: 89.9,
      stock: 200,
      images: [
        "https://images.unsplash.com/photo-1585066328789-cc89b3d3fa5b?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["Único"] },
      active: true,
    },
    {
      name: "Cinturão de Couro Premium",
      slug: "cinto-couro-premium",
      description:
        "Cinturão de couro genuíno com fivela de qualidade. Elegante e resistente.",
      price: 129.9,
      stock: 75,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1517633132204-bc3a7dd5899b?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["P", "M", "G"] },
      active: true,
    },
    {
      name: "Meias Esportivas Kit 3 Pares",
      slug: "meias-esportivas-kit-3-pares",
      description:
        "Kit com 3 pares de meias esportivas de alta performance. Absorção de umidade garantida.",
      price: 59.9,
      stock: 300,
      images: [
        "https://images.unsplash.com/photo-1590949835871-d8097b37c77f?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1523622927292-8f3e92a2c25b?w=500&h=500&fit=crop",
      ],
      sizes: { sizes: ["P/M", "M/G", "G/GG"] },
      active: true,
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(
      `✅ Produto criado: "${createdProduct.name}" (ID: ${createdProduct.id})`,
    );
  }

  console.log("🎉 Seed concluído com sucesso! 10 produtos foram criados.");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

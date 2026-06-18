import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Iniciando seed de categorias e produtos...");

  // Limpar dados existentes antes de recriar a base inicial
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("✅ Categorias e produtos anteriores removidos");

  const categories = [
    {
      name: "Camisetas",
      slug: "camisetas",
      active: true,
    },
    {
      name: "Calças",
      slug: "calcas",
      active: true,
    },
    {
      name: "Calçados",
      slug: "calcados",
      active: true,
    },
    {
      name: "Acessórios",
      slug: "acessorios",
      active: true,
    },
    {
      name: "Moda Externa",
      slug: "moda-externa",
      active: true,
    },
  ];

  const createdCategories: Record<string, number> = {};

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
    });

    createdCategories[createdCategory.slug] = createdCategory.id;
    console.log(
      `✅ Categoria criada: "${createdCategory.name}" (ID: ${createdCategory.id})`,
    );
  }

  const products = [
    {
      name: "Camiseta Essential Cotton",
      slug: "camiseta-essential-cotton",
      description:
        "Camiseta 100% algodão com caimento reto e toque macio para uso diário.",
      price: 89.9,
      stock: 120,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop",
      ],
      sizes: ["P", "M", "G", "GG"],
      active: true,
      categoryId: createdCategories["camisetas"],
    },
    {
      name: "Camiseta Oversized Street",
      slug: "camiseta-oversized-street",
      description: "Modelo oversized com visual urbano e tecido encorpado.",
      price: 109.9,
      stock: 95,
      images: [
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop",
      ],
      sizes: ["P", "M", "G", "GG"],
      active: true,
      categoryId: createdCategories["camisetas"],
    },
    {
      name: "Calça Jeans Slim Fit",
      slug: "calca-jeans-slim-fit",
      description:
        "Calça jeans de corte ajustado com acabamento moderno e versátil.",
      price: 199.9,
      stock: 80,
      images: [
        "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop",
      ],
      sizes: ["38", "40", "42", "44", "46"],
      active: true,
      categoryId: createdCategories["calcas"],
    },
    {
      name: "Calça Cargo Utility",
      slug: "calca-cargo-utility",
      description:
        "Calça cargo com bolsos funcionais e ajuste confortável para o dia a dia.",
      price: 229.9,
      stock: 62,
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=500&h=500&fit=crop",
      ],
      sizes: ["38", "40", "42", "44", "46"],
      active: true,
      categoryId: createdCategories["calcas"],
    },
    {
      name: "Tênis Urban Runner",
      slug: "tenis-urban-runner",
      description:
        "Tênis com sola leve, estilo casual e amortecimento para uso prolongado.",
      price: 359.9,
      stock: 44,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      active: true,
      categoryId: createdCategories["calcados"],
    },
    {
      name: "Tênis Sprint Pro",
      slug: "tenis-sprint-pro",
      description:
        "Tênis esportivo com foco em conforto, estabilidade e performance.",
      price: 389.9,
      stock: 36,
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      active: true,
      categoryId: createdCategories["calcados"],
    },
    {
      name: "Boné Classic Logo",
      slug: "bone-classic-logo",
      description: "Boné ajustável com bordado frontal e visual minimalista.",
      price: 79.9,
      stock: 180,
      images: [
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop",
      ],
      sizes: ["Único"],
      active: true,
      categoryId: createdCategories["acessorios"],
    },
    {
      name: "Mochila Urban Pro",
      slug: "mochila-urban-pro",
      description:
        "Mochila com compartimento para notebook e bolsos organizadores internos.",
      price: 259.9,
      stock: 70,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=500&h=500&fit=crop",
      ],
      sizes: ["Único"],
      active: true,
      categoryId: createdCategories["acessorios"],
    },
    {
      name: "Jaqueta Corta-Vento Light",
      slug: "jaqueta-corta-vento-light",
      description:
        "Jaqueta leve com proteção contra vento e acabamento resistente à água.",
      price: 319.9,
      stock: 52,
      images: [
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop",
      ],
      sizes: ["P", "M", "G", "GG"],
      active: true,
      categoryId: createdCategories["moda-externa"],
    },
    {
      name: "Colete Puffer Urban",
      slug: "colete-puffer-urban",
      description:
        "Colete acolchoado para sobreposição em dias frios com visual moderno.",
      price: 279.9,
      stock: 39,
      images: [
        "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=500&fit=crop",
      ],
      sizes: ["P", "M", "G", "GG"],
      active: true,
      categoryId: createdCategories["moda-externa"],
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

  console.log(
    "🎉 Seed concluído com sucesso! 5 categorias e 10 produtos foram criados.",
  );
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

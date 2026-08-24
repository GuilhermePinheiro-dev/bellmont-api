import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Iniciando seed de produtos...");

  const products = [
    {
      name: "Bellmont Noir Essence",
      description:
        "Uma fragrância intensa e sofisticada com notas amadeiradas, couro e âmbar dourado. Criado para homens elegantes e marcantes.",
      price: 489.9,
      images: ["/img/product-perfume-1.png"],
      sizes: ["50ml"],
      categoryId: 1,
      slug: "bellmont-noir-essence",
      stock: 12,
      active: true,
      colors: ["Preto Fosco"],
    },
    {
      name: "Bellmont Golden Elixir",
      description:
        "Perfume premium com toque cítrico refinado, lavanda francesa e fundo quente de baunilha e musk.",
      price: 529.9,
      images: ["/img/product-perfume-2.png"],
      sizes: ["50ml"],
      categoryId: 1,
      slug: "bellmont-golden-elixir",
      stock: 10,
      active: true,
      colors: ["Dourado Champagne"],
    },
    {
      name: "Bellmont Imperial Oud",
      description:
        "Fragrância luxuosa inspirada no oriente moderno, misturando oud, especiarias nobres e madeira escura.",
      price: 649.9,
      images: ["/img/product-perfume-3.png"],
      sizes: ["100ml"],
      categoryId: 1,
      slug: "bellmont-imperial-oud",
      stock: 8,
      active: true,
      colors: ["Marrom Espresso"],
    },
    {
      name: "Bellmont Chronos",
      description:
        "Relógio minimalista com caixa premium em aço escovado e pulseira em couro legítimo preto.",
      price: 1299.9,
      images: ["/img/product-relogio-1.png"],
      sizes: ["Único"],
      categoryId: 2,
      slug: "bellmont-chronos",
      stock: 6,
      active: true,
      colors: ["Preto Ônix"],
    },
    {
      name: "Bellmont Heritage Gold",
      description:
        "Elegância clássica com acabamento dourado champagne e mostrador sofisticado inspirado na alta relojoaria.",
      price: 1499.9,
      images: ["/img/product-relogio-2.png"],
      sizes: ["Único"],
      categoryId: 2,
      slug: "bellmont-heritage-gold",
      stock: 5,
      active: true,
      colors: ["Dourado Fosco"],
    },
    {
      name: "Bellmont Eclipse",
      description:
        "Design moderno com pulseira metálica premium e detalhes minimalistas para um visual sofisticado.",
      price: 1799.9,
      images: ["/img/product-relogio-3.png"],
      sizes: ["Único"],
      categoryId: 2,
      slug: "bellmont-eclipse",
      stock: 4,
      active: true,
      colors: ["Grafite Escuro"],
    },
    {
      name: "Bellmont Royal Ring",
      description:
        "Anel sofisticado com acabamento polido e design minimalista inspirado em joias clássicas europeias.",
      price: 389.9,
      images: ["/img/product-acessorio-1.png"],
      sizes: ["16", "17", "18"],
      categoryId: 3,
      slug: "bellmont-royal-ring",
      stock: 9,
      active: true,
      colors: ["Dourado Premium"],
    },
    {
      name: "Bellmont Signature Chain",
      description:
        "Colar refinado com corrente delicada e pingente exclusivo Bellmont para compor um visual luxuoso.",
      price: 459.9,
      images: ["/img/product-acessorio-2.png"],
      sizes: ["45cm"],
      categoryId: 3,
      slug: "bellmont-signature-chain",
      stock: 7,
      active: true,
      colors: ["Ouro Champagne"],
    },
    {
      name: "Bellmont Premium Polo",
      description:
        "Polo premium confeccionada em tecido macio de alta qualidade com caimento elegante e minimalista.",
      price: 279.9,
      images: ["/img/product-roupa-1.png"],
      sizes: ["P", "M", "G"],
      categoryId: 4,
      slug: "bellmont-premium-polo",
      stock: 11,
      active: true,
      colors: ["Marrom Café"],
    },
    {
      name: "Bellmont Essential Shirt",
      description:
        "Camisa sofisticada com modelagem moderna e tecido leve, perfeita para ocasiões elegantes e casuais.",
      price: 349.9,
      images: ["/img/product-roupa-2.png"],
      sizes: ["P", "M", "G"],
      categoryId: 4,
      slug: "bellmont-essential-shirt",
      stock: 10,
      active: true,
      colors: ["Bege Areia"],
    },
  ];

  const productSlugs = products.map((product) => product.slug);

  const removedProducts = await prisma.product.deleteMany({
    where: {
      slug: { notIn: productSlugs },
      orderItems: { none: {} },
    },
  });
  console.log(
    `${removedProducts.count} produto(s) antigo(s) sem pedidos removido(s); produtos vinculados a pedidos foram preservados`,
  );

  for (const product of products) {
    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.log(`Produto salvo: "${savedProduct.name}" (ID: ${savedProduct.id})`);
  }

  console.log(
    "Seed concluído com sucesso! Produtos do mock foram sincronizados; nenhuma categoria, pedido ou item de pedido foi alterado.",
  );
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { db } from "@/lib/db";
import {
  products,
  productMedia,
  media,
  productVariants,
  productCategories,
  services,
  serviceMedia,
  portfolioWork,
  portfolioWorkMedia,
  portfolioCategories,
} from "@/lib/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export async function getPublicProducts(limit: number = 8) {
  try {
    // 1. First, try to get products with their primary media
    const publishedProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        shortDescription: products.shortDescription,
        price: products.price,
        isFeatured: products.isFeatured,
        mediaId: media.id,
        mediaUrl: media.secureUrl,
      })
      .from(products)
      .leftJoin(
        productMedia,
        and(
          eq(products.id, productMedia.productId),
          eq(productMedia.isPrimary, true),
        ),
      )
      .leftJoin(media, eq(productMedia.mediaId, media.id))
      .where(eq(products.isPublished, true))
      .orderBy(desc(products.isFeatured), asc(products.createdAt))
      .limit(limit);

    // 2. Safety net: If a product has no primary image, fetch its first available image
    const productsWithMedia = await Promise.all(
      publishedProducts.map(async (product) => {
        if (product.mediaUrl) return product; // Already has a primary image

        // Fallback: get any media for this product
        const fallbackMedia = await db
          .select({ mediaId: media.id, mediaUrl: media.secureUrl })
          .from(productMedia)
          .innerJoin(media, eq(productMedia.mediaId, media.id))
          .where(eq(productMedia.productId, product.id))
          .orderBy(asc(productMedia.sortOrder))
          .limit(1);

        if (fallbackMedia.length > 0) {
          return {
            ...product,
            mediaId: fallbackMedia[0].mediaId,
            mediaUrl: fallbackMedia[0].mediaUrl,
          };
        }
        return product;
      }),
    );

    return productsWithMedia;
  } catch (error) {
    console.error("Error fetching public products:", error);
    return [];
  }
}

export async function getPublicProductBySlug(slug: string) {
  try {
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        shortDescription: products.shortDescription,
        fullDescription: products.fullDescription,
        price: products.price,
        isPublished: products.isPublished,
        isFeatured: products.isFeatured,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id),
      )
      .where(and(eq(products.slug, slug), eq(products.isPublished, true)))
      .limit(1);

    if (!product) {
      return null;
    }

    const productMediaList = await db
      .select({
        id: media.id,
        secureUrl: media.secureUrl,
        format: media.format,
        width: media.width,
        height: media.height,
        isPrimary: productMedia.isPrimary,
        sortOrder: productMedia.sortOrder,
      })
      .from(productMedia)
      .innerJoin(media, eq(productMedia.mediaId, media.id))
      .where(eq(productMedia.productId, product.id))
      .orderBy(asc(productMedia.sortOrder));

    const variants = await db
      .select({
        id: productVariants.id,
        name: productVariants.name,
        size: productVariants.size,
        color: productVariants.color,
        priceOverride: productVariants.priceOverride,
      })
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, product.id),
          eq(productVariants.isActive, true),
        ),
      )
      .orderBy(asc(productVariants.createdAt));

    return {
      ...product,
      media: productMediaList,
      variants,
    };
  } catch (error) {
    console.error("Error fetching public product by slug:", error);
    return null;
  }
}

export async function getPublicServices(limit: number = 6) {
  try {
    const publishedServices = await db
      .select({
        id: services.id,
        title: services.title,
        slug: services.slug,
        description: services.description,
        mediaId: media.id,
        mediaUrl: media.secureUrl,
      })
      .from(services)
      .leftJoin(
        serviceMedia,
        and(
          eq(services.id, serviceMedia.serviceId),
          eq(serviceMedia.isPrimary, true),
        ),
      )
      .leftJoin(media, eq(serviceMedia.mediaId, media.id))
      .where(eq(services.isPublished, true))
      .orderBy(asc(services.sortOrder), asc(services.createdAt))
      .limit(limit);

    return publishedServices;
  } catch (error) {
    console.error("Error fetching public services:", error);
    return [];
  }
}

export async function getPublicPortfolioWork(limit: number = 6) {
  try {
    const publishedWork = await db
      .select({
        id: portfolioWork.id,
        title: portfolioWork.title,
        slug: portfolioWork.slug,
        description: portfolioWork.description,
        clientEventReference: portfolioWork.clientEventReference,
        categoryName: portfolioCategories.name,
        mediaId: media.id,
        mediaUrl: media.secureUrl,
      })
      .from(portfolioWork)
      .leftJoin(
        portfolioWorkMedia,
        and(
          eq(portfolioWork.id, portfolioWorkMedia.workId),
          eq(portfolioWorkMedia.isPrimary, true),
        ),
      )
      .leftJoin(media, eq(portfolioWorkMedia.mediaId, media.id))
      .leftJoin(
        portfolioCategories,
        eq(portfolioWork.categoryId, portfolioCategories.id),
      )
      .where(eq(portfolioWork.isPublished, true))
      .orderBy(asc(portfolioWork.sortOrder), desc(portfolioWork.createdAt))
      .limit(limit);

    return publishedWork;
  } catch (error) {
    console.error("Error fetching public portfolio work:", error);
    return [];
  }
}

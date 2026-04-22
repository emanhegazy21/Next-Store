import { buyProducts } from "@/lib/dbConnect";

async function revalidatePurchasedPages(res, items) {
  try {
    await Promise.all([
      res.revalidate("/products"),
      ...items.map((item) => res.revalidate(`/products/${item.productId}`)),
    ]);
  } catch (error) {
    console.warn("Failed to revalidate product pages after purchase", error);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} is not allowed.` });
  }

  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const result = await buyProducts(items);

  if (result.error) {
    return res.status(result.status || 400).json({ message: result.error });
  }

  await revalidatePurchasedPages(res, items);

  return res.status(200).json({
    message: "Purchase completed successfully.",
    totalPrice: result.totalPrice,
    purchasedProducts: result.purchasedProducts,
  });
}

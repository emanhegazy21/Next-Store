import { createProduct, getAllProducts } from "@/lib/dbConnect";
import { requireApiSession } from "@/lib/auth";

async function revalidateProducts(res) {
  try {
    await res.revalidate("/products");
    await res.revalidate("/products/add");
  } catch (error) {
    console.warn("Failed to revalidate product listing pages", error);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const products = await getAllProducts();
    return res.status(200).json({ products });
  }

  if (req.method === "POST") {
    const session = await requireApiSession(req, res);

    if (!session) {
      return;
    }

    const result = await createProduct(req.body);

    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    await revalidateProducts(res);

    return res.status(201).json({
      message: "Product created successfully.",
      product: result.product,
    });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} is not allowed.` });
}

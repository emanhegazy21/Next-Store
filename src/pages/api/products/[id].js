import { deleteProduct, getProductById, updateProduct } from "@/lib/dbConnect";

async function revalidateProductPages(res, id) {
  try {
    await Promise.all([
      res.revalidate("/products"),
      res.revalidate("/products/add"),
      res.revalidate(`/products/${id}`),
    ]);
  } catch (error) {
    console.warn(`Failed to revalidate product ${id}`, error);
  }
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ product });
  }

  if (req.method === "PUT") {
    const result = await updateProduct(id, req.body);

    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    await revalidateProductPages(res, id);

    return res.status(200).json({
      message: "Product updated successfully.",
      product: result.product,
    });
  }

  if (req.method === "DELETE") {
    const result = await deleteProduct(id);

    if (result.error) {
      return res.status(result.status || 404).json({ message: result.error });
    }

    await revalidateProductPages(res, id);

    return res.status(200).json({
      message: "Product deleted successfully.",
      product: result.product,
    });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} is not allowed.` });
}

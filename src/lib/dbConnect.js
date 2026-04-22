import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "db.json");
const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";

const seedProducts = [
  {
    id: "1",
    title: "Aurora Glass Bottle",
    description: "A double-wall bottle that keeps drinks cool and looks sharp on any desk.",
    category: "lifestyle",
    brand: "Northwind",
    price: 24.99,
    stock: 18,
    thumbnail:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    title: "Summit Trail Backpack",
    description: "A roomy day-pack with padded straps, laptop sleeve, and weather-ready fabric.",
    category: "travel",
    brand: "Peakline",
    price: 79.5,
    stock: 11,
    thumbnail:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    title: "Canvas Desk Lamp",
    description: "Warm ambient lighting with a matte finish that fits home offices and reading nooks.",
    category: "home",
    brand: "Halo Home",
    price: 58,
    stock: 9,
    thumbnail:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    title: "Ripple Wireless Headphones",
    description: "Balanced sound, 30-hour battery life, and soft ear cushions for long sessions.",
    category: "electronics",
    brand: "Ripple",
    price: 129.99,
    stock: 14,
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    title: "Studio Ceramic Mug",
    description: "Hand-finished ceramic mug designed for coffee, tea, and clean shelf aesthetics.",
    category: "kitchen",
    brand: "Clay & Co",
    price: 16.75,
    stock: 26,
    thumbnail:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    title: "Orbit Smart Watch",
    description: "Health tracking, message previews, and a lightweight aluminum case.",
    category: "wearables",
    brand: "Orbit",
    price: 189,
    stock: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
  },
];

const seedUsers = [
  {
    id: "1",
    firstName: "Eman",
    lastName: "Hassan",
    email: "eman@example.com",
    role: "admin",
    phone: "+20 100 000 0001",
    city: "Cairo",
  },
  {
    id: "2",
    firstName: "Omar",
    lastName: "Nabil",
    email: "omar@example.com",
    role: "customer",
    phone: "+20 100 000 0002",
    city: "Alexandria",
  },
  {
    id: "3",
    firstName: "Salma",
    lastName: "Adel",
    email: "salma@example.com",
    role: "customer",
    phone: "+20 100 000 0003",
    city: "Giza",
  },
];

function withTimestamps(items) {
  const timestamp = new Date().toISOString();
  return items.map((item) => ({
    ...item,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function createSeedDatabase() {
  return {
    products: withTimestamps(seedProducts),
    users: withTimestamps(seedUsers),
  };
}

function normalizeProduct(product) {
  return {
    ...product,
    _id: String(product.id),
    id: String(product.id),
  };
}

function normalizeUser(user) {
  return {
    ...user,
    _id: String(user.id),
    id: String(user.id),
  };
}

function normalizeProductPayload(body = {}, partial = false) {
  const payload = {};

  if (!partial || body.title !== undefined) payload.title = body.title?.trim();
  if (!partial || body.description !== undefined) payload.description = body.description?.trim() || "";
  if (!partial || body.category !== undefined) payload.category = body.category?.trim()?.toLowerCase();
  if (!partial || body.brand !== undefined) payload.brand = body.brand?.trim() || "Generic";
  if (!partial || body.price !== undefined) payload.price = Number(body.price);
  if (!partial || body.stock !== undefined) payload.stock = Number(body.stock);
  if (!partial || body.thumbnail !== undefined) {
    payload.thumbnail = body.thumbnail?.trim() || DEFAULT_THUMBNAIL;
  }

  return payload;
}

function validateProduct(payload, partial = false) {
  if ((!partial || payload.title !== undefined) && !payload.title) return "title is required.";
  if ((!partial || payload.category !== undefined) && !payload.category) return "category is required.";
  if ((!partial || payload.price !== undefined) && (Number.isNaN(payload.price) || payload.price < 0)) {
    return "price must be a valid number.";
  }
  if ((!partial || payload.stock !== undefined) && (Number.isNaN(payload.stock) || payload.stock < 0)) {
    return "stock must be a valid number.";
  }
  return null;
}

function validateUser(body = {}) {
  if (!body.firstName?.trim()) return "firstName is required.";
  if (!body.lastName?.trim()) return "lastName is required.";
  if (!body.email?.trim()) return "email is required.";
  return null;
}

export async function dbConnect() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    await fs.writeFile(DB_PATH, JSON.stringify(createSeedDatabase(), null, 2));
  }

  return { path: DB_PATH };
}

export async function readDatabase() {
  await dbConnect();
  const fileContents = await fs.readFile(DB_PATH, "utf8");
  const database = JSON.parse(fileContents);
  let dirty = false;

  if (!Array.isArray(database.products)) {
    database.products = createSeedDatabase().products;
    dirty = true;
  }

  if (!Array.isArray(database.users)) {
    database.users = createSeedDatabase().users;
    dirty = true;
  }

  if (dirty) {
    await writeDatabase(database);
  }

  return database;
}

export async function writeDatabase(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  return data;
}

export async function getAllProducts() {
  const database = await readDatabase();
  return [...database.products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(normalizeProduct);
}

export async function getProductById(id) {
  const database = await readDatabase();
  const product = database.products.find((item) => String(item.id) === String(id));
  return product ? normalizeProduct(product) : null;
}

export async function getProductPaths(limit = 12) {
  const products = await getAllProducts();
  return products.slice(0, limit).map((product) => product.id);
}

export async function createProduct(body) {
  const payload = normalizeProductPayload(body);
  const error = validateProduct(payload);

  if (error) {
    return { error, status: 400 };
  }

  const database = await readDatabase();
  const timestamp = new Date().toISOString();
  const product = {
    id: randomUUID(),
    ...payload,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  database.products.unshift(product);
  await writeDatabase(database);
  return { product: normalizeProduct(product) };
}

export async function updateProduct(id, body) {
  const payload = normalizeProductPayload(body, true);
  const error = validateProduct(payload, true);

  if (error) {
    return { error, status: 400 };
  }

  const database = await readDatabase();
  const index = database.products.findIndex((item) => String(item.id) === String(id));

  if (index === -1) {
    return { error: "Product not found.", status: 404 };
  }

  database.products[index] = {
    ...database.products[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  await writeDatabase(database);
  return { product: normalizeProduct(database.products[index]) };
}

export async function deleteProduct(id) {
  const database = await readDatabase();
  const index = database.products.findIndex((item) => String(item.id) === String(id));

  if (index === -1) {
    return { error: "Product not found.", status: 404 };
  }

  const [product] = database.products.splice(index, 1);
  await writeDatabase(database);
  return { product: normalizeProduct(product) };
}

export async function buyProducts(items) {
  const database = await readDatabase();
  const parsedItems = Array.isArray(items)
    ? items
        .map((item) => ({
          productId: String(item.productId),
          quantity: Number(item.quantity),
        }))
        .filter((item) => item.productId && item.quantity > 0)
    : [];

  if (parsedItems.length === 0) {
    return { error: "Select at least one product to buy.", status: 400 };
  }

  for (const item of parsedItems) {
    const product = database.products.find((entry) => String(entry.id) === item.productId);

    if (!product) {
      return { error: `Product ${item.productId} not found.`, status: 404 };
    }

    if (product.stock < item.quantity) {
      return { error: `Only ${product.stock} item(s) left for ${product.title}.`, status: 400 };
    }
  }

  const purchasedProducts = [];
  let totalPrice = 0;

  for (const item of parsedItems) {
    const product = database.products.find((entry) => String(entry.id) === item.productId);
    product.stock -= item.quantity;
    product.updatedAt = new Date().toISOString();

    const lineTotal = Number((product.price * item.quantity).toFixed(2));
    totalPrice += lineTotal;

    purchasedProducts.push({
      productId: String(product.id),
      title: product.title,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal,
      remainingStock: product.stock,
    });
  }

  await writeDatabase(database);

  return {
    totalPrice: Number(totalPrice.toFixed(2)),
    purchasedProducts,
  };
}

export async function getAllUsers() {
  const database = await readDatabase();
  return [...database.users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(normalizeUser);
}

export async function createUser(body) {
  const error = validateUser(body);

  if (error) {
    return { error, status: 400 };
  }

  const database = await readDatabase();
  const email = body.email.trim().toLowerCase();

  if (database.users.some((user) => user.email.toLowerCase() === email)) {
    return { error: "email already exists.", status: 400 };
  }

  const timestamp = new Date().toISOString();
  const user = {
    id: randomUUID(),
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    email,
    role: body.role?.trim()?.toLowerCase() || "customer",
    phone: body.phone?.trim() || "",
    city: body.city?.trim() || "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  database.users.unshift(user);
  await writeDatabase(database);
  return { user: normalizeUser(user) };
}

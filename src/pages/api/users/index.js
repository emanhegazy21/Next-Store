import { randomUUID } from "crypto";
import { createUser, getAllUsers } from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ users: await getAllUsers() });
  }

  if (req.method === "POST") {
    const result = await createUser(req.body);

    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    return res.status(201).json({ message: "User created successfully.", user: result.user });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} is not allowed.` });
}

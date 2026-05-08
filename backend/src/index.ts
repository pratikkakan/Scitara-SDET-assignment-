import { config } from "dotenv";
import app from "./app";

config();

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.warn(`User Management API running on http://localhost:${PORT}`);
});

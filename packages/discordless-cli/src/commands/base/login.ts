import fs from "fs-extra";
import path from "path";
import { createClient } from "../../api.js";
import { AUTH_PATH } from "../../utils.js";

export async function login(apiKey: string) {
    await fs.ensureDir(path.dirname(AUTH_PATH));

    try {
        const api = createClient({ apiKey });
        const user = await api.users.me();

        // Écriture dans le fichier local
        await fs.writeJSON(AUTH_PATH, { apiKey }, { spaces: 4 });

        console.log(`✅ Connecté en tant que ${user.username} (${user.email})`);
        console.log("🔐 API key sauvegardée localement.");

    } catch (err: any) {
        console.error("❌ Erreur lors de la connexion:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

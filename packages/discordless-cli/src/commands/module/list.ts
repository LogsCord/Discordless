import chalk from "chalk";
import { getApiClient } from "../../utils.js";

export async function listModules() {
    try {
        const api = await getApiClient();
        const modules = await api.modules.list();

        if (modules.length === 0) {
            console.log("ℹ️ Aucun module disponible.");
            return;
        }

        console.log("📦 Modules disponibles :");

        for (const module of modules) {
            console.log(`\n${chalk.bold(module.title)}`);
            console.log(`  Package: ${module.packageName}`);
            console.log(`  Description: ${module.description}`);
            console.log(`  ID: ${module._id}`);
        }

    } catch (err: any) {
        console.error("❌ Erreur lors de la récupération des modules:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

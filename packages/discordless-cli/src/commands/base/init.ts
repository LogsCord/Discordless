import chalk from "chalk";
import { getApiClient } from "../../utils.js";

export async function init(packageName: string, name: string, description: string) {
    try {
        const api = await getApiClient();
        const module = await api.modules.create({
            packageName,
            title: name,
            description
        });

        console.log(`✅ Module ${chalk.bold(module.title)} créé avec succès !`);
        console.log(`📦 Package: ${module.packageName}`);

    } catch (err: any) {
        console.error("❌ Erreur lors de la création du module:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

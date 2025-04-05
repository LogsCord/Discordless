import fs from "fs-extra";
import path from "path";
import { getApiClient } from "../../utils.js";

export async function deploy() {
    try {
        const cwd = process.cwd();
        const configPath = path.join(cwd, ".discordless.json");

        if (!await fs.pathExists(configPath)) {
            console.error("❌ Fichier .discordless.json manquant. Faites un \"pull\" d'abord.");
            process.exit(1);
        }

        const config = await fs.readJSON(configPath);
        const api = await getApiClient();

        // Fonction récursive pour aller dans tous les sous-dossiers
        async function getFiles(dir: string): Promise<string[]> {
            const dirents = await fs.readdir(dir, { withFileTypes: true });

            const files = await Promise.all(dirents.map(async (dirent) => {
                const res = path.resolve(dir, dirent.name);

                if (dirent.isDirectory()) {
                    return await getFiles(res);

                } else {
                    return res;
                }
            }));

            return files.flat();
        }

        const files = await getFiles(cwd);

        // Filtrage des fichiers à ignorer
        const ignored = ["node_modules", ".git", ".discordless.json"];

        const deployableFiles = files.filter((file) => {
            const relative = path.relative(cwd, file);

            return !ignored.some((ig) => relative.startsWith(ig));
        });

        if (deployableFiles.length === 0) {
            console.log("📁 Aucun fichier à déployer.");
            return;
        }

        console.log(`📦 Déploiement de ${deployableFiles.length} fichier(s)...`);

        for (const fullPath of deployableFiles) {
            const relativePath = path.relative(cwd, fullPath).replace(/\\/g, "/"); // Windows fix
            const content = await fs.readFile(fullPath, "utf-8");

            try {
                await api.modules.files.put(config.package, relativePath, content);

                console.log(`✅ ${relativePath}`);

            } catch (err: any) {
                console.error(`❌ Erreur sur ${relativePath} :`, err.response?.data || err.message);
            }
        }

        console.log("🚀 Déploiement terminé !");

    } catch (err: any) {
        console.error(`❌ Erreur lors du déploiement : ${err.message}`);
        console.error(err);
    }
}

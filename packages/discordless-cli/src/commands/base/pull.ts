import fs from "fs-extra";
import path from "path";
import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function pull(moduleName: string | undefined) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        moduleName = await helper.selectModuleId(moduleName);

        const { _id, packageName } = await api.modules.get(moduleName);

        // 🔧 Crée un dossier du nom du package
        const moduleDir = path.join(process.cwd(), packageName);
        await fs.ensureDir(moduleDir);

        // 📁 Crée le fichier de config dans le dossier du module
        const config = {
            id: _id,
            package: packageName
        };

        await fs.writeJSON(path.join(moduleDir, ".discordless.json"), config, { spaces: 2 });
        console.log(`📦 Module "${packageName}" récupéré avec ID "${_id}".`);

        // 📄 Liste des fichiers
        const files = await api.modules.files.list(packageName);

        if (!files || files.length === 0) {
            console.log("Ce module ne contient aucun fichier.");
            return;
        }

        // ⬇️ Récupération et écriture des fichiers dans le dossier du module
        for (const file of files) {
            const filePath = path.join(moduleDir, file.path);

            if (file.isDirectory) {
                await fs.ensureDir(filePath);
                continue;
            }

            const content = await api.modules.files.get(_id, file.path);
            await fs.writeFile(filePath, content, "utf-8");

            console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
        }

        console.log(`📥 Pull terminé. Fichiers disponibles dans ./` + packageName);

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error(`❌ Erreur lors du pull : ${err.message}`);
        console.error(err);
    }
}

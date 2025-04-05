import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function installModule(projectId?: string, moduleId?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        projectId = await helper.selectProjectId(projectId);
        moduleId = await helper.selectModuleId(moduleId);

        await api.projects.installModule(projectId, moduleId);
        console.log("✅ Module installé avec succès !");

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors de l'installation du module:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

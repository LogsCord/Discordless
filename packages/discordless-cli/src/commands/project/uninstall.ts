import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function uninstallModule(projectId?: string, moduleId?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        projectId = await helper.selectProjectId(projectId);
        moduleId = await helper.selectModuleId(moduleId);

        await api.projects.uninstallModule(projectId, moduleId);
        console.log("✅ Module désinstallé avec succès !");

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors de la désinstallation du module:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

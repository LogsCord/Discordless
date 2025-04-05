import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function startProject(projectId?: string, token?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        // If no projectId provided, show selector
        projectId = await helper.selectProjectId(projectId);

        await api.projects.start(projectId, token);
        console.log("✅ Projet démarré avec succès !");

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors du démarrage du projet:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function stopProject(projectId?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        projectId = await helper.selectProjectId(projectId);

        await api.projects.stop(projectId);
        console.log("✅ Projet arrêté avec succès !");

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors de l'arrêt du projet:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

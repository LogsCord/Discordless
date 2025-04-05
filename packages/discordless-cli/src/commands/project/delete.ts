import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function deleteProject(projectId?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        projectId = await helper.selectProjectId(projectId);

        const confirm = await helper.confirm(`Êtes-vous sûr de vouloir supprimer le projet ${projectId} ?`);
        if (!confirm) return;

        await api.projects.delete(projectId);
        console.log("✅ Projet supprimé avec succès !");

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors de la suppression du projet:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

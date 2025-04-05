import { getApiClient } from "../../utils.js";
import { getHelper } from "../../helper.js";

export async function deleteModule(moduleId?: string) {
    try {
        const api = await getApiClient();
        const helper = getHelper(api);

        moduleId = await helper.selectModuleId(moduleId);

        const confirm = await helper.confirm(`Êtes-vous sûr de vouloir supprimer le module ${moduleId} ?`);
        if (!confirm) return;

        await api.modules.delete(moduleId);
        console.log("✅ Module supprimé avec succès !");

    } catch (err: any) {
        if (err instanceof Error && err.name === "ExitPromptError")
            return;

        console.error("❌ Erreur lors de la suppression du module:", err.response?.data?.message || err.message);
        console.error(err);
    }
}

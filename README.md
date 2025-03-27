# 💡 Discordless

> Automate Discord. Without the boilerplate, without the infra, without the bullshit.

**Discordless** est un runtime modulaire, sécurisé et ultra-minimaliste pour créer des extensions Discord en 8 lignes de code — **sans hébergement, sans token, sans serveur.**

---

## 💸 Gratuit. 100%.  
Aucune carte de crédit. Aucun VPS à louer. Aucune infra à maintenir.

---

## ⚡ Pourquoi Discordless ?

✅ Zéro setup  
✅ 100% gratuit, pas besoin d’héberger quoi que ce soit  
✅ Code déclaratif, lisible et prévisible  
✅ Contexte auto-géré (plus besoin de `guildId`, `client`, etc.)  
✅ Sécurité sandboxée par défaut  
✅ Configuration par serveur, depuis un dashboard web  
✅ Compatible avec un écosystème de modules réutilisables

---

## 🧬 Exemple de module

```ts
registerListener("guildMemberAdd", (member) => {
    if (ensureRateLimit("welcomeInit")) return;

    const channel = config.getChannel("welcomeChannel");
    if (!channel) return;

    const message = config.getMessageTemplate("welcomeMessage", {
        member: {
            id: member.id,
            username: member.username,
        },
    });

    channel.send(message);
});
```

---

## 🛠️ Concepts clés

- `registerListener(event, callback)`  
  → déclare un listener sur un événement Discord

- `config.getChannel(key)`  
  → récupère un salon depuis la config serveur

- `ensureRateLimit(key)`  
  → bloque si trop de déclenchements récents (configurable)

---

## 🧪 Tester un module

> Depuis le dashboard, crée un module → colle ce code → clique sur "refresh".  
> Il est actif immédiatement. Aucun déploiement requis.

---

## 🔒 Environnement sécurisé

Chaque module :
- tourne dans une **VM isolée**
- n’a **aucun accès à Node.js**
- ne peut pas affecter d'autres modules
- peut être reloadé à chaud
- **ne nécessite aucun token Discord**

---

## 🔥 Pour les devs flemmards… et les admins exigeants

**Dev** : Tu veux faire un module vite fait, en 5 lignes, sans setup.  
**Admin** : Tu veux pouvoir contrôler le moindre détail (ratelimit, paramètres, autorisations).  
**Discordless** : C’est les deux à la fois.

---

## 🚀 Coming soon

- Marketplace de modules
- Docs officielles
- Éditeur low-code visuel
- API publique
- Système de partage/monétisation

---

## 📣 Rejoins la bêta

📍 https://discordless.dev  
💬 Discord (bientôt dispo)  
📫 hello@discordless.dev

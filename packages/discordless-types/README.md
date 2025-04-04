# 📦 @types/discordless

[![npm version](https://img.shields.io/npm/v/@types/discordless.svg?style=flat&color=blue)](https://www.npmjs.com/package/@types/discordless)
[![Discord](https://img.shields.io/discord/1355702301322645534?color=5865F2&label=discord)](https://discord.gg/uHe3scBWTE)

> Les types globaux pour développer des modules Discordless avec autocomplétion et vérification statique.

Ce package contient les **définitions TypeScript** nécessaires pour bénéficier d’une expérience de développement optimale avec **les modules Discordless**, même sans config complexe ou transpilation.  
Il expose automatiquement toutes les **primitives globales** disponibles côté module (`getUserStore`, `config.getString`, `registerListener`, etc).

---

## ✅ Installation

```bash
npm install --save-dev @types/discordless
```

---

## 🧠 Fonctionnalités

- 🔍 Autocomplétion des fonctions globales (ex. `getUserStore`, `registerCommand`)
- 📚 Typage de la configuration dynamique (`config.getString("...")`)
- 🔐 Type safety sur les événements (`registerListener("messageCreate", ...)`)
- 🧠 Typage intelligent des KV, RPC, instance, etc.

---

## 📁 Contenu

Le package injecte automatiquement un `global.d.ts` contenant :

```ts
declare const config: {
  getString(key: string): string;
  getNumber(key: string): number;
  getChannel(key: string): SafeTextChannel | null;
  getUser(key: string): SafeUser | null;
};

declare function registerListener<EventName extends string>(
  event: EventName,
  callback: (...args: any[]) => void
): void;

declare function registerCommand(
  name: string,
  options: {
    description: string;
    execute(interaction: CommandInteraction): void | Promise<void>;
  }
): void;

declare function getUserStore(userId: string): {
  get(key: string): any;
  set(key: string, value: any): void;
  add(key: string, delta: number): void;
};

declare function getUserRateLimit(userId: string): {
  consume(bucket: string, cost: number): boolean;
};

declare function getStateRecorder(userId: string): {
  updateState(name: string, value: any): void;
};

declare function scheduleTimeout(ms: number, callback: () => void): () => void;
declare function scheduleInterval(ms: number, callback: () => void): () => void;
```

> 📌 Tous ces types sont automatiquement reconnus sans import lorsque vous développez un module Discordless.

---

## 🛠 Utilisation

Aucune configuration supplémentaire n’est nécessaire.  
Il suffit d’installer le package et de développer votre module normalement avec `main.js` ou `main.ts`.

Vous pouvez aussi ajouter ce snippet à votre `tsconfig.json` si besoin :

```json
{
  "compilerOptions": {
    "types": ["@types/discordless"]
  }
}
```

---

## 🧪 Exemple

```ts
registerCommand("ping", {
  description: "Renvoie Pong!",
  async execute(interaction) {
    interaction.reply("Pong!");
  },
});

registerListener("messageCreate", (message) => {
  const store = getUserStore(message.author.id);
  store.add("messages", 1);
});
```

---

## 🤖 Compatible avec

- ✅ Modules Discordless (`main.js`, `main.ts`)
- ✅ Autocomplétion dans VS Code
- ✅ Typage dynamique des configs récupérées via `config.get...`
- ✅ Intégration transparente dans les projets TypeScript

---

## 📄 Licence

MIT — types générés et maintenus par la communauté Discordless.  
> Pour utiliser Discordless, voir aussi [discordless.js](https://npmjs.com/package/discordless.js) et le [CLI Discordless](https://npmjs.com/package/discordless).

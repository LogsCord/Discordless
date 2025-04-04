# 🧱 discordless.js

[![npm version](https://img.shields.io/npm/v/discordless.js.svg?style=flat&color=blue)](https://www.npmjs.com/package/discordless.js)
[![Discord](https://img.shields.io/discord/1355702301322645534?color=5865F2&label=discord)](https://discord.gg/uHe3scBWTE)

> Une librairie JS moderne pour interagir avec l’API Discordless, développer des bots connectés, multi-instances, décentralisés et supervisés.

**discordless.js** est la librairie officielle pour intégrer les fonctionnalités de Discordless dans vos projets JavaScript. Elle fournit des **primitives haut niveau**, une **API client typée**, et des **intégrations prêtes à l’emploi** avec les services Discordless (KV, logs, marketplace, RPC...).

---

## 🌐 Ressources

- 🧠 Site officiel : [discordless.dev](https://discordless.dev)
- 💬 Serveur Discord : [https://discord.gg/uHe3scBWTE](https://discord.gg/uHe3scBWTE)
- 📦 NPM : [discordless.js sur npm](https://www.npmjs.com/package/discordless.js)

---

## 🚀 Fonctionnalités

- 📡 **Connexion simple à l’API Discordless**
- 🔄 **Communication entre bots via RPC** (par Discordless, sans config)
- 🧠 **Primitives pour gérer les modules, les instances et les utilisateurs**
- 📊 **Publication automatique des logs sur Logscord & Discordless**
- 📦 **Accès au KV store partagé (DataStore global sécurisé)**
- 💸 **Primitives pour vendre vos modules et gérer les acheteurs**
- 🔐 **Auth automatique via token d’accès (user ou module)**

---

## 📦 Installation

```bash
npm install discordless.js
```

---

## 🛠️ Utilisation de base

```js
import { createClient } from "discordless.js";

const client = createClient({
  token: "sk_test_abc123", // Clé API Discordless
});

// Lire une valeur du KV store
const userXP = await client.kv.get(`xp:${userId}`);

// Envoyer un log
await client.log.info("Nouvelle commande utilisée !");

// Appeler un autre bot via RPC
await client.rpc.call("com.partenaire.shop", "sendGift", { to: userId });

// Publier un événement sur l’instance courante
client.instance.emit("eventName", { payload: true });
```

---

## 📚 Fonctions disponibles

### 🔑 Auth & instance

- `createClient({ token })`
- `client.instance.getInfo()`
- `client.instance.emit(name, payload)`
- `client.module.getBuyers()`

### 📦 KV Store

- `client.kv.get(key)`
- `client.kv.set(key, value)`
- `client.kv.delete(key)`
- `client.kv.list(prefix)`

### 🛰 RPC (Remote Bot Communication)

- `client.rpc.call(moduleId, methodName, args)`
- `client.rpc.listen(methodName, callback)`

### 📋 Logs

- `client.log.info(message)`
- `client.log.warn(message)`
- `client.log.error(message)`

---

## 👥 Gestion des acheteurs

```ts
const buyers = await client.module.getBuyers();
for (const buyer of buyers) {
  console.log(`${buyer.username} utilise ton bot !`);
}
```

---

## 🔒 Permissions

Certains endpoints nécessitent un token `module` ou `admin`.  
Les tokens sont générés depuis le [Dashboard Discordless](https://discordless.dev/dashboard).

---

## 🧪 À venir

- 🎛 `client.config.get()` pour récupérer dynamiquement les options de configuration exposées dans `main.js`
- 🧩 `client.devtools.trace()` pour publier des traces custom en dev
- 📈 Statistiques automatiques du bot

---

## 🧠 À propos

Cette librairie est maintenue par l’équipe de [Discordless](https://discordless.dev) pour offrir une expérience de dev **aussi fluide qu’un SDK Stripe**, mais pour vos bots Discord.

---

## 📄 Licence

Full terms available in [LICENSE.md](./LICENSE.md)

> ⚠️ This project uses the MIT license with the [Commons Clause](https://commonsclause.com/).  
> Commercial usage and redistribution are restricted.

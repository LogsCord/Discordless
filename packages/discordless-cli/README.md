# ⚡️ discordless

[![npm version](https://img.shields.io/npm/v/discordless.svg?style=flat&color=blue)](https://www.npmjs.com/package/discordless)
[![Discord](https://img.shields.io/discord/1355702301322645534?color=5865F2&label=discord)](https://discord.gg/uHe3scBWTE)

> Un CLI minimaliste, sécurisé et serverless pour développer et déployer des modules Discord sans infrastructure.

**discordless** est à Discord ce que **Cloudflare Workers** est au web : une manière ultra légère, modulaire et performante de créer des bots Discord **sans serveur, sans base de données, et sans friction**.

---

## 🌐 Ressources

- 🧠 Site officiel : [discordless.dev](https://discordless.dev)
- 💬 Serveur Discord : [https://discord.gg/uHe3scBWTE](https://discord.gg/uHe3scBWTE)
- 📦 NPM : [discordless sur npm](https://www.npmjs.com/package/discordless)

---

## 🚀 Fonctionnalités

- 🔐 **Login sécurisé** avec token API
- 📦 **Pull** d’un module Discordless existant (avec sélection interactive si besoin)
- 🚀 **Deploy** de vos fichiers en un `put` sécurisé
- 🧳 Stockage 100% serverless, pas de base de données à configurer
- ⚙️ Compatible avec tous les environnements Node (local, CI/CD, etc.)

---

## 📦 Installation

```bash
npm install -g discordless
```

---

## 🛠️ Commandes disponibles

### 🔐 Login

```bash
discordless login <apiKey>
```

Se connecte à Discordless et sauvegarde localement la clé API et vos infos utilisateur.

---

### 📥 Pull

```bash
discordless pull
# ou
discordless pull com.votre.module
```

- Si vous ne spécifiez pas de nom de module, le CLI vous propose une liste interactive.
- Récupère tous les fichiers du module et les place dans un dossier nommé selon le `packageName`.
- Génère automatiquement un fichier `.discordless.json`.

---

### 🚀 Deploy

```bash
discordless deploy
```

- Doit être exécuté dans un dossier contenant `.discordless.json`.
- Envoie tous les fichiers (hors `.git`, `node_modules`, etc.) au module correspondant via l’API `PUT /content`.

---

## 🧠 Exemples

```bash
# 1. Connexion
discordless login sk_test_abcdef12345

# 2. Récupération d’un module existant
discordless pull com.jidalfe.aker

# 3. Modification des fichiers...
# 4. Déploiement instantané
discordless deploy
```

---

## 📁 Structure générée

Après un `pull`, vous aurez :

```
com.votre.module/
  ├── .discordless.json
  ├── main.js
  └── ...
```

---

## 📡 API utilisée

Toutes les commandes communiquent avec :

```
https://discordless.dev/api/
```

---

## 🧪 À venir

- `discordless init` pour créer un nouveau module localement
- `discordless publish` pour enregistrer un nouveau module dans le registry
- `discordless dev` pour tester les listeners en local

---

## 🧠 À propos

Ce projet est une initiative de [@arcadia.online](https://github.com/LogsCord/Discordless) pour rendre le développement de bots Discord **aussi simple qu’un microservice**.

---

## 📄 Licence

Full terms available in [LICENSE.md](./LICENSE.md)

> ⚠️ This project uses the MIT license with the [Commons Clause](https://commonsclause.com/).  
> Commercial usage and redistribution are restricted.

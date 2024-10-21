# MySQL Connection Pool and Connection Classes

## Description

Ce projet fournit deux classes JavaScript, `Pool` et `Connection`, pour faciliter la gestion des connexions à une base de données MySQL dans une application Node.js. Ces classes utilisent la bibliothèque `mysql2/promise` pour offrir une interface asynchrone et simplifiée pour interagir avec MySQL.

### Fonctionnalités

- **Pool de Connexion** : 
  - Gère une seule instance de pool de connexions pour optimiser les performances et minimiser les frais généraux liés à la création de nouvelles connexions.
  - Vérifie les variables d'environnement nécessaires (hôte, port, utilisateur, mot de passe).
  - Offre une méthode pour fermer le pool de connexions proprement.

- **Connexion à la Base de Données** : 
  - Permet d'établir une connexion à une base de données spécifique.
  - Gère les requêtes SQL avec des méthodes pour exécuter des requêtes simples et des transactions.
  - Relâche automatiquement la connexion après utilisation pour éviter les fuites de mémoire.

### Utilisation

1. **Installation** : Assurez-vous d'avoir `Node.js` et `mysql2` installés dans votre environnement. Vous pouvez installer `mysql2` avec la commande :
   ```bash
   npm install mysql2
   ```
2. **Configuration** : Créez un fichier `.env` à la racine de votre projet avec les variables d'environnement suivantes :
   ```makefile
   DB_HOST=<votre_hôte>
   DB_PORT=<votre_port>
   DB_USER=<votre_utilisateur>
   DB_PASSWORD=<votre_mot_de_passe>
   ```
3. **Exemple d'utilisation** :
   ```javascript
   const Pool = require('./Pool');
   const Connection = require('./Connection');

   // Initialiser le pool
   Pool.connect();

   // Créer une connexion à une base de données spécifique
   const db = new Connection('nom_de_la_base');

   // Exécuter une requête
   db.query({ querySQL: 'SELECT * FROM utilisateurs' })
      .then(result => console.log(result))
      .catch(error => console.error(error))
      .finally(() => Connection.end()); // Ne pas oublier de fermer le pool
   ```

### Auteur(s)

- **Panthera Code** - Développeur principale

### Licence

Ce projet est sous MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.
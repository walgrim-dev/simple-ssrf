const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Le dossier public qui contient 
app.use(express.static('public'));

/**
 * Exemple de faille SSRF
 * Il attend un paramètre query "target" qui doit contenir une URL.
 * Aucune validation n’est effectuée, ce qui permet d’effectuer une requête vers n’importe quelle adresse.
 *
 * Pour contourner (très simplement) une détection statique basique, on peut "reconstruire" la chaîne.
 */
app.get('/api', async (req, res) => {
    // je récupère le target en paramètre de la requête
    let targetInput = req.query.target;
    if (!targetInput) {
        return res.status(400).send("Paramètre 'target' manquant.");
    }

    // Perturbe directement le sast -> fait possiblement croire que je check le target
    let target = targetInput.split('').join('');

    try {
        const response = await fetch(target);
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).send('Erreur lors de la requête vers ' + target + ' : ' + error.toString());
    }
});

app.get('/stock', (req, res) => {
    // On récupère le paramètre "id" de la requête
    let id = req.query.id;
    console.log('Id : ' + id);
    if (id == 1) {
        res.send("Stock disponible : 10");
    } else {
        res.send("Stock disponible : 0");
    }
});

// Endpoint "admin" qui renvoie une page sensible
app.get('/admin', (req, res) => {
    // Ici, on simule une page d'administration
    res.send(`
    <h1>Page d'administration</h1>
    <p>Informations sensibles : [données secrètes]</p>
  `);
});

// Lancement sur le port 3000
app.listen(3000, () => {
    console.log("Serveur lancé sur le port 3000");
});
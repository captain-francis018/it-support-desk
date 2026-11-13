const express = require("express");
const pool = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;

// Permet au serveur de lire les données JSON envoyées par le client
app.use(express.json());



app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "OK",
            application: "IT Support Desk API",
            database: "connected"
        });

    } catch (error) {
        console.error("Health check failed:", error.message);

        res.status(503).json({
            status: "ERROR",
            application: "IT Support Desk API",
            database: "disconnected"
        });
    }
});


// Consulter tous les tickets depuis PostgreSQL
app.get("/api/tickets", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tickets ORDER BY created_at DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Erreur lors de la récupération des tickets :", error);

        res.status(500).json({
            error: "Erreur interne du serveur"
        });
    }
});

// Créer un ticket dans PostgreSQL
app.post("/api/tickets", async (req, res) => {
    let { title, description, priority } = req.body;

    // Vérification des champs obligatoires
    if (!title || !description || !priority) {
        return res.status(400).json({
            error: "Tous les champs sont obligatoires"
        });
    }

    // Vérification du type et de la longueur du titre
    if (
        typeof title !== "string" ||
        title.trim().length === 0 ||
        title.trim().length > 150
    ) {
        return res.status(400).json({
            error: "Le titre doit contenir entre 1 et 150 caractères"
        });
    }

    // Vérification de la description
    if (
        typeof description !== "string" ||
        description.trim().length === 0
    ) {
        return res.status(400).json({
            error: "La description est obligatoire"
        });
    }

    // Normalisation des données
    title = title.trim();
    description = description.trim();

    // Vérification de la priorité
    const validPriorities = ["low", "medium", "high"];

    if (
    typeof priority !== "string" ||
    !validPriorities.includes(priority)
    ) {
        return res.status(400).json({
            error: "La priorité doit être low, medium ou high"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO tickets (title, description, priority)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [title, description, priority]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Erreur lors de la création du ticket :", error.message);

        if (error.code === "23514") {
            return res.status(400).json({
                error: "Les données ne respectent pas les contraintes de la base"
            });
        }

        res.status(500).json({
            error: "Erreur interne du serveur"
        });
    }
});

// Gestion centralisée des erreurs
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            error: "Le format JSON envoyé est invalide"
        });
    }

    console.error("Erreur serveur :", error.message);

    res.status(500).json({
        error: "Erreur interne du serveur"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Adresse relative de notre API
const API_URL = "/api";

// Récupérer et afficher les tickets
async function loadTickets() {
    const container = document.getElementById("tickets-container");

    try {
        const response = await fetch(`${API_URL}/tickets`);

        if (!response.ok) {
            throw new Error("Impossible de récupérer les tickets");
        }

        const tickets = await response.json();

        container.innerHTML = "";

        tickets.forEach(ticket => {
            const article = document.createElement("article");

            const title = document.createElement("h3");
            title.textContent = ticket.title;

            const description = document.createElement("p");
            description.textContent = ticket.description;

            const priority = document.createElement("p");
            priority.textContent = `Priorité : ${ticket.priority}`;

            const status = document.createElement("p");
            status.textContent = `Statut : ${ticket.status}`;

            article.append(title, description, priority, status);
            container.appendChild(article);
        });

    } catch (error) {
        container.textContent = error.message;
        console.error(error);
    }
}

// Récupérer le formulaire
const ticketForm = document.getElementById("ticket-form");

// Écouter la soumission du formulaire
ticketForm.addEventListener("submit", async (event) => {

    // Empêcher le rechargement automatique de la page
    event.preventDefault();

    // Récupérer les valeurs saisies
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;

    try {
        // Envoyer les données au backend
        const response = await fetch(`${API_URL}/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                priority
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Erreur lors de la création");
        }

        // Réinitialiser le formulaire
        ticketForm.reset();

        // Actualiser la liste des tickets
        await loadTickets();

        alert("Ticket créé avec succès !");

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
});

// Charger les tickets au démarrage
loadTickets();

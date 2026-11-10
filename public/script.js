
const form = document.getElementById("profileForm");
const container = document.getElementById("profilesContainer");
const message = document.getElementById("message");

// Load saved profiles
async function loadProfiles() {
    try {
        const response = await fetch("/api/profiles");
        if (!response.ok) throw new Error("Failed to load profiles");

        const profiles = await response.json();

        container.innerHTML = "";

        if (profiles.length === 0) {
            container.innerHTML = "<p>No profiles created yet.</p>";
            return;
        }

        profiles.forEach(profile => {
            const card = document.createElement("div");
            card.className = "profile-card";

            const title = document.createElement("h3");
            title.textContent = profile.name;

            const bio = document.createElement("p");
            bio.textContent = profile.bio || "No bio provided";

            const skills = document.createElement("p");
            skills.textContent = "Skills: " + (profile.skills || "Not specified");

            card.append(title, bio, skills);

            if (profile.social) {
                const link = document.createElement("a");
                link.href = profile.social;
                link.textContent = "Visit Social Profile";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                card.appendChild(link);
            }

            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = "Unable to load profiles.";
        console.error(error);
    }
}

// Create new profile
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const profile = {
        name: document.getElementById("name").value.trim(),
        bio: document.getElementById("bio").value.trim(),
        skills: document.getElementById("skills").value.trim(),
        social: document.getElementById("social").value.trim()
    };

    try {
        const response = await fetch("/api/profiles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        message.textContent = result.message;
        message.style.color = "green";

        form.reset();

        await loadProfiles();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});

// Initial load
loadProfiles();

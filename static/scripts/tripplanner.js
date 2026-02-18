function startTour(){
    const globe = document.getElementById("globe");
    const cards = document.getElementById("cards");

    globe.style.display = "none";
    cards.style.display = "flex";
}








async function startTour() {

    const globe = document.getElementById("globe");
    const cardsContainer = document.getElementById("cards");

    const data = {
        starting_location: document.getElementById("startingLocation").value,
        days: document.getElementById("days").value,
        min_budget: document.getElementById("minBudget").value,
        max_budget: document.getElementById("maxBudget").value,
        places: document.getElementById("places").value,
        stay_type: document.getElementById("stayType").value,
        restaurant_type: document.getElementById("restaurantType").value,
        preferences: document.getElementById("preferences").value,
        people_count: document.getElementById("peopleCount").value
    };

    try {

        cardsContainer.innerHTML = "";
        globe.style.display = "none";
        cardsContainer.style.display = "flex";

        const response = await fetch("/generate-trip-plan/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
            return;
        }

        const days = result.days;

        for (const dayKey in days) {

            const d = days[dayKey];

            const activityHTML = (period) => {
                return d[period].activities.map(a => {

                    if (typeof a === "string") {
                        return `
                            <div class="activity-item">
                                <strong>${a}</strong>
                            </div>
                        `;
                    }

                    return `
                        <div class="activity-item">
                            <strong>${a.name}</strong>
                            <p>${a.description || ""}</p>
                        </div>
                    `;
                }).join("");
            };

            const hotelHTML = d.hotels.map(h => `
                <div class="inner-card">
                    <h4>${h.name}</h4>
                    <p>⭐ ${h.rating}</p>
                    <p>₹ ${h.cost_per_night}</p>
                    <a href="${h.booking_link}" target="_blank" class="btn-link">Book Now</a>
                </div>
            `).join("");

            const restaurantHTML = d.restaurants.map(r => `
                <div class="inner-card">
                    <h4>${r.name}</h4>
                    <p>⭐ ${r.rating}</p>
                    <p>₹ ${r.average_cost}</p>
                    <a href="${r.map_link}" target="_blank" class="btn-link">View</a>
                </div>
            `).join("");

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h2>${dayKey} - ${d.city || ""}</h2>

                <div class="section travel-box">
                    <h3>🚆 Intercity Travel</h3>
                    <p><strong>From:</strong> ${d.intercity_travel?.from || "-"}</p>
                    <p><strong>To:</strong> ${d.intercity_travel?.to || "-"}</p>
                    <p><strong>Mode:</strong> ${d.intercity_travel?.mode || "-"}</p>
                    <p><strong>Duration:</strong> ${d.intercity_travel?.duration || "-"}</p>
                    <p><strong>Cost:</strong> ₹ ${d.intercity_travel?.cost || "-"}</p>
                </div>

                <div class="section">
                    <h3>🌅 Morning (${d.morning.time})</h3>
                    ${activityHTML("morning")}
                </div>

                <div class="section">
                    <h3>🌤 Afternoon (${d.afternoon.time})</h3>
                    ${activityHTML("afternoon")}
                </div>

                <div class="section">
                    <h3>🌙 Evening (${d.evening.time})</h3>
                    ${activityHTML("evening")}
                </div>

                <div class="section travel-box">
                    <h3>🚌 Local Transport</h3>
                    <p><strong>Mode:</strong> ${d.local_transport?.mode || "-"}</p>
                    <p><strong>Estimated Cost:</strong> ₹ ${d.local_transport?.estimated_cost || "-"}</p>
                </div>

<div class="section dual-grid">
    <div>
        <h3>🏨 Hotels</h3>
        ${hotelHTML}
    </div>
    <div>
        <h3>🍽 Restaurants</h3>
        ${restaurantHTML}
    </div>
</div>


                <div class="section cost-box">
                    <h3>💰 Cost Breakdown</h3>
                    <p>Stay: ₹ ${d.cost_breakdown.stay}</p>
                    <p>Food: ₹ ${d.cost_breakdown.food}</p>
                    <p>Transport: ₹ ${d.cost_breakdown.transport}</p>
                    <p>Activities: ₹ ${d.cost_breakdown.activities}</p>
                    <h4>Total: ₹ ${d.cost_breakdown.total_per_day}</h4>
                </div>
            `;

            cardsContainer.appendChild(card);
        }

        // ===== SUMMARY CARD =====

        const summary = result.summary;

        const summaryCard = document.createElement("div");
        summaryCard.className = "card summary-card";

        const safeList = (arr) => {
            return arr.map(t => {
                if (typeof t === "string") return `<p>• ${t}</p>`;
                return `<p>• ${Object.values(t)[0]}</p>`;
            }).join("");
        };

        summaryCard.innerHTML = `
            <h2>📊 Trip Summary</h2>
            <p><strong>Total Cost:</strong> ₹ ${summary.total_estimated_trip_cost}</p>
            <p><strong>Budget Comment:</strong> ${summary.budget_suitability_comment}</p>

            <h3>💡 Money Saving Tips</h3>
            ${safeList(summary.money_saving_tips)}

            <h3>🛡 Safety Tips</h3>
            ${safeList(summary.safety_tips)}
        `;

        cardsContainer.appendChild(summaryCard);

    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
}

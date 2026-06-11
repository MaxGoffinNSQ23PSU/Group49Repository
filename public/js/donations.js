const foodbankSelect = document.getElementById("foodbank-select");
const listingsContainer = document.getElementById("listings-container");

function clearListings() {
	listingsContainer.replaceChildren();
	listingsContainer.setAttribute("aria-busy", "false");
}

function showMessage(message, isBusy = false) {
	const paragraph = document.createElement("p");

	paragraph.textContent = message;
	listingsContainer.replaceChildren(paragraph);
	listingsContainer.setAttribute("aria-busy", String(isBusy));
}

function renderListings(listings) {
	if (!listings.length) {
		showMessage("No specific items listed - all donations welcome.");
		return;
	}

	const heading = document.createElement("h2");
	const list = document.createElement("ul");

	heading.textContent = "Requested Donations";
	list.className = "donation-listings";

	for (const item of listings) {
		const card = document.createElement("li");
		const itemName = document.createElement("h3");

		card.className = "listing-card";
		itemName.textContent = item.item_name;
		card.appendChild(itemName);

		if (item.tags && item.tags.length) {
			const tagsList = document.createElement("ul");

			tagsList.className = "tags";
			tagsList.setAttribute("aria-label", `Tags for ${item.item_name}`);

			for (const tag of item.tags) {
				const tagItem = document.createElement("li");

				tagItem.className = "tag";
				tagItem.textContent = tag;
				tagsList.appendChild(tagItem);
			}

			card.appendChild(tagsList);
		}

		list.appendChild(card);
	}

	listingsContainer.replaceChildren(heading, list);
	listingsContainer.setAttribute("aria-busy", "false");
}

async function loadDonationListings() {
	const foodbankId = foodbankSelect.value;

	if (!foodbankId) {
		clearListings();
		return;
	}

	listingsContainer.setAttribute("aria-busy", "true");
	showMessage("Loading requested donations...", true);

	try {
		const response = await fetch(`/donations/listings?foodbank_id=${encodeURIComponent(foodbankId)}`);

		if (!response.ok) throw new Error("Unable to load donation listings.");

		const data = await response.json();
		renderListings(data.listings || []);
	}
	catch (error) {
		showMessage("Requested donations could not be loaded. Please try again.");
	}
}

if (foodbankSelect && listingsContainer) {
	foodbankSelect.addEventListener("change", loadDonationListings);
}

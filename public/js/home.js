const mapElement = document.getElementById("map");
const addressInput = document.getElementById("address-input");
const findLocationButton = document.getElementById("find-location");
const detailsPanel = document.getElementById("details-panel");
const panelContent = document.getElementById("panel-content");
const closePanelButton = document.getElementById("close-panel");

let userMarker = null;
let userLocation = null;
let routeLine = null;

if (mapElement) {
	const map = L.map("map").setView([52.4862, -1.9090], 14);

	L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
		attribution: "(c) OpenStreetMap contributors (c) CARTO"
	}).addTo(map);

	loadFoodbanks();

	findLocationButton?.addEventListener("click", findLocation);

	closePanelButton?.addEventListener("click", () => {
		detailsPanel.classList.add("hidden");
	});

	panelContent?.addEventListener("click", (event) => {
		const button = event.target.closest(".directions-button");
		if (button) {
			const url = `https://www.google.com/maps/dir/?api=1&destination=${button.dataset.lat},${button.dataset.lon}`;
			window.open(url, "_blank");
			return;
		}

		const previewButton = event.target.closest(".route-preview-button");
		if (previewButton) previewRoute(previewButton.dataset.lat, previewButton.dataset.lon);
	});

	window.addEventListener("resize", () => {
		map.invalidateSize();
	});

	async function loadDetails(id) {
		const response = await fetch(`/foodbanks/${id}/data`);
		const data = await response.json();
		const { foodbank, listings } = data;

		const listingsHTML = listings.length === 0
			? "<p>No stock information available.</p>"
			: `<ul>
				${listings.map(item => `
					<li class="listing-card">
						<h3>${item.item_name}</h3>
						<p>${item.quantity} ${item.unit}</p>
						${item.tags && item.tags[0] !== null
							? `<ul class="tags">${item.tags.map(tag => `<li class="tag">${tag}</li>`).join("")}</ul>`
							: ""}
					</li>
				`).join("")}
			</ul>`;

			panelContent.innerHTML = `
				<h2 id="panel-title">${foodbank.name}</h2>
				<p>${foodbank.address}</p>
				<p><strong>Opening times:</strong> ${foodbank.opening_times}</p>
				<button class="directions-button" type="button" data-lat="${foodbank.latitude}" data-lon="${foodbank.longitude}">
					Open in Google Maps (new tab)
				</button>
				<button class="route-preview-button" type="button" data-lat="${foodbank.latitude}" data-lon="${foodbank.longitude}">
					Preview Route
				</button>
			<h3>Available Stock</h3>
			${listingsHTML}
		`;

			detailsPanel.classList.remove("hidden");
			detailsPanel.focus();
		}

	async function loadFoodbanks() {
		const response = await fetch("/foodbanks");
		const data = await response.json();

		for (const bank of data.foodbanks) {
			const marker = L.marker([bank.latitude, bank.longitude]).addTo(map);
			marker.on("click", () => loadDetails(bank.id));
		}
	}

	function findLocation() {
		const address = addressInput.value.trim();
		if (address) {
			searchAddress(address);
			return;
		}

		if (!navigator.geolocation) {
			alert("Your browser does not support location lookup. Try entering a postcode.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => showUserLocation(position.coords.latitude, position.coords.longitude),
			() => alert("Location permission was denied. Try entering a postcode instead."),
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	async function searchAddress(address) {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
		);
		const data = await response.json();

		if (data.length === 0) {
			alert("Address not found - try adding Birmingham or a postcode.");
			return;
		}

		const { lat, lon } = data[0];
		showUserLocation(lat, lon);
	}

	function showUserLocation(lat, lon) {
		if (userMarker) map.removeLayer(userMarker);

		userLocation = [Number(lat), Number(lon)];
		userMarker = L.circleMarker([lat, lon], {
			radius: 10,
			fillColor: "#e63946",
			color: "#fff",
			weight: 2,
			fillOpacity: 0.9
		}).addTo(map).bindPopup("You are here").openPopup();

		map.setView([lat, lon], 15);
	}

	async function previewRoute(lat, lon) {
		if (!userLocation) {
			alert("Use Find me or enter a postcode before previewing a route.");
			return;
		}

		const url = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${lon},${lat}?overview=full&geometries=geojson`;
		const response = await fetch(url);
		const data = await response.json();
		const coordinates = data.routes?.[0]?.geometry?.coordinates;

		if (!coordinates) {
			alert("Could not preview the route. Google Maps is still available.");
			return;
		}

		if (routeLine) map.removeLayer(routeLine);
		routeLine = L.polyline(coordinates.map(([lng, lat]) => [lat, lng]), {
			color: "#1f78b4",
			weight: 5
		}).addTo(map);
		map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
	}
}

const faqContainer = document.querySelector(".faq-container");

faqContainer?.addEventListener("click", (event) => {
	const button = event.target.closest(".faq-question");
	if (!button) return;

	const answer = button.nextElementSibling;
	const symbol = button.querySelector("span");
	const isOpen = answer.style.display === "block";

	answer.style.display = isOpen ? "none" : "block";
	symbol.textContent = isOpen ? "+" : "-";
});

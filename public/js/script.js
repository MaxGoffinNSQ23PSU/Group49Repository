//mobile
const burger = document.getElementById("burger");
const nav = document.querySelector(".header nav");

if (burger && nav) {
	burger.addEventListener("click", function () {
		nav.classList.toggle("open");
	});
}
//mobile
const burger = document.getElementById("burger");
const nav = document.querySelector(".header nav");
 
if (burger && nav) {
    burger.addEventListener("click", function () {
        nav.classList.toggle("open");
    });
}

//light themese
function applyTheme(theme) {
    
    document.body.classList.remove('dark', 'high-contrast');

    
    if (theme === 'dark') document.body.classList.add('dark');
    if (theme === 'high_contrast') document.body.classList.add('high-contrast');

    
    localStorage.setItem('theme', theme);
}


const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme);
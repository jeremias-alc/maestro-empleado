const paginaActual = window.location.pathname.split("/").pop();
console.log("Página actual:", paginaActual); // <-- ¿esto aparece?

document.querySelectorAll(".nav-links a").forEach(link => {
  const href = link.getAttribute("href");
  if (href === paginaActual) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

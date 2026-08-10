const fadeSections = document.querySelectorAll(".fade-section");
const menuButton = document.querySelector(".menu-toggle");
const navWrap = document.querySelector(".nav-wrap");
const arrow = document.querySelector(".scroll-arrow");

if (menuButton && navWrap) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

if (arrow) {
  arrow.addEventListener("click", () => {
    document.querySelector("#about-preview")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  fadeSections.forEach((section) => observer.observe(section));
} else {
  fadeSections.forEach((section) => section.classList.add("is-visible"));
}

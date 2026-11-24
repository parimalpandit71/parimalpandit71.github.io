const fadeSections = document.querySelectorAll(".fade-section");
const menuButton = document.querySelector(".menu-toggle");
const navWrap = document.querySelector(".nav-wrap");
const arrow = document.querySelector(".scroll-arrow");
const credentialCarousel = document.querySelector("[data-credential-carousel]");
const quoteCarousel = document.querySelector("[data-quote-carousel]");
const serviceAccordions = document.querySelectorAll(".service-accordion");

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

if (quoteCarousel) {
  const quotes = [
    {
      text: "“We do not get to choose our difficulties and challenges, but do have the ability to select our attitudes and responses, decide what we make of them, and maintain a sense of dignity.”",
      author: "Viktor Frankl, Austrian psychiatrist and Holocaust survivor",
    },
    {
      text: "“Pain in this life is not avoidable, but the pain we create avoiding pain is avoidable.”",
      author: "Ronald David Liang, British psychiatrist",
    },
    {
      text: "“To truly know the world, look deeply within your own being; to truly know yourself, take real interest in the world.”",
      author: "Rudolf Steiner, Austrian spiritual scientist and founder of Anthroposophy",
    },
    {
      text: "“Safety is not the absence of threat… it is the presence of connection.”",
      author: "Dr. Gabor Maté, Canadian physician",
    },
    {
      text: "“We don’t get wounded alone and we don’t heal alone.”",
      author: "Carl Jung, Swiss psychiatrist",
    },
  ];
  const quoteCard = quoteCarousel.querySelector(".quote-card");
  const quoteText = quoteCarousel.querySelector("[data-quote-text]");
  const quoteAuthor = quoteCarousel.querySelector("[data-quote-author]");
  const previousQuoteButton = quoteCarousel.querySelector("[data-quote-previous]");
  const nextQuoteButton = quoteCarousel.querySelector("[data-quote-next]");
  const quoteDots = Array.from(quoteCarousel.querySelectorAll("[data-quote-index]"));
  const reduceQuoteMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentQuoteIndex = 0;
  let quoteTimer;

  const renderQuote = (nextIndex) => {
    currentQuoteIndex = (nextIndex + quotes.length) % quotes.length;
    const quote = quotes[currentQuoteIndex];
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
    quoteDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentQuoteIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
    quoteCard.classList.remove("is-entering");
    void quoteCard.offsetWidth;
    quoteCard.classList.add("is-entering");
  };

  const stopQuoteTimer = () => window.clearTimeout(quoteTimer);

  const startQuoteTimer = () => {
    stopQuoteTimer();
    if (reduceQuoteMotion || document.hidden || quoteCarousel.matches(":hover") || quoteCarousel.contains(document.activeElement)) return;
    quoteTimer = window.setTimeout(() => {
      renderQuote(currentQuoteIndex + 1);
      startQuoteTimer();
    }, 6000);
  };

  previousQuoteButton.addEventListener("click", () => {
    renderQuote(currentQuoteIndex - 1);
    startQuoteTimer();
  });
  nextQuoteButton.addEventListener("click", () => {
    renderQuote(currentQuoteIndex + 1);
    startQuoteTimer();
  });
  quoteDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      renderQuote(Number(dot.dataset.quoteIndex));
      startQuoteTimer();
    });
  });
  quoteCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") renderQuote(currentQuoteIndex - 1);
    if (event.key === "ArrowRight") renderQuote(currentQuoteIndex + 1);
  });
  quoteCarousel.addEventListener("mouseenter", stopQuoteTimer);
  quoteCarousel.addEventListener("mouseleave", startQuoteTimer);
  quoteCarousel.addEventListener("focusin", stopQuoteTimer);
  quoteCarousel.addEventListener("focusout", () => window.setTimeout(() => {
    if (!quoteCarousel.contains(document.activeElement)) startQuoteTimer();
  }));
  document.addEventListener("visibilitychange", startQuoteTimer);

  startQuoteTimer();
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

if (credentialCarousel) {
  const credentials = [
    { title: "Clinical Psychologist and Psychotherapist", issuer: "University of Pune" },
    { title: "NET", issuer: "University of Pune" },
    { title: "Certified Clinical Counsellor", issuer: "Maharashtra Institute of Mental Health (MIMH), Pune" },
    { title: "Certified Anthroposophic Psychotherapist and Trainer", issuer: "International Federation of Anthroposophic Psychotherapy Associations · Goetheanum, Dornach, Switzerland" },
    { title: "Certified Biography Consultant", issuer: "Living Pathways, UK · Recognized by the Goetheanum" },
    { title: "Certified Professional Supervisor", issuer: "Indian Academy of Professional Supervisors (IAPS)" },
    { title: "EMDR Practitioner", issuer: "" },
  ];
  const title = credentialCarousel.querySelector("[data-carousel-title]");
  const issuer = credentialCarousel.querySelector("[data-carousel-issuer]");
  const index = credentialCarousel.querySelector("[data-carousel-index]");
  const slide = credentialCarousel.querySelector(".credential-carousel-slide");
  const previousButton = credentialCarousel.querySelector("[data-carousel-previous]");
  const nextButton = credentialCarousel.querySelector("[data-carousel-next]");
  const toggleButton = credentialCarousel.querySelector("[data-carousel-toggle]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
  let timer;
  let isPlaying = !reducedMotion.matches;

  const renderCredential = (nextIndex) => {
    currentIndex = (nextIndex + credentials.length) % credentials.length;
    const credential = credentials[currentIndex];
    title.textContent = credential.title;
    issuer.textContent = credential.issuer;
    issuer.hidden = !credential.issuer;
    index.textContent = String(currentIndex + 1).padStart(2, "0");
    slide.classList.remove("is-entering");
    void slide.offsetWidth;
    slide.classList.add("is-entering");
  };

  const stopTimer = () => {
    window.clearTimeout(timer);
    credentialCarousel.classList.remove("is-playing");
  };

  const startTimer = () => {
    stopTimer();
    if (!isPlaying || document.hidden || credentialCarousel.matches(":hover") || credentialCarousel.contains(document.activeElement)) return;
    void credentialCarousel.offsetWidth;
    credentialCarousel.classList.add("is-playing");
    timer = window.setTimeout(() => {
      renderCredential(currentIndex + 1);
      startTimer();
    }, 6000);
  };

  const updateToggle = () => {
    toggleButton.textContent = isPlaying ? "Ⅱ" : "▶";
    toggleButton.setAttribute("aria-label", isPlaying ? "Pause automatic rotation" : "Start automatic rotation");
  };

  previousButton.addEventListener("click", () => {
    renderCredential(currentIndex - 1);
    startTimer();
  });

  nextButton.addEventListener("click", () => {
    renderCredential(currentIndex + 1);
    startTimer();
  });

  toggleButton.addEventListener("click", () => {
    isPlaying = !isPlaying;
    updateToggle();
    startTimer();
  });

  credentialCarousel.addEventListener("mouseenter", stopTimer);
  credentialCarousel.addEventListener("mouseleave", startTimer);
  credentialCarousel.addEventListener("focusin", stopTimer);
  credentialCarousel.addEventListener("focusout", () => window.setTimeout(() => {
    if (!credentialCarousel.contains(document.activeElement)) startTimer();
  }));
  document.addEventListener("visibilitychange", startTimer);

  updateToggle();
  renderCredential(0);
  startTimer();
}

if (serviceAccordions.length) {
  const reduceAccordionMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let accordionAnimationId = 0;

  const openAccordion = (accordion) => {
    const panel = accordion.querySelector(".service-accordion-panel");
    accordion.dataset.animationId = String(++accordionAnimationId);
    accordion.open = true;

    if (reduceAccordionMotion) {
      accordion.classList.add("is-expanded");
      return;
    }

    accordion.classList.remove("is-expanded");
    void panel.offsetHeight;
    window.requestAnimationFrame(() => accordion.classList.add("is-expanded"));
  };

  const closeAccordion = (accordion) => {
    const panel = accordion.querySelector(".service-accordion-panel");
    const animationId = String(++accordionAnimationId);
    accordion.dataset.animationId = animationId;
    accordion.classList.remove("is-expanded");

    if (reduceAccordionMotion) {
      accordion.open = false;
      return;
    }

    let hasFinished = false;
    const finishClosing = () => {
      if (hasFinished) return;
      hasFinished = true;
      panel.removeEventListener("transitionend", handleTransitionEnd);
      if (accordion.dataset.animationId === animationId) accordion.open = false;
    };
    const handleTransitionEnd = (event) => {
      if (event.target === panel && event.propertyName === "grid-template-rows") {
        finishClosing();
      }
    };

    panel.addEventListener("transitionend", handleTransitionEnd);
    window.setTimeout(finishClosing, 460);
  };

  serviceAccordions.forEach((accordion) => {
    if (accordion.open) accordion.classList.add("is-expanded");

    accordion.querySelector("summary").addEventListener("click", (event) => {
      event.preventDefault();

      if (accordion.classList.contains("is-expanded")) {
        closeAccordion(accordion);
        return;
      }

      serviceAccordions.forEach((otherAccordion) => {
        if (otherAccordion !== accordion && otherAccordion.classList.contains("is-expanded")) {
          closeAccordion(otherAccordion);
        }
      });
      openAccordion(accordion);
    });
  });
}

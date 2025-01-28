document.addEventListener("DOMContentLoaded", function () {
  // ==================== Mobile Menu Toggle ====================
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ==================== Tab Functionality ====================
const toggleButtons = document.querySelectorAll(".ingredients-toggle");

toggleButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const cardContent = this.closest(".formula-item-content");
    const menuList = cardContent.querySelector(".menuss-lists");
    const arrow = this.querySelector(".dropdown-arrow");

    // Close other open menus
    document.querySelectorAll(".menuss-lists").forEach((otherList) => {
      if (otherList !== menuList) {
        otherList.classList.remove("active");
        otherList
          .closest(".formula-item-content")
          .querySelector(".dropdown-arrow")
          .classList.remove("rotate-179");
      }
    });

    // Toggle current menu
    menuList.classList.toggle("active");
    arrow.classList.toggle("rotate-179");

    // Update aria-expanded
    const isExpanded = menuList.classList.contains("active");
    this.setAttribute("aria-expanded", isExpanded);
  });
});

  // ==================== Accordion Dropdowns ====================
  function initializeDropdowns() {
    document.querySelectorAll(".ingredients-toggle").forEach((toggle) => {
      const dropdown = toggle
        .closest(".formula-card")
        ?.querySelector(".ingredients-dropdown");
      const arrow = toggle.querySelector(".dropdown-arrow");

      if (!dropdown || !arrow) return;

      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains("opacity-100");

        dropdown.classList.toggle("translate-y-4", isOpen);
        dropdown.classList.toggle("opacity-0", isOpen);
        dropdown.classList.toggle("translate-y-0", !isOpen);
        dropdown.classList.toggle("opacity-100", !isOpen);
        dropdown.classList.toggle("pointer-events-none", isOpen);
        arrow.classList.toggle("rotate-179", !isOpen);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".ingredients-dropdown").forEach((dropdown) => {
        if (
          !dropdown.contains(e.target) &&
          !e.target.closest(".ingredients-toggle") &&
          dropdown.classList.contains("opacity-100")
        ) {
          dropdown.classList.add(
            "translate-y-4",
            "opacity-0",
            "pointer-events-none"
          );
          dropdown.classList.remove("translate-y-0", "opacity-100");
          dropdown.previousElementSibling
            ?.querySelector(".dropdown-arrow")
            ?.classList.remove("rotate-179");
        }
      });
    });
  }
  initializeDropdowns();

  // ==================== Testimonial & Image Sliders ====================
  function initializeSliders() {
    // Testimonial Slider
    new Splide("#splide", {
      type: "loop",
      perPage: 3,
      perMove: 1,
      gap: "2rem",
      autoplay: true,
      interval: 3000,
      pauseOnHover: true,
      arrows: false,
      pagination: false,
      breakpoints: {
        1024: { perPage: 3 },
        767: { perPage: 2 },
        640: { perPage: 1 },
      },
    }).mount();

    // Image Slider with Lightbox
    const imageSlider = new Splide("#image-slider", {
      type: "loop",
      perPage: 5,
      perMove: 1,
      gap: "1rem",
      arrows: false,
      autoplay: true,
      interval: 3000,
      breakpoints: {
        1024: { perPage: 3 },
        767: { perPage: 2 },
        540: { perPage: 1, focus: "center" },
      },
    }).mount();

    // Lightbox Functionality
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");

    document.querySelectorAll(".lightbox-trigger").forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImage.src = img.src;
        lightbox?.classList.remove("hidden");
      });
    });

    document.getElementById("lightbox-close")?.addEventListener("click", () => {
      lightbox?.classList.add("hidden");
    });

    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.add("hidden");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightbox?.classList.add("hidden");
    });
  }
  initializeSliders();

  // ==================== Auto-Update Copyright Year ====================
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ==================== FAQ Accordion ====================
  document.querySelectorAll("[data-accordion-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button
        .getAttribute("data-accordion-target")
        .replace("#", "");
      const content = document.getElementById(targetId);
      const icon = button.querySelector("[data-accordion-icon]");

      if (!content || !icon) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", !isExpanded);
      content.classList.toggle("hidden");
      icon.classList.toggle("rotate-179");
    });
  });

  // ==================== Popup ====================
  (function () {
    const popup = document.getElementById("newsletter-popup");
    const closeBtns = document.querySelectorAll(".js-popup-close");
    const form = document.getElementById("newsletter-form");
    const successMessage = document.getElementById("success-message");

    if (!popup) return;

    let popupTimer;
    const SHOW_DELAY = 5000; // 5 seconds

    function init() {
      setupEventListeners();
      startPopupTimer();
    }

    function setupEventListeners() {
      // Close when clicking outside content
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          closePopup();
        }
      });

      // Close buttons
      closeBtns.forEach((btn) => {
        btn.addEventListener("click", closePopup);
      });

      // Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !popup.classList.contains("hidden")) {
          closePopup();
        }
      });

      // Form submission
      if (form) {
        form.addEventListener("submit", handleSubmit);
      }
    }

    function startPopupTimer() {
      popupTimer = setTimeout(() => {
        popup.classList.remove("hidden");
        // Focus on email input
        setTimeout(() => form.querySelector("input")?.focus(), 100);
      }, SHOW_DELAY);
    }

    function closePopup() {
      popup.classList.add("hidden");
      clearTimeout(popupTimer);
      if (form) form.reset();
      if (successMessage) successMessage.classList.add("hidden");
      if (form) form.classList.remove("hidden");
    }

    function handleSubmit(e) {
      e.preventDefault();
      if (form.checkValidity()) {
        // Show success message
        if (successMessage) successMessage.classList.remove("hidden");
        if (form) form.classList.add("hidden");

        // Auto-close after 3 seconds
        setTimeout(closePopup, 3000);
      }
    }

    init();
  })();

  //preloader
  const preloader = document.getElementById("preloader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => preloader.remove(), 1000);
    }, 1500);
  });

  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.remove();
  }, 2000);
});

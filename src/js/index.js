document.addEventListener("DOMContentLoaded", function () {
  // ==================== Mobile Menu Toggle ====================
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ==================== Video Modal Functionality ====================
  const videoModal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const videoContainer = document.getElementById("videoContainer");

  function handleVideoOpen() {
    document.querySelectorAll(".open-video-btn").forEach((button) => {
      button.addEventListener("click", () => {
        if (!videoModal || !videoPlayer || !videoContainer) return;

        const videoSrc = button.dataset.videoSrc;
        const videoType = button.dataset.videoType;

        // Set video source
        videoPlayer.src = videoSrc;

        // Reset container classes
        videoContainer.className = "rounded-xl overflow-hidden bg-black";
        const containerParent = videoContainer.parentElement;

        // Handle different video types
        if (videoType === "short") {
          videoContainer.classList.add("aspect-portrait");
          containerParent.classList.add("video-container-mobile");

          // Mobile height adjustment
          if (window.matchMedia("(max-width: 640px)").matches) {
            videoContainer.style.maxHeight = "calc(90vh - 40px)";
          }
        } else {
          videoContainer.classList.add("aspect-video");
          containerParent.classList.remove("video-container-mobile");
          videoContainer.style.maxHeight = "";
        }

        // Show modal
        videoModal.classList.remove("hidden");
        videoModal.classList.add("modal-enter-active");

        // Play video with error handling
        videoPlayer.play().catch((error) => {
          console.error("Video playback failed:", error);
        });
      });
    });
  }

  function handleVideoClose() {
    const closeModal = () => {
      if (!videoModal || !videoPlayer) return;
      videoModal.classList.remove("modal-enter-active");
      videoModal.classList.add("hidden");
      videoPlayer.pause();
      videoPlayer.currentTime = 0;

      // Reset container styles
      videoContainer.className = "bg-black rounded-b-xl";
      videoContainer.style.maxHeight = "";
      videoContainer.parentElement.classList.remove("video-container-mobile");
    };

    document
      .getElementById("closeModalBtn")
      ?.addEventListener("click", closeModal);
    document
      .getElementById("modalOverlay")
      ?.addEventListener("click", closeModal);
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeModal()
    );

    // Reset video on modal close
    videoModal.addEventListener("transitionend", (e) => {
      if (videoModal.classList.contains("hidden")) {
        videoPlayer.src = "";
      }
    });
  }

  handleVideoOpen();
  handleVideoClose();

  // ==================== Tab Functionality ====================
  function initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.dataset.tab;

        // Update buttons
        tabButtons.forEach((btn) => {
          btn.classList.remove("bg-softwhite", "text-pastelpink");
          btn.classList.add("hover:bg-softwhite", "text-middark");
        });
        button.classList.add("bg-softwhite", "text-pastelpink");
        button.classList.remove("hover:bg-softwhite", "text-middark");

        // Update contents
        tabContents.forEach((content) => content.classList.add("hidden"));
        document
          .querySelector(`[data-content="${tabId}"]`)
          ?.classList.remove("hidden");
      });
    });

    // Activate first tab
    tabButtons[0]?.click();
  }
  initializeTabs();

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

  // Newsletter Popup Module
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

  // Smooth scroll to top
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  const progressCircle = document.getElementById("progressCircle");
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  // Initialize stroke properties
  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = circumference;

  // Update progress on scroll
  function updateProgress() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight - windowHeight;
    let progress = scrollY / totalHeight;

    // Ensure progress reaches 1 at bottom
    if (
      window.scrollY + windowHeight >=
      document.documentElement.scrollHeight
    ) {
      progress = 1;
    }

    const offset = circumference - progress * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  // Show/hide button
  function toggleButtonVisibility() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove("opacity-0", "invisible", "scale-90");
      scrollToTopBtn.classList.add("opacity-100", "visible", "scale-100");
    } else {
      scrollToTopBtn.classList.add("opacity-0", "invisible", "scale-90");
      scrollToTopBtn.classList.remove("opacity-100", "visible", "scale-100");
    }
  }

  window.addEventListener("scroll", () => {
    updateProgress();
    toggleButtonVisibility();
  });

  // Smooth scroll to top
  scrollToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Initialize
  updateProgress();
  toggleButtonVisibility();

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

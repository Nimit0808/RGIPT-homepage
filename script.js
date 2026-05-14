document.addEventListener("DOMContentLoaded", () => {
  // --- TopBar Clock ---
  const timeElement = document.getElementById("topbar-time");
  if (timeElement) {
    const updateTime = () => {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      let hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      timeElement.textContent = `${dayName}, ${dayNum}, ${monthName} ${year} | ${hours}:${mins}:${secs} ${ampm}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Navbar Scroll Effect removed since navbar is permanently sticky and solid

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      if (mobileMenu.classList.contains("hidden")) {
        menuIcon.style.display = "block";
        closeIcon.style.display = "none";
      } else {
        menuIcon.style.display = "none";
        closeIcon.style.display = "block";
      }
    });
  }

  // --- Unified Hero Slider ---
  const slides = document.querySelectorAll(".hs-slide");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const dots = document.querySelectorAll(".slider-dot");
  const videoElement = document.getElementById("hero-video-element");
  
  if (slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoAdvanceTimeout;

    if (videoElement) {
      const randomClip = Math.floor(Math.random() * 3) + 1;
      videoElement.src = `clip${randomClip}.mp4`;
      videoElement.load();
    }

    const resetTimer = () => {
      clearTimeout(autoAdvanceTimeout);
    };

    const triggerNext = () => {
      goToSlide((currentSlide + 1) % totalSlides);
    };

    const startTimerForSlide = (index) => {
      resetTimer();
      if (index === 0 && videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(e => console.warn("Video auto-play prevented"));
      } else {
        if (videoElement) videoElement.pause();
        autoAdvanceTimeout = setTimeout(triggerNext, 5000);
      }
    };

    if (videoElement) {
      videoElement.addEventListener("ended", triggerNext);
    }

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove("active");
      dots[currentSlide].classList.remove("active");
      
      currentSlide = index;
      
      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");

      startTimerForSlide(currentSlide);
    };

    const nextSlide = () => goToSlide((currentSlide + 1) % totalSlides);
    const prevSlide = () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides);

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });

    startTimerForSlide(0);
  }

  // --- Numbers Counter ---
  const statValues = document.querySelectorAll(".stat-value");
  const numbersSection = document.getElementById("numbers-section");

  if (numbersSection && statValues.length > 0) {
    let triggered = false;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounters = () => {
      if (triggered) return;
      triggered = true;

      statValues.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const current = Math.floor(target * easeOutCubic(p));
          el.textContent = current.toLocaleString() + suffix;
          if (p < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target.toLocaleString() + suffix;
          }
        };
        requestAnimationFrame(tick);
      });
    };

    const statObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animateCounters();
      },
      { threshold: 0.3 }
    );
    statObserver.observe(numbersSection);
  }

  // --- Admissions Countdown Timer ---
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-mins");
  const secsEl = document.getElementById("countdown-secs");

  if (daysEl && hoursEl && minsEl && secsEl) {
    const targetDate = new Date("2026-07-31T23:59:59").getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff / 3600000) % 24);
      const mins = Math.floor((diff / 60000) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(mins).padStart(2, "0");
      secsEl.textContent = String(secs).padStart(2, "0");
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});

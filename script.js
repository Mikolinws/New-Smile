document.addEventListener("DOMContentLoaded", () => {

    // MOBILE MENU
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");

            menuToggle.innerHTML = nav.classList.contains("active")
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }


    // CLINIC PHOTO SLIDER
    const clinicSlider = document.querySelector("[data-slider]");

    if (clinicSlider) {
        const track = clinicSlider.querySelector(".slider-track");
        const slides = clinicSlider.querySelectorAll(".clinic-slide");
        const prev = clinicSlider.querySelector(".prev");
        const next = clinicSlider.querySelector(".next");
        const counter = clinicSlider.querySelector(".current-slide");

        let index = 0;

        function updateClinicSlider() {
            track.style.transform = `translateX(-${index * 100}%)`;
            counter.textContent = String(index + 1).padStart(2, "0");

            prev.disabled = index === 0;
            next.disabled = index === slides.length - 1;

            prev.style.opacity = index === 0 ? ".4" : "1";
            next.style.opacity = index === slides.length - 1 ? ".4" : "1";
        }

        prev.addEventListener("click", () => {
            if (index > 0) {
                index--;
                updateClinicSlider();
            }
        });

        next.addEventListener("click", () => {
            if (index < slides.length - 1) {
                index++;
                updateClinicSlider();
            }
        });

        addSwipe(clinicSlider, () => {
            if (index < slides.length - 1) {
                index++;
                updateClinicSlider();
            }
        }, () => {
            if (index > 0) {
                index--;
                updateClinicSlider();
            }
        });

        updateClinicSlider();
    }


    // BEFORE / AFTER SLIDER
    const baTrack = document.getElementById("baTrack");
    const baPrev = document.getElementById("baPrev");
    const baNext = document.getElementById("baNext");
    const baPagination = document.getElementById("baPagination");

    if (baTrack) {
        const baSlides = baTrack.querySelectorAll(".ba-slide");
        const dots = baPagination.querySelectorAll("span");

        let baIndex = 0;

        function updateBeforeAfter() {
            baTrack.style.transform = `translateX(-${baIndex * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === baIndex);
            });

            baPrev.disabled = baIndex === 0;
            baNext.disabled = baIndex === baSlides.length - 1;

            baPrev.style.opacity = baIndex === 0 ? ".4" : "1";
            baNext.style.opacity = baIndex === baSlides.length - 1 ? ".4" : "1";
        }

        baPrev.addEventListener("click", () => {
            if (baIndex > 0) {
                baIndex--;
                updateBeforeAfter();
            }
        });

        baNext.addEventListener("click", () => {
            if (baIndex < baSlides.length - 1) {
                baIndex++;
                updateBeforeAfter();
            }
        });

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                baIndex = i;
                updateBeforeAfter();
            });
        });

        addSwipe(
            baTrack.parentElement,
            () => {
                if (baIndex < baSlides.length - 1) {
                    baIndex++;
                    updateBeforeAfter();
                }
            },
            () => {
                if (baIndex > 0) {
                    baIndex--;
                    updateBeforeAfter();
                }
            }
        );

        updateBeforeAfter();
    }


    // REVIEWS SLIDER
    const reviewsTrack = document.getElementById("reviewsTrack");
    const reviewPrev = document.getElementById("reviewPrev");
    const reviewNext = document.getElementById("reviewNext");
    const reviewCurrent = document.getElementById("reviewCurrent");

    if (reviewsTrack) {
        const reviewCards = reviewsTrack.querySelectorAll(".review-card");

        let reviewIndex = 0;

        function getVisibleReviews() {
            if (window.innerWidth <= 550) return 1;
            if (window.innerWidth <= 1050) return 2;
            return 3;
        }

        function getMaxReviewIndex() {
            return Math.max(0, reviewCards.length - getVisibleReviews());
        }

        function updateReviews() {
            const card = reviewCards[0];
            const gap = parseFloat(getComputedStyle(reviewsTrack).gap) || 0;

            const cardWidth = card.getBoundingClientRect().width;
            const offset = reviewIndex * (cardWidth + gap);

            reviewsTrack.style.transform = `translateX(-${offset}px)`;

            reviewCurrent.textContent = String(reviewIndex + 1).padStart(2, "0");

            reviewPrev.disabled = reviewIndex === 0;
            reviewNext.disabled = reviewIndex >= getMaxReviewIndex();

            reviewPrev.style.opacity = reviewIndex === 0 ? ".4" : "1";
            reviewNext.style.opacity =
                reviewIndex >= getMaxReviewIndex() ? ".4" : "1";
        }

        reviewPrev.addEventListener("click", () => {
            if (reviewIndex > 0) {
                reviewIndex--;
                updateReviews();
            }
        });

        reviewNext.addEventListener("click", () => {
            if (reviewIndex < getMaxReviewIndex()) {
                reviewIndex++;
                updateReviews();
            }
        });

        addSwipe(
            reviewsTrack.parentElement,
            () => {
                if (reviewIndex < getMaxReviewIndex()) {
                    reviewIndex++;
                    updateReviews();
                }
            },
            () => {
                if (reviewIndex > 0) {
                    reviewIndex--;
                    updateReviews();
                }
            }
        );

        window.addEventListener("resize", () => {
            reviewIndex = Math.min(reviewIndex, getMaxReviewIndex());
            updateReviews();
        });

        updateReviews();
    }


    // TOUCH / SWIPE SUPPORT
    function addSwipe(element, onLeft, onRight) {
        let startX = 0;
        let startY = 0;

        element.addEventListener("touchstart", event => {
            startX = event.changedTouches[0].screenX;
            startY = event.changedTouches[0].screenY;
        }, { passive: true });

        element.addEventListener("touchend", event => {
            const endX = event.changedTouches[0].screenX;
            const endY = event.changedTouches[0].screenY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    onLeft();
                } else {
                    onRight();
                }
            }
        }, { passive: true });
    }


    // SMOOTH ANCHOR SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(event) {
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

});
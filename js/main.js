(function () {
  const track = document.getElementById("projectsTrack");
  const prev = document.getElementById("projectsPrev");
  const next = document.getElementById("projectsNext");
  const dotsContainer = document.querySelector(".projects__dots");

  if (track && prev && next) {
    const cards = Array.from(track.querySelectorAll(".project-card"));
    let dots = [];

    const getGap = () => {
      const styles = getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap) || 16;
    };

    const getActiveIndex = () => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      return activeIndex;
    };

    const scrollToIndex = (index) => {
      const card = cards[index];
      if (!card) return;

      const targetLeft =
        card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;

      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
    };

    const updateDots = () => {
      const activeIndex = getActiveIndex();
      dots.forEach((dot, index) => {
        dot.classList.toggle("projects__dot--active", index === activeIndex);
        dot.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
      });
    };

    const buildDots = () => {
      if (!dotsContainer) return;

      dotsContainer.innerHTML = "";
      dots = cards.map((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "projects__dot";
        dot.setAttribute("aria-label", `Слайд ${index + 1}`);
        dot.setAttribute("role", "tab");
        dot.addEventListener("click", () => scrollToIndex(index));
        dotsContainer.appendChild(dot);
        return dot;
      });

      if (dots[0]) {
        dots[0].classList.add("projects__dot--active");
        dots[0].setAttribute("aria-selected", "true");
      }
    };

    buildDots();

    prev.addEventListener("click", () => {
      const index = getActiveIndex();
      scrollToIndex(Math.max(0, index - 1));
    });

    next.addEventListener("click", () => {
      const index = getActiveIndex();
      scrollToIndex(Math.min(cards.length - 1, index + 1));
    });

    let scrollTimer;
    track.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(updateDots, 80);
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      scrollToIndex(getActiveIndex());
      updateDots();
    });
  }

  document.querySelectorAll(".tabs__item").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tabs__item")
        .forEach((t) => t.classList.remove("tabs__item--active"));
      tab.classList.add("tabs__item--active");
    });
  });

  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const backdrop = document.getElementById("mobileNavBackdrop");

  const closeMenu = () => {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
    document.body.classList.add("menu-open");
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      if (mobileNav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop?.addEventListener("click", closeMenu);

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  document.querySelectorAll(".catalog-nav__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".catalog-nav__item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  const sidebarToggle = document.getElementById("catalogSidebarToggle");
  const sidebar = document.getElementById("catalogSidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("is-open");
      sidebarToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const formatPrice = (n) =>
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n);

  const cartPopover = document.getElementById("cartPopover");
  const cartPopoverList = document.getElementById("cartPopoverList");
  const cartPopoverEmpty = document.getElementById("cartPopoverEmpty");
  const cartPopoverTotal = document.getElementById("cartPopoverTotal");
  const cartTriggers = document.querySelectorAll("[data-cart-trigger]");

  const getPopoverCartItems = () =>
    cartPopoverList ? Array.from(cartPopoverList.querySelectorAll(".cart-item")) : [];

  const isPopoverCartEmpty = () => getPopoverCartItems().length === 0;

  const updatePopoverCartLine = (item) => {
    const unit = parseInt(item.getAttribute("data-unit-price") || "0", 10);
    const valueEl = item.querySelector("[data-qty-value]");
    const totalEl = item.querySelector("[data-line-total]");
    if (!valueEl || !totalEl) return 0;

    const qty = parseInt(valueEl.textContent, 10) || 1;
    const lineTotal = unit * qty;
    totalEl.textContent = formatPrice(lineTotal);
    return lineTotal;
  };

  const updatePopoverCartTotals = () => {
    if (!cartPopover) return;

    let grand = 0;
    getPopoverCartItems().forEach((item) => {
      grand += updatePopoverCartLine(item);
    });

    if (cartPopoverTotal) {
      cartPopoverTotal.textContent = formatPrice(grand);
    }

    const empty = isPopoverCartEmpty();
    cartPopover.classList.toggle("is-empty", empty);
    if (cartPopoverEmpty) {
      cartPopoverEmpty.hidden = !empty;
    }
  };

  const setCartPopoverOpen = (open) => {
    if (!cartPopover) return;

    cartPopover.classList.toggle("is-open", open);
    cartTriggers.forEach((btn) => {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  };

  if (cartPopover && cartTriggers.length) {
    updatePopoverCartTotals();

    cartTriggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (isPopoverCartEmpty()) {
          window.location.href = btn.getAttribute("href") || "cart.html";
          return;
        }

        e.preventDefault();
        setCartPopoverOpen(!cartPopover.classList.contains("is-open"));
      });
    });

    document.addEventListener("click", (e) => {
      if (
        cartPopover.classList.contains("is-open") &&
        !cartPopover.contains(e.target) &&
        !Array.from(cartTriggers).some((btn) => btn.contains(e.target))
      ) {
        setCartPopoverOpen(false);
      }
    });

    cartPopover.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-cart-item]");
      if (!removeBtn || !cartPopoverList) return;

      e.stopPropagation();

      const item = removeBtn.closest(".cart-item");
      if (!item) return;

      item.remove();
      updatePopoverCartTotals();
    });
  }

  document.querySelectorAll(".product-tabs__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      const panel = document.getElementById(`tab-${tabId}`);
      if (!panel) return;

      document.querySelectorAll(".product-tabs__btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".product-tabs__panel").forEach((p) => {
        p.classList.remove("is-active");
        p.hidden = true;
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      panel.classList.add("is-active");
      panel.hidden = false;
    });
  });

  const galleryMain = document.getElementById("productGalleryMain");
  document.querySelectorAll(".product-gallery__thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const src = thumb.getAttribute("data-image");
      if (!src || !galleryMain) return;

      galleryMain.src = src;
      document.querySelectorAll(".product-gallery__thumb").forEach((t) => {
        t.classList.toggle("is-active", t === thumb);
      });
    });
  });

  const updateCheckoutTotals = () => {
    const grandEl = document.getElementById("cartGrandTotal");
    if (!grandEl) return;

    let grand = 0;
    document.querySelectorAll(".cart-line").forEach((line) => {
      const unit = parseInt(line.getAttribute("data-unit-price") || "0", 10);
      const valueEl = line.querySelector("[data-qty-value]");
      const totalEl = line.querySelector("[data-line-total]");
      if (!valueEl || !totalEl) return;

      const qty = parseInt(valueEl.textContent, 10) || 1;
      const lineTotal = unit * qty;
      totalEl.textContent = formatPrice(lineTotal);
      grand += lineTotal;
    });

    grandEl.textContent = formatPrice(grand);
  };

  document.querySelectorAll(".cart-item__qty").forEach((wrap) => {
    const minus = wrap.querySelector("[data-qty-minus]");
    const plus = wrap.querySelector("[data-qty-plus]");
    const valueEl = wrap.querySelector("[data-qty-value]");
    if (!minus || !plus || !valueEl) return;

    const onChange = () => {
      const popoverItem = wrap.closest(".cart-item");
      if (popoverItem && cartPopoverList) {
        updatePopoverCartTotals();
      }
      if (document.getElementById("cartGrandTotal")) {
        updateCheckoutTotals();
      }
    };

    minus.addEventListener("click", () => {
      const n = Math.max(1, parseInt(valueEl.textContent, 10) - 1);
      valueEl.textContent = String(n);
      onChange();
    });
    plus.addEventListener("click", () => {
      const n = parseInt(valueEl.textContent, 10) + 1;
      valueEl.textContent = String(n);
      onChange();
    });
  });

  document.querySelectorAll("[data-remove-line]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const line = btn.closest(".cart-line");
      const list = document.getElementById("checkoutCartList");
      if (!line || !list) return;

      line.remove();
      if (!list.querySelector(".cart-line")) {
        const empty = document.createElement("p");
        empty.className = "checkout-cart__empty";
        empty.append(
          document.createTextNode("Корзина пуста. Перейдите в каталог, чтобы добавить товары, или "),
        );
        const homeLink = document.createElement("a");
        homeLink.href = "index.html";
        homeLink.textContent = "вернуться на главную";
        empty.appendChild(homeLink);
        empty.appendChild(document.createTextNode("."));
        list.appendChild(empty);
        const grandEl = document.getElementById("cartGrandTotal");
        if (grandEl) grandEl.textContent = "0";
      } else {
        updateCheckoutTotals();
      }
    });
  });

  if (document.getElementById("cartGrandTotal")) {
    updateCheckoutTotals();
  }

  const projectsFilters = document.getElementById("projectsFilters");
  const projectsGrid = document.getElementById("projectsGrid");

  const certLightbox = document.getElementById("certLightbox");
  const certLightboxImg = document.getElementById("certLightboxImg");
  const certLightboxCaption = document.getElementById("certLightboxCaption");
  const certLightboxViewport = document.getElementById("certLightboxViewport");
  const certLightboxOpen = document.getElementById("certLightboxOpen");
  const certZoomIn = document.getElementById("certZoomIn");
  const certZoomOut = document.getElementById("certZoomOut");
  const certZoomFit = document.getElementById("certZoomFit");
  const certZoomValue = document.getElementById("certZoomValue");

  if (certLightbox && certLightboxImg && certLightboxCaption && certLightboxViewport) {
    let lastCertTrigger = null;
    let certZoom = 1;
    const CERT_ZOOM_MIN = 0.5;
    const CERT_ZOOM_MAX = 4;
    const CERT_ZOOM_STEP = 0.25;

    const updateCertZoomLabel = () => {
      if (certZoomValue) {
        certZoomValue.textContent = `${Math.round(certZoom * 100)}%`;
      }
    };

    const applyCertZoom = () => {
      if (!certLightboxImg.naturalWidth) return;
      certLightboxImg.style.width = `${Math.round(certLightboxImg.naturalWidth * certZoom)}px`;
      updateCertZoomLabel();
    };

    const fitCertToWidth = () => {
      if (!certLightboxImg.naturalWidth) return;
      const available = certLightboxViewport.clientWidth - 32;
      certZoom = Math.min(CERT_ZOOM_MAX, Math.max(CERT_ZOOM_MIN, available / certLightboxImg.naturalWidth));
      applyCertZoom();
      certLightboxViewport.scrollTop = 0;
      certLightboxViewport.scrollLeft = 0;
    };

    const changeCertZoom = (delta) => {
      certZoom = Math.min(CERT_ZOOM_MAX, Math.max(CERT_ZOOM_MIN, certZoom + delta));
      applyCertZoom();
    };

    const closeCertLightbox = () => {
      certLightbox.classList.remove("is-open");
      certLightbox.hidden = true;
      certLightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      certLightboxImg.removeAttribute("src");
      certLightboxImg.style.width = "";
      certZoom = 1;
      updateCertZoomLabel();
      if (lastCertTrigger) {
        lastCertTrigger.focus();
        lastCertTrigger = null;
      }
    };

    const openCertLightbox = (src, alt, trigger) => {
      lastCertTrigger = trigger;
      certLightboxCaption.textContent = alt;
      if (certLightboxOpen) {
        certLightboxOpen.href = src;
      }
      certLightbox.hidden = false;
      certLightbox.classList.add("is-open");
      certLightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      certLightboxImg.onload = () => {
        fitCertToWidth();
      };
      certLightboxImg.src = src;
      certLightboxImg.alt = alt;

      if (certLightboxImg.complete && certLightboxImg.naturalWidth) {
        fitCertToWidth();
      }

      certLightbox.querySelector(".cert-lightbox__close")?.focus();
    };

    document.querySelectorAll(".certificates__grid .cert-item__img-wrap").forEach((btn) => {
      btn.addEventListener("click", () => {
        const img = btn.querySelector(".cert-item__img");
        if (!img?.src) return;
        openCertLightbox(img.src, img.alt || "", btn);
      });
    });

    certZoomIn?.addEventListener("click", (e) => {
      e.stopPropagation();
      changeCertZoom(CERT_ZOOM_STEP);
    });

    certZoomOut?.addEventListener("click", (e) => {
      e.stopPropagation();
      changeCertZoom(-CERT_ZOOM_STEP);
    });

    certZoomFit?.addEventListener("click", (e) => {
      e.stopPropagation();
      fitCertToWidth();
    });

    certLightboxViewport.addEventListener("wheel", (e) => {
      if (!certLightbox.classList.contains("is-open") || !e.ctrlKey) return;
      e.preventDefault();
      changeCertZoom(e.deltaY < 0 ? CERT_ZOOM_STEP : -CERT_ZOOM_STEP);
    }, { passive: false });

    let dragStart = null;
    certLightboxViewport.addEventListener("pointerdown", (e) => {
      if (e.target === certLightboxImg) {
        dragStart = {
          x: e.clientX,
          y: e.clientY,
          scrollLeft: certLightboxViewport.scrollLeft,
          scrollTop: certLightboxViewport.scrollTop,
        };
        certLightboxViewport.classList.add("is-dragging");
        certLightboxViewport.setPointerCapture(e.pointerId);
      }
    });

    certLightboxViewport.addEventListener("pointermove", (e) => {
      if (!dragStart) return;
      certLightboxViewport.scrollLeft = dragStart.scrollLeft - (e.clientX - dragStart.x);
      certLightboxViewport.scrollTop = dragStart.scrollTop - (e.clientY - dragStart.y);
    });

    const endDrag = (e) => {
      if (!dragStart) return;
      dragStart = null;
      certLightboxViewport.classList.remove("is-dragging");
      if (e.pointerId !== undefined) {
        try {
          certLightboxViewport.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* ignore */
        }
      }
    };

    certLightboxViewport.addEventListener("pointerup", endDrag);
    certLightboxViewport.addEventListener("pointercancel", endDrag);

    certLightbox.querySelectorAll("[data-cert-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeCertLightbox);
    });

    document.addEventListener("keydown", (e) => {
      if (!certLightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        closeCertLightbox();
      } else if (e.key === "+" || e.key === "=") {
        changeCertZoom(CERT_ZOOM_STEP);
      } else if (e.key === "-") {
        changeCertZoom(-CERT_ZOOM_STEP);
      }
    });

    window.addEventListener("resize", () => {
      if (certLightbox.classList.contains("is-open") && certLightboxImg.naturalWidth) {
        fitCertToWidth();
      }
    });
  }

  if (projectsFilters && projectsGrid) {
    const cards = Array.from(projectsGrid.querySelectorAll(".projects-grid__card"));
    const filterBtns = projectsFilters.querySelectorAll("[data-filter]");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterBtns.forEach((b) => b.classList.remove("tabs__item--active"));
        btn.classList.add("tabs__item--active");

        cards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const show = filter === "all" || category === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }
})();

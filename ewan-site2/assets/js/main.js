(function () {
  "use strict";

  // Navbar scroll shadow
  var nav = document.getElementById("mainNav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Back to top
  var backToTop = document.getElementById("backToTop");
  function onScrollTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
  document.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Menu category filter (menu.html)
  var filterButtons = document.querySelectorAll("[data-menu-filter]");
  var menuGroups = document.querySelectorAll("[data-menu-group]");
  if (filterButtons.length && menuGroups.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-menu-filter");
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        menuGroups.forEach(function (group) {
          if (target === "all" || group.getAttribute("data-menu-group") === target) {
            group.classList.remove("d-none");
          } else {
            group.classList.add("d-none");
          }
        });
      });
    });
  }

  // Gallery filter (gallery.html)
  var galFilterButtons = document.querySelectorAll("[data-gallery-filter]");
  var galItems = document.querySelectorAll("[data-gallery-item]");
  if (galFilterButtons.length && galItems.length) {
    galFilterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-gallery-filter");
        galFilterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        galItems.forEach(function (item) {
          var cats = (item.getAttribute("data-gallery-item") || "").split(" ");
          if (target === "all" || cats.indexOf(target) !== -1) {
            item.closest(".gallery-col").classList.remove("d-none");
          } else {
            item.closest(".gallery-col").classList.add("d-none");
          }
        });
      });
    });
  }

  // Gallery lightbox
  var lightboxModalEl = document.getElementById("lightboxModal");
  if (lightboxModalEl && window.bootstrap) {
    var lightboxImg = document.getElementById("lightboxImg");
    var lightboxModal = new bootstrap.Modal(lightboxModalEl);
    document.querySelectorAll("[data-lightbox]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        lightboxImg.src = link.getAttribute("data-img");
        lightboxImg.alt = link.querySelector("img") ? link.querySelector("img").alt : "";
        lightboxModal.show();
      });
    });
  }

  // Bootstrap form validation styling (forms without a dedicated AJAX handler)
  var forms = document.querySelectorAll(".needs-validation:not(#contactForm)");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        form.classList.add("was-submitted-success");
      }
      form.classList.add("was-validated");
    }, false);
  });

  // Contact form — AJAX submit to php/contact-form.php
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var alertBox = document.getElementById("contactFormAlert");
    var submitBtn = contactForm.querySelector("button[type=submit]");
    var btnLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    var spinner = submitBtn ? submitBtn.querySelector(".spinner-border") : null;

    function showAlert(type, message) {
      if (!alertBox) return;
      alertBox.innerHTML =
        '<div class="alert alert-' + type + ' d-flex align-items-center gap-2 mb-0" role="alert">' +
        '<i class="bi ' + (type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill") + '"></i>' +
        '<span>' + message + "</span></div>";
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      if (spinner) spinner.classList.toggle("d-none", !isLoading);
      if (btnLabel) btnLabel.textContent = isLoading ? "Sending…" : "Send Message";
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        return;
      }

      setLoading(true);
      if (alertBox) alertBox.innerHTML = "";

      fetch(contactForm.getAttribute("action"), {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
        .then(function (res) {
          return res.json().catch(function () {
            throw new Error("Unexpected response from server.");
          });
        })
        .then(function (data) {
          showAlert(data.success ? "success" : "danger", data.message);
          if (data.success) {
            contactForm.reset();
            contactForm.classList.remove("was-validated");
          }
        })
        .catch(function () {
          showAlert(
            "danger",
            "Sorry, we couldn't reach the server. Please try again, or email us directly at hello@brocelecafe.com."
          );
        })
        .finally(function () {
          setLoading(false);
        });
    });
  }
})();

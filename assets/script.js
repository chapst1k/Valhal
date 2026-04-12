(function () {
  function markActiveLink() {
    const currentPath = window.location.pathname.replace(/index\.html$/, "");
    document.querySelectorAll(".menu__link").forEach((link) => {
      const href = (link.getAttribute("href") || "").replace(/index\.html$/, "");
      if (!href.startsWith("/")) return;

      if (currentPath === href || (href !== "/" && currentPath.startsWith(href))) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setupNav() {
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".has-dropdown .menu__trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parent = btn.closest(".has-dropdown");
        if (!parent) return;

        const isMobile = window.matchMedia("(max-width: 760px)").matches;
        if (!isMobile) return;

        const open = parent.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function setupPrintButtons() {
    document.querySelectorAll("[data-print]").forEach((btn) => {
      btn.addEventListener("click", () => window.print());
    });
  }

  function setupYear() {
    document.querySelectorAll("#y").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function setupTOC(aside) {
    if (!aside) return;

    let heading = aside.querySelector("h4");
    if (!heading) {
      heading = document.createElement("h4");
      heading.textContent = "On this page";
      aside.prepend(heading);
    }

    let body = aside.querySelector(".toc-body");
    if (!body) {
      body = document.createElement("div");
      body.className = "toc-body";
      const nodes = Array.from(aside.childNodes).filter((node) => node !== heading);
      nodes.forEach((node) => body.appendChild(node));
      aside.appendChild(body);
    }

    let toggle = aside.querySelector(".toc-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "toc-toggle";
      toggle.innerHTML = '<span>Table of contents</span><span aria-hidden="true">▾</span>';
      toggle.setAttribute("aria-expanded", "false");
      aside.prepend(toggle);
      heading.style.display = "none";
    }

    function setExpanded(expanded) {
      aside.classList.toggle("expanded", expanded);
      toggle.setAttribute("aria-expanded", String(expanded));
      body.style.maxHeight = expanded ? `${body.scrollHeight}px` : "0px";
      body.style.opacity = expanded ? "1" : "0";
    }

    function applyState() {
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      if (mobile) {
        setExpanded(false);
      } else {
        aside.classList.add("expanded");
        toggle.setAttribute("aria-expanded", "true");
        body.style.maxHeight = "none";
        body.style.opacity = "1";
      }
    }

    toggle.addEventListener("click", () => {
      const willExpand = !aside.classList.contains("expanded");
      setExpanded(willExpand);
    });

    window.addEventListener("resize", applyState);
    applyState();
  }

  function init() {
    markActiveLink();
    setupNav();
    setupPrintButtons();
    setupYear();
    document.querySelectorAll("aside.toc").forEach(setupTOC);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

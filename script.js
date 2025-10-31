const introPanel = document.getElementById("intro-panel");
const storesPanel = document.getElementById("stores-panel");
const modal = document.getElementById("store-modal");

function showPanel(panel) {
  [introPanel, storesPanel].forEach((section) => {
    section.classList.toggle("is-active", section === panel);
  });
}

function toggleModal(visible) {
  modal.classList.toggle("is-visible", visible);
  modal.setAttribute("aria-hidden", visible ? "false" : "true");
  if (visible) {
    const firstInput = modal.querySelector("input");
    window.setTimeout(() => firstInput && firstInput.focus(), 150);
  }
}

window.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.getAttribute("data-action");

  switch (action) {
    case "go-to-stores":
      showPanel(storesPanel);
      break;
    case "open-modal":
      toggleModal(true);
      break;
    case "close-modal":
      toggleModal(false);
      break;
    case "open-login":
      alert("Fluxo de login não implementado nesta demonstração.");
      break;
    default:
      break;
  }
});

modal.addEventListener("click", (event) => {
  if (event.target === modal.querySelector(".modal__overlay")) {
    toggleModal(false);
  }
});

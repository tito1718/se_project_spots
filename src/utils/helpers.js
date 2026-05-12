//CURRENT MODAL//

let currentModal = null;

//OPEN MODAL//

export function openModal(modal) {
  modal.classList.add("modal_is-opened");

  currentModal = modal;

  document.addEventListener("keydown", handleEscape);
}

//CLOSE MODAL//

export function closeModal(modal) {
  modal.classList.remove("modal_is-opened");

  currentModal = null;

  document.removeEventListener("keydown", handleEscape);
}

//ESCAPE//

function handleEscape(evt) {
  if (evt.key === "Escape" && currentModal) {
    closeModal(currentModal);
  }
}

//LOADING STATE//

export function setLoadingState(button, isLoading, defaultText, loadingText) {
  if (!button) return;

  button.textContent = isLoading ? loadingText : defaultText;
  button.disabled = isLoading;
}

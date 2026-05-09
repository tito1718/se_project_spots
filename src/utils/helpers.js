//OPEN MODAL//

export function openModal(modal) {
  modal.classList.add("modal_is-opened");

  document.addEventListener("keydown", handleEscape);
}

//CLOSE MODAL//

export function closeModal(modal) {
  modal.classList.remove("modal_is-opened");

  document.removeEventListener("keydown", handleEscape);
}

//ESCAPE//

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");

    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

//LOADING STATE//

export function setLoadingState(button, isLoading, defaultText, loadingText) {
  if (!button) return;

  button.textContent = isLoading ? loadingText : defaultText;

  button.disabled = isLoading;
}

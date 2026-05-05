//MODAL//

export function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

export function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

//LOADING//

export function setLoading(button, loading, defaultText, loadingText) {
  if (!button) return;

  button.textContent = loading ? loadingText : defaultText;
  button.disabled = loading;
}

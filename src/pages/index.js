import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { openModal, closeModal, setLoading } from "../utils/helpers.js";

import logoIcon from "../images/spots-images/logo-icon.svg";
import avatarDefault from "../images/spots-images/avatar.jpg";
import penIcon from "../images/spots-images/pen-icon.svg";
import plusIcon from "../images/spots-images/plus-icon.svg";
import penWhiteIcon from "../images/spots-images/penwhite.svg";

//API//

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "95e6328a-c5c5-4efa-b41d-e406591e5a9c",
    "Content-Type": "application/json",
  },
});

//STATE//

let currentUserId = null;
let cardToDelete = null;

//DOM//

const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editBtn = document.querySelector(".profile__edit-btn");
const addBtn = document.querySelector(".profile__add-btn");
const avatarBtn = document.querySelector(".profile__avatar-btn");

const editModal = document.querySelector("#edit-profile-modal");
const addModal = document.querySelector("#new-post-modal");
const avatarModal = document.querySelector("#edit-avatar-modal");
const previewModal = document.querySelector("#preview-modal");
const deleteModal = document.querySelector("#delete-modal");

const editForm = editModal.querySelector(".modal__form");
const addForm = addModal.querySelector(".modal__form");
const avatarForm = avatarModal.querySelector(".modal__form");
const deleteForm = document.querySelector("#delete-form");

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const previewImg = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

//ESC CLOSE//

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const opened = document.querySelector(".modal_is-opened");
    if (opened) closeModal(opened);
  }
});

//OVERLAY CLOSE//

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

//CLOSE BUTTONS//

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
});

//CARD//

function createCard(data) {
  const card = cardTemplate.cloneNode(true);

  const img = card.querySelector(".card__image");
  const title = card.querySelector(".card__title");
  const likeBtn = card.querySelector(".card__like-btn");
  const likeCount = card.querySelector(".card__like-count");
  const deleteBtn = card.querySelector(".card__delete-btn");

  const ownerId = typeof data.owner === "object" ? data.owner._id : data.owner;

  title.textContent = data.name;
  img.src = data.link;
  img.alt = data.name;

  //likes (local only)//
  let likes = 0;
  let liked = false;

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likes += liked ? 1 : -1;

    likeBtn.classList.toggle("card__like-btn_active", liked);
    likeCount.textContent = likes;
  });

  //delete//
  if (ownerId === currentUserId) {
    deleteBtn.addEventListener("click", () => {
      cardToDelete = { id: data._id, element: card };
      openModal(deleteModal);
    });
  } else {
    deleteBtn.remove();
  }

  //preview//
  img.addEventListener("click", () => {
    previewImg.src = data.link;
    previewImg.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return card;
}

//RENDER//

function renderCard(cardData) {
  cardsList.prepend(createCard(cardData));
}

//DELETE//

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cardToDelete) return;

  const btn = deleteForm.querySelector(".modal__submit-btn_type_delete");

  setLoading(btn, true, "Delete", "Deleting...");

  api
    .deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      cardToDelete = null;
      closeModal(deleteModal);
    })
    .finally(() => setLoading(btn, false, "Delete", "Deleting..."));
});

//BUTTONS//

editBtn.addEventListener("click", () => {
  editForm.querySelector("#profile_name-input").value = profileName.textContent;
  editForm.querySelector("#profile_description-input").value =
    profileDesc.textContent;

  resetValidation(
    editForm,
    [...editForm.querySelectorAll(".modal__input")],
    settings,
  );
  openModal(editModal);
});

addBtn.addEventListener("click", () => {
  addForm.reset();
  resetValidation(
    addForm,
    [...addForm.querySelectorAll(".modal__input")],
    settings,
  );
  openModal(addModal);
});

avatarBtn.addEventListener("click", () => {
  resetValidation(
    avatarForm,
    [...avatarForm.querySelectorAll(".modal__input")],
    settings,
  );
  openModal(avatarModal);
});

//FORMS//

//edit profile//
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = editForm.querySelector(".modal__submit-btn");

  setLoading(btn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editForm.querySelector("#profile_name-input").value,
      about: editForm.querySelector("#profile_description-input").value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDesc.textContent = data.about;
      closeModal(editModal);
    })
    .finally(() => setLoading(btn, false, "Save", "Saving..."));
});

//new post//
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = addForm.querySelector(".modal__submit-btn");

  setLoading(btn, true, "Save", "Creating...");

  api
    .addNewCard({
      name: addForm.querySelector("#caption-input").value,
      link: addForm.querySelector("#card-image-input").value,
    })
    .then((data) => {
      renderCard(data);
      addForm.reset();
      closeModal(addModal);
    })
    .finally(() => setLoading(btn, false, "Save", "Creating..."));
});

//avatar//
avatarForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = avatarForm.querySelector(".modal__submit-btn");

  setLoading(btn, true, "Save", "Updating...");

  api
    .editAvatar({
      avatar: avatarForm.querySelector("#profile-avatar-input").value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .finally(() => setLoading(btn, false, "Save", "Updating..."));
});

//INIT//

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".header__logo").src = logoIcon;
  profileAvatar.src = avatarDefault;

  document.querySelector(".profile__edit-btn img").src = penIcon;
  document.querySelector(".profile__add-btn img").src = plusIcon;
  document.querySelector(".profile__pencil-icon").src = penWhiteIcon;

  api.getAppInfo().then(([cards, user]) => {
    currentUserId = user._id;

    profileName.textContent = user.name;
    profileDesc.textContent = user.about;
    profileAvatar.src = user.avatar || avatarDefault;

    cards.forEach(renderCard);
  });
});

//VALIDATION//

enableValidation(settings);

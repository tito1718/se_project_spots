//IMPORTS//

import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
import logoIcon from "../images/spots-images/logo-icon.svg";
import avatarDefault from "../images/spots-images/avatar.jpg";
import penIcon from "../images/spots-images/pen-icon.svg";
import plusIcon from "../images/spots-images/plus-icon.svg";
import penWhiteIcon from "../images/spots-images/penwhite.svg";
import Api from "../utils/Api.js";
import { openModal, closeModal, setLoadingState } from "../utils/helpers.js";

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

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarImg = document.querySelector(".profile__avatar");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const avatarEditBtn = document.querySelector(".profile__avatar-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const previewModal = document.querySelector("#preview-modal");
const avatarModal = document.querySelector("#edit-avatar-modal");
const deleteModal = document.querySelector("#delete-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const newPostForm = newPostModal.querySelector(".modal__form");
const avatarForm = avatarModal.querySelector(".modal__form");
const deleteForm = document.querySelector("#delete-form");
const previewImageEl = previewModal.querySelector(".modal__image");
const captionEl = previewModal.querySelector(".modal__caption");
const deleteSubmitBtn = deleteForm.querySelector(
  ".modal__submit-btn_type_delete",
);
const cancelDeleteBtn = deleteForm.querySelector(
  ".modal__submit-btn_type_cancel",
);
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

//OVERLAY CLOSE//

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

//CARD//

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");
  const ownerId = typeof data.owner === "object" ? data.owner._id : data.owner;

  //CARD DATA//

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  //LIKES//

  const likes = Array.isArray(data.likes) ? data.likes : [];
  let isLiked = likes.some((user) => {
    return user._id === currentUserId;
  });
  likeCount.textContent = likes.length;
  if (isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  }
  likeBtn.addEventListener("click", () => {
    const apiCall = isLiked ? api.unlikeCard(data._id) : api.likeCard(data._id);

    apiCall
      .then((updatedCard) => {
        const updatedLikes = Array.isArray(updatedCard.likes)
          ? updatedCard.likes
          : [];
        isLiked = updatedLikes.some((user) => {
          return user._id === currentUserId;
        });
        likeCount.textContent = updatedLikes.length;
        likeBtn.classList.toggle("card__like-btn_active", isLiked);
      })
      .catch(console.error);
  });

  //DELETE//

  if (ownerId === currentUserId) {
    deleteBtn.addEventListener("click", () => {
      cardToDelete = {
        element: cardElement,
        id: data._id,
      };

      openModal(deleteModal);
    });
  } else {
    deleteBtn.remove();
  }

  //PREVIEW//

  cardImage.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    captionEl.textContent = data.name;
    openModal(previewModal);
  });
  return cardElement;
}

//RENDER//

function renderCard(cardData) {
  const cardElement = getCardElement(cardData);
  cardsList.prepend(cardElement);
}

//DELETE FORM//

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (!cardToDelete) return;
  setLoadingState(deleteSubmitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      closeModal(deleteModal);
      cardToDelete = null;
    })
    .catch(console.error)
    .finally(() => {
      setLoadingState(deleteSubmitBtn, false, "Delete", "Deleting...");
    });
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

//CLOSE BUTTONS//

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".modal"));
  });
});

//BUTTONS//

editProfileBtn.addEventListener("click", () => {
  const nameInput = editProfileForm.querySelector("#profile_name-input");
  const descriptionInput = editProfileForm.querySelector(
    "#profile_description-input",
  );
  nameInput.value = profileNameEl.textContent;
  descriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  newPostForm.reset();
  resetValidation(newPostForm, settings);
  openModal(newPostModal);
});

avatarEditBtn.addEventListener("click", () => {
  avatarForm.reset();
  resetValidation(avatarForm, settings);
  openModal(avatarModal);
});

//EDIT PROFILE//

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = editProfileForm.querySelector(".modal__submit-btn");
  setLoadingState(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editProfileForm.querySelector("#profile_name-input").value,
      about: editProfileForm.querySelector("#profile_description-input").value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setLoadingState(submitBtn, false, "Save", "Saving...");
    });
});

//NEW POST//

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = newPostForm.querySelector(".modal__submit-btn");
  setLoadingState(submitBtn, true, "Save", "Creating...");

  api
    .addNewCard({
      name: newPostForm.querySelector("#caption-input").value,
      link: newPostForm.querySelector("#card-image-input").value,
    })
    .then((cardData) => {
      renderCard(cardData);
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setLoadingState(submitBtn, false, "Save", "Creating...");
    });
});

//AVATAR//

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = avatarForm.querySelector(".modal__submit-btn");
  setLoadingState(submitBtn, true, "Save", "Updating...");

  api
    .editAvatar({
      avatar: avatarForm.querySelector("#profile-avatar-input").value,
    })
    .then((userData) => {
      profileAvatarImg.src = userData.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setLoadingState(submitBtn, false, "Save", "Updating...");
    });
});

//INIT//

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".header__logo").src = logoIcon;
  profileAvatarImg.src = avatarDefault;
  document.querySelector(".profile__edit-btn img").src = penIcon;
  document.querySelector(".profile__add-btn img").src = plusIcon;
  document.querySelector(".profile__pencil-icon").src = penWhiteIcon;

  api
    .getAppInfo()
    .then(([cards, user]) => {
      currentUserId = user._id;
      profileNameEl.textContent = user.name;
      profileDescriptionEl.textContent = user.about;
      profileAvatarImg.src = user.avatar || avatarDefault;
      cards.forEach((card) => {
        renderCard(card);
      });
    })
    .catch(console.error);
});

//VALIDATION//

enableValidation(settings);

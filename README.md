# Project 3: Spots

"Spots” is a modern, interactive image-sharing web application.

## Description of the site: Spots

Users will be able to add and remove photos, like photos from other users, and make minor adjustments to their profile.

### Tech Overview: Spots

#### Core

- HTML
- CSS (BEM methodology)
- JavaScript (ES6 Modules)

#### Tooling

- Webpack — bundling & dev server
- Babel — ES6 compatibility
- PostCSS — CSS processing

#### Architecture

- Figma
- Images
- Modular file structure
- Responsive design

#### User Profile

- Edit profile name and description
- Update avatar image via URL
- Data synced with remote API

#### Cards (Posts)

- Create new image posts
- Delete your own posts
- Preview images in a modal
- Dynamic rendering from API data

#### Likes System

- Like/unlike cards
- Local persistence using `localStorage`
- Like count updates instantly in UI

#### Modals & UX

- Open/close modals smoothly
- Close via:
  - Close button
  - Escape key
  - Clicking outside (overlay)
- Loading states ("Saving...", "Deleting...")

#### Form Validation

- Real-time input validation
- Error messaging per field
- Submit button state control
- Reset validation on modal open

**Images**

Images are been exported directly from Figma.

**HTML**

This markup language contains a body with a header, content with images, cards and a footer.

**CSS**

The styling sheet consist of blocks (card, cards, content, footer, header,modal, page and profile).

**Responsive design**

This project is meant to fit, respond and addapt to different screen sizes.

**Figma**

- [Link to the project on Figma](https://www.figma.com/file/BBNm2bC3lj8QQMHlnqRsga/Sprint-3-Project-%E2%80%94-Spots?type=design&node-id=2%3A60&mode=design&t=afgNFybdorZO6cQo-1)

##### Deployment

[Deployment link](https://tito1718.github.io/se_project_spots/)

###### Project Pitch Videos

Check out these videos, where I describe my project and some challenges I faced while building it:

- [Loom | Cesar Chirino | Project Pitch | Spots Stage 2 | 16 February 2026](https://drive.google.com/file/d/1BjCO97bqkg8_Ys9_1gIXQbi-gIEdz9Sl/view?usp=sharing)

- [Loom | Cesar Chirino | Project Pitch | Spots Stage 9 | 5 April 2026] (https://www.loom.com/share/5e626d7134af49cbb574b3efabe6e1f2)

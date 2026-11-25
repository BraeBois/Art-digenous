(function () {
  "use strict";

  const savedKey = "artDigenousSavedIds";
  let savedIds = [];
  let activeJewelryType = "All";

  try {
    const storedIds = JSON.parse(localStorage.getItem(savedKey) || "[]");
    if (Array.isArray(storedIds)) savedIds = storedIds.filter(Number.isInteger);
  } catch (error) {
    console.warn("Saved items are available only for this visit because browser storage could not be read.", error);
  }

  document.title = STARTUP.name + " — art with roots";
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = Array.from(document.querySelectorAll("[data-view]"));
    const current = views.some(function (view) { return view.id === requested; }) ? requested : "home";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });

    document.querySelectorAll(".site-header nav a").forEach(function (link) {
      if (link.hash === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
  }

  function createArtwork(item) {
    const artwork = document.createElement("div");
    artwork.className = "artwork artwork-" + item.visual;
    artwork.setAttribute("role", "img");
    artwork.setAttribute("aria-label", item.visualLabel);
    return artwork;
  }

  function updateSavedCount() {
    const savedCount = document.getElementById("saved-count");
    savedCount.textContent = savedIds.length
      ? "Saved on this device: " + savedIds.length + ". Saved items are private to this browser."
      : "Save a piece to keep track of it on this device.";
  }

  function makeListingCard(item) {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.appendChild(createArtwork(item));

    const details = document.createElement("div");
    details.className = "listing-details";

    const meta = document.createElement("div");
    meta.className = "listing-meta";
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.category === "Jewelry" ? item.jewelryType : "Artwork";
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = item.price;
    meta.append(tag, price);

    const title = document.createElement("h3");
    title.textContent = item.name;
    const description = document.createElement("p");
    description.className = "listing-description";
    description.textContent = item.description;

    const byline = document.createElement("p");
    byline.className = "listing-byline";
    byline.textContent = item.artist + " · " + item.location;

    const saveButton = document.createElement("button");
    const isSaved = savedIds.includes(item.id);
    saveButton.type = "button";
    saveButton.className = "save-button";
    saveButton.dataset.saveId = String(item.id);
    saveButton.setAttribute("aria-pressed", isSaved ? "true" : "false");
    saveButton.textContent = isSaved ? "Saved ✓" : "Save";
    saveButton.addEventListener("click", function () {
      toggleSaved(item.id);
    });

    details.append(meta, title, description, byline, saveButton);
    card.appendChild(details);
    return card;
  }

  function toggleSaved(id) {
    savedIds = savedIds.includes(id)
      ? savedIds.filter(function (savedId) { return savedId !== id; })
      : savedIds.concat(id);

    let storageUnavailable = false;
    try {
      localStorage.setItem(savedKey, JSON.stringify(savedIds));
    } catch (error) {
      storageUnavailable = true;
      console.warn("Saved items will be kept only until this page is closed because browser storage could not be written.", error);
    }

    renderListings();
    updateSavedCount();
    if (storageUnavailable) {
      document.getElementById("saved-count").textContent =
        "Saved for this visit only; browser storage is unavailable.";
    }
    const newButton = document.querySelector('[data-save-id="' + id + '"]');
    if (newButton) newButton.focus();
  }

  const grid = document.getElementById("listing-grid");
  const searchBox = document.getElementById("search-box");
  const categoryFilter = document.getElementById("category-filter");

  function renderListings() {
    const query = searchBox.value.trim().toLocaleLowerCase();
    const category = categoryFilter.value;
    const matches = LISTINGS.filter(function (item) {
      const searchable = [
        item.name, item.category, item.jewelryType || "", item.description,
        item.artist, item.location
      ].join(" ").toLocaleLowerCase();
      return (category === "all" || item.category === category) && searchable.includes(query);
    });

    grid.replaceChildren.apply(grid, matches.map(makeListingCard));
    document.getElementById("empty-message").hidden = matches.length > 0;
    document.getElementById("results-count").textContent =
      matches.length + (matches.length === 1 ? " piece" : " pieces");
    updateSavedCount();
  }

  function renderArtists() {
    const artistGrid = document.getElementById("artist-grid");
    artistGrid.replaceChildren.apply(artistGrid, ARTISTS.map(function (artist) {
      const card = document.createElement("article");
      card.className = "artist-card";
      const portrait = document.createElement("div");
      portrait.className = "artist-portrait portrait-" + artist.tone;
      portrait.setAttribute("aria-hidden", "true");
      portrait.textContent = artist.initials;

      const focus = document.createElement("span");
      focus.className = "tag";
      focus.textContent = artist.focus;
      const name = document.createElement("h2");
      name.textContent = artist.name;
      const location = document.createElement("p");
      location.className = "artist-location";
      location.textContent = artist.location;
      const bio = document.createElement("p");
      bio.textContent = artist.bio;
      card.append(portrait, focus, name, location, bio);
      return card;
    }));
  }

  function renderHome() {
    const latestGrid = document.getElementById("latest-grid");
    const newest = LISTINGS.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).slice(0, 3);
    latestGrid.replaceChildren.apply(latestGrid, newest.map(makeListingCard));
  }

  function renderJewelryFilters() {
    const filters = document.getElementById("jewelry-filters");
    filters.replaceChildren.apply(filters, JEWELRY_TYPES.map(function (type) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.textContent = type;
      button.setAttribute("aria-pressed", activeJewelryType === type ? "true" : "false");
      button.addEventListener("click", function () {
        activeJewelryType = type;
        renderJewelryFilters();
        renderJewelry();
        const selected = Array.from(filters.querySelectorAll("button")).find(function (chip) {
          return chip.textContent === type;
        });
        if (selected) selected.focus();
      });
      return button;
    }));
  }

  function renderJewelry() {
    const grid = document.getElementById("jewelry-grid");
    const items = LISTINGS.filter(function (item) {
      return item.category === "Jewelry" &&
        (activeJewelryType === "All" || item.jewelryType === activeJewelryType);
    });
    grid.replaceChildren.apply(grid, items.map(makeListingCard));
    document.getElementById("jewelry-empty").hidden = items.length > 0;
  }

  searchBox.addEventListener("input", renderListings);
  categoryFilter.addEventListener("change", renderListings);
  window.addEventListener("hashchange", showView);

  renderHome();
  renderListings();
  renderArtists();
  renderJewelryFilters();
  renderJewelry();
  showView();
})();

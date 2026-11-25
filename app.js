(function () {
  "use strict";

  let activeJewelryType = "All";

  document.title = STARTUP.name + " — art with roots";
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = Array.from(document.querySelectorAll("[data-view]"));
    const listingMatch = requested.match(/^listing-(\d+)$/);
    const selectedListing = listingMatch
      ? LISTINGS.find(function (item) { return item.id === Number(listingMatch[1]); })
      : null;
    const current = selectedListing
      ? "listing"
      : views.some(function (view) { return view.id === requested; }) ? requested : "home";

    if (selectedListing) renderListingDetail(selectedListing);

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
    if (selectedListing) document.getElementById("detail-title").focus();
  }

  function createArtwork(item) {
    const artwork = document.createElement("div");
    artwork.className = "artwork artwork-" + item.visual;
    artwork.setAttribute("role", "img");
    artwork.setAttribute("aria-label", item.visualLabel);
    return artwork;
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
    tag.textContent = item.category === "Jewelry" ? item.jewelryType : item.artworkType;
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

    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.className = "button view-button";
    viewButton.textContent = "View";
    viewButton.setAttribute("aria-label", "View " + item.name);
    viewButton.addEventListener("click", function () {
      window.location.hash = "listing-" + item.id;
    });

    details.append(meta, title, description, byline, viewButton);
    card.appendChild(details);
    return card;
  }

  function renderListingDetail(item) {
    const artist = ARTISTS.find(function (profile) {
      return profile.id === item.artistId;
    });

    document.getElementById("detail-artwork").replaceChildren(createArtwork(item));
    document.getElementById("detail-category").textContent =
      item.category === "Jewelry" ? item.jewelryType : "Artwork · " + item.artworkType;
    document.getElementById("detail-title").textContent = item.name;
    document.getElementById("detail-price").textContent = item.price;
    document.getElementById("detail-description").textContent = item.description;
    document.getElementById("detail-back").href = item.category === "Jewelry" ? "#jewelry" : "#artwork";

    const artistName = document.getElementById("detail-artist-name");
    const artistLocation = document.getElementById("detail-artist-location");
    const artistFocus = document.getElementById("detail-artist-focus");
    const artistBio = document.getElementById("detail-artist-bio");
    const artistPortrait = document.getElementById("detail-artist-portrait");

    if (!artist) {
      artistName.textContent = item.artist;
      artistLocation.textContent = item.location;
      artistFocus.textContent = "Artist profile unavailable";
      artistBio.textContent = "No fictional artist profile is available for this listing.";
      artistPortrait.className = "artist-portrait";
      artistPortrait.textContent = "";
      return;
    }

    artistName.textContent = artist.name;
    artistLocation.textContent = artist.location;
    artistFocus.textContent = artist.focus;
    artistBio.textContent = artist.bio;
    artistPortrait.className = "artist-portrait portrait-" + artist.tone;
    artistPortrait.textContent = artist.initials;
  }

  const grid = document.getElementById("listing-grid");
  const searchBox = document.getElementById("search-box");
  const categoryFilter = document.getElementById("category-filter");

  function renderListings() {
    const query = searchBox.value.trim().toLocaleLowerCase();
    const category = categoryFilter.value;
    const matches = LISTINGS.filter(function (item) {
      const searchable = [
        item.name, item.category, item.jewelryType || "", item.artworkType || "", item.description,
        item.artist, item.location
      ].join(" ").toLocaleLowerCase();
      return (category === "all" || item.category === category) && searchable.includes(query);
    });

    grid.replaceChildren.apply(grid, matches.map(makeListingCard));
    document.getElementById("empty-message").hidden = matches.length > 0;
    document.getElementById("results-count").textContent =
      matches.length + (matches.length === 1 ? " piece" : " pieces");
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

  function renderArtwork() {
    const grid = document.getElementById("artwork-grid");
    const items = LISTINGS.filter(function (item) {
      return item.category === "Art";
    });
    grid.replaceChildren.apply(grid, items.map(makeListingCard));
    document.getElementById("artwork-empty").hidden = items.length > 0;
  }

  function setupSupportTabs() {
    const tablist = document.querySelector('[aria-label="Support topics"]');
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

    function activate(tab, moveFocus) {
      tabs.forEach(function (item) {
        const selected = item === tab;
        item.setAttribute("aria-selected", selected ? "true" : "false");
        item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab, false);
      });
    });

    tablist.addEventListener("keydown", function (event) {
      const currentIndex = tabs.indexOf(document.activeElement);
      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        activate(tabs[nextIndex], true);
      }
    });
  }

  function setupArtistReferral() {
    const referralLink = document.getElementById("referral-link");
    const applicationUrl = new URL(window.location.href);
    applicationUrl.hash = "apply";
    referralLink.value = applicationUrl.href;

    const copyButton = document.getElementById("copy-referral-link");
    const status = document.getElementById("referral-status");
    copyButton.addEventListener("click", async function () {
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
          throw new Error("Clipboard access is unavailable.");
        }
        await navigator.clipboard.writeText(referralLink.value);
        status.textContent = "Invite link copied. Share it directly with an artist.";
      } catch (error) {
        referralLink.focus();
        referralLink.select();
        status.textContent = "Automatic copying is unavailable. The link is selected so you can copy it manually.";
      }
    });
  }

  searchBox.addEventListener("input", renderListings);
  categoryFilter.addEventListener("change", renderListings);
  window.addEventListener("hashchange", showView);

  setupSupportTabs();
  setupArtistReferral();
  renderHome();
  renderListings();
  renderArtists();
  renderJewelryFilters();
  renderJewelry();
  renderArtwork();
  showView();
})();

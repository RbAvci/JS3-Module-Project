const state = {
  shows: [],
  selectedShowId: "",
  episodes: [],
  showEpisodes: new Map(),
  searchTerm: "",
  searchViewTerm: "",
  selectedEpisodeId: "",
};

async function fetchAllShows() {
  return await fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch shows");
      }
      return response.json();
    })
    .then((data) => {
      state.shows = data;
      state.shows.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      renderShowView();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

async function fetchEpisodes() {
  const showId = state.selectedShowId;
  if (!state.showEpisodes.has(showId)) {
    await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => {
        // TODO
        if (!response.ok) {
          throw new Error("Failed to fetch episodes");
        }
        return response.json();
      })
      .then((data) => {
        state.showEpisodes.set(showId, data);
      })
      .catch((error) => {
        // TODO
        console.error(error);
        throw error;
      });
  }
  state.episodes = state.showEpisodes.get(showId);
  render();
}

function createEpisodeCard(episode) {
  const card = document.getElementById("episode-card").content.cloneNode(true);
  const title = card.querySelector("#episode-title");
  title.textContent = episode.name;
  title.setAttribute("href", episode.url);
  card.querySelector("#episode-code").textContent = episodeCode(
    episode.season,
    episode.number
  );
  const image = episode.image ?? "";
  card.querySelector("#episode-img").src = image.medium;
  card.querySelector("#episode-summary").innerHTML =
    episode.summary ?? "Summary not available";
  return card;
}

function episodeCode(season, number) {
  let s = season < 10 ? `0${season}` : season;
  let num = number < 10 ? `0${number}` : number;
  let code = `S${s}E${num}`;
  return code;
}

const searchBox = document.getElementById("search");
searchBox.addEventListener("input", handleSearchInput);

function handleSearchInput(event) {
  state.searchTerm = event.target.value;
  console.log(state.searchTerm);
  renderBySearch();
}

function createShowListItem(show) {
  const showListItem = document
    .getElementById("show-list")
    .content.cloneNode(true);
  const option = showListItem.querySelector("option");
  option.textContent = show.name;
  option.setAttribute("value", show.id);
  return showListItem;
}

function createEpisodeListItem(episode) {
  const episodeListItem = document
    .getElementById("episode-list")
    .content.cloneNode(true);
  const option = episodeListItem.querySelector("option");
  option.textContent = `${episodeCode(episode.season, episode.number)} - ${
    episode.name
  }`;
  option.setAttribute("value", episode.id);

  return episodeListItem;
}

function populateShowSelector(selector) {
  selector.textContent= "";
  const defaultOption = document.createElement("option");
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.innerHTML = "Select an option";
  selector.append(defaultOption);
  const shows = state.shows;
  for (const show of shows) {
    const showListItem = createShowListItem(show);
    selector.append(showListItem);
    if (show.id == state.selectedShowId) {
      selector.value = show.id;
    }
  }
}

function populateEpisodeSelector() {
  episodeSelector.textContent = "";
  const defaultOption = document.createElement("option");
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.innerHTML = "Select an option";
  document.getElementById("episode-selector").append(defaultOption);
  const episodes = state.episodes;
  for (episode of episodes) {
    const episodeListItem = createEpisodeListItem(episode);
    episodeSelector.append(episodeListItem);
  }
}

const backButton = document.getElementById("back-to-shows");
backButton.addEventListener("click", handleBackButton);

function handleBackButton(event) {
  document.getElementById("episodes-view").style.display = "none";
  document.getElementById("shows-view").style.display = "block";
  showViewSelector.selectedIndex = 0;
  state.selectedShowId = "";
  renderShowView();
}

const showSelector = document.getElementById("show-selector");
showSelector.addEventListener("change", handleShowSelection);

function handleShowSelection(event) {
  state.selectedShowId = event.target.value;
  fetchEpisodes();
}

const episodeSelector = document.getElementById("episode-selector");
episodeSelector.addEventListener("change", handleEpisodeSelection);

function handleEpisodeSelection(event) {
  state.selectedEpisodeId = event.target.value;
  renderByEpisodeSelection();
}

function renderByEpisodeSelection() {
  searchBox.value = "";
  state.searchTerm = "";
  renderByFilter((episode) => state.selectedEpisodeId == episode.id);
}

function renderBySearch() {
  episodeSelector.selectedIndex = 0;
  state.selectedEpisodeId = "";
  renderByFilter(filterBySearch);
}

function filterBySearch(episode) {
  const lowercaseName = episode.name.toLowerCase();
  const summary = episode.summary ?? "";
  const lowercaseSummary = summary.toLowerCase();
  return (
    lowercaseName.includes(state.searchTerm.toLowerCase()) ||
    lowercaseSummary.includes(state.searchTerm.toLowerCase())
  );
}

function renderByFilter(filterFunction) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const filteredEpisodes = state.episodes.filter(filterFunction);
  const episodeCards = filteredEpisodes.map(createEpisodeCard);
  rootElem.append(...episodeCards);
  document.getElementById(
    "filter-info"
  ).textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes`;
}

document.getElementById("all-episodes").addEventListener("click", render);

function render() {
  renderShowView();
  renderEpisodesView();
}

const showViewSelector = document.getElementById("showView-selector");
showViewSelector.addEventListener("change", handleShowViewSelection);

function handleShowViewSelection(event) {
  displayEpisodesView(event.target.value);
}

function filterByViewSearch(show) {
  const lowercaseName = show.name.toLowerCase();
  const summary = show.summary ?? "";
  const lowercaseSummary = summary.toLowerCase();
  const lowercaseGenres = show.genres.join().toLowerCase();

  return (
    lowercaseName.includes(state.searchViewTerm.toLowerCase()) ||
    lowercaseSummary.includes(state.searchViewTerm.toLowerCase()) ||
    lowercaseGenres.includes(state.searchViewTerm.toLowerCase())
  );
}

const searchViewBox = document.getElementById("showView-search");
searchViewBox.addEventListener("input", handleShowViewSearchInput);

function handleShowViewSearchInput(event) {
  state.searchViewTerm = event.target.value;
  renderShowView();
}

document
  .getElementById("all-shows-view")
  .addEventListener("click", function () {
    state.searchViewTerm = "";
    searchViewBox.value = "";
    renderShowView();
  });

function renderShowView() {
  populateShowSelector(showViewSelector);
  const rootElem = document.getElementById("shows-root");
  rootElem.innerHTML = "";

  const filteredShows = state.shows.filter(filterByViewSearch);
  const showCards = filteredShows.map(createShowCard);
  rootElem.append(...showCards);
  document.getElementById(
    "showView-filter-info"
  ).textContent = `Displaying ${filteredShows.length}/${state.shows.length} shows`;
}

function createShowCard(show) {
  const card = document.getElementById("show-card").content.cloneNode(true);
  const title = card.querySelector("#show-title");
  title.textContent = show.name;
  title.addEventListener("click", () => {
    displayEpisodesView(show.id);
  });

  const image = show.image ?? "";
  card.querySelector("#show-img").src = image.medium;
  card.querySelector("#show-summary").innerHTML =
    show.summary ?? "Summary not available";
  card.querySelector("#show-rating").innerHTML = show.rating.average;
  card.querySelector("#show-genres").innerHTML = show.genres.join(", ");
  card.querySelector("#show-status").innerHTML = show.status;
  card.querySelector("#show-runtime").innerHTML = show.runtime;
  return card;
}

function displayEpisodesView(showId) {
  state.selectedShowId = showId;
  document.getElementById("shows-view").style.display = "none";
  document.getElementById("episodes-view").style.display = "block";
  fetchEpisodes();
}

function renderEpisodesView() {
  populateShowSelector(showSelector);
  populateEpisodeSelector();
  renderByEpisodeSelection();
  renderBySearch();
}

fetchAllShows();

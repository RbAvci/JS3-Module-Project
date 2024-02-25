const state = {
  shows: [],
  selectedShowId: "",
  episodes: [],
  showEpisodes: new Map(),
  searchTerm: "",
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
      state.selectedShowId = state.shows[0].id;
      // fetchEpisodes();
      render();
      return data;
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
    episode.summary ?? "Summary not available";;
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

function populateShowSelector() {
  const shows = state.shows;
  for (const show of shows) {
    const showListItem = createShowListItem(show);
    showSelector.append(showListItem);
    if (show.id == state.selectedShowId) {
      showSelector.value = show.id;
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
  return lowercaseName.includes(state.searchTerm.toLowerCase()) ||
    lowercaseSummary.includes(state.searchTerm.toLowerCase());
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
  renderEpisodesView()
}

function renderShowView(){
 state.selectedShowId= "";
 renderByFilter(filterBySearch);


}

 function renderEpisodesView() {
   populateShowSelector();
   populateEpisodeSelector();
   renderByEpisodeSelection();
   renderBySearch();
 }

fetchAllShows();

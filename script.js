const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
  selectedEpisodeId: "",
};

function createEpisodeCard(episode) {
  const card = document.getElementById("episode-card").content.cloneNode(true);
  const title = card.querySelector("#episode-title");
  title.textContent = episode.name;
  title.setAttribute("href", episode.url);
  card.querySelector("#episode-code").textContent = episodeCode(
    episode.season,
    episode.number
  );
  card.querySelector("#episode-img").src = episode.image.medium;
  card.querySelector("#episode-summary").innerHTML = episode.summary;
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

const episodeSelector = document.getElementById("episode-selector");
episodeSelector.addEventListener("change", handleSelect);

function handleSelect(event) {
  state.selectedEpisodeId = event.target.value;
  console.log(state.selectedEpisodeId);
  renderBySelect();
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

function fillEpisodeList() {
  const episodes = state.episodes;
  for (e of episodes) {
    const episodeListItem = createEpisodeListItem(e);
    document.getElementById("episode-selector").append(episodeListItem);
  }
}

function renderBySelect() {
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
  const lowercaseSummary = episode.summary.toLowerCase();
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
  fillEpisodeList();
  renderBySelect();
  renderBySearch();
}

render();

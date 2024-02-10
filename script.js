//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
};

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (const episode of episodeList) {
    // showCard.innerHTML = "";
    const showCard = document
      .getElementById("show-card")
      .content.cloneNode(true);
    const showTitle = showCard.querySelector("#show-title");
    showTitle.textContent = episode.name;
    showTitle.setAttribute("href", episode.url);
    showCard.querySelector("#show-episode").textContent = episodeCode(
      episode.season,
      episode.number
    );
    showCard.querySelector("img").src = episode.image.medium;
    showCard.querySelector("#show-summary").innerHTML = episode.summary;

    rootElem.append(showCard);
    let allCards = [...document.querySelectorAll(".card-temp")];
    searchResults(allCards);
  }
}

function episodeCode(season, number) {
  let s = season < 10 ? `0${season}` : season;
  let n = number < 10 ? `0${number}` : number;
  let code = `S${s}E${n}`;
  return code;
}
const searchResults = (allCards) => {
  const searchInput = document.getElementById("q");

  searchInput.addEventListener("input", updateSearchTerm);

  function updateSearchTerm(e) {
    state.searchTerm = searchInput.value.toLowerCase();
    console.log(state.searchTerm);
    const filteredEpisodes = allCards.forEach(function (episode) {
      if (episode.innerText.toLowerCase().includes(state.searchTerm)) {
        episode.style.display = "block";
      } else {
        episode.style.display = "none";
      }
    });
  }
};


window.onload = setup;

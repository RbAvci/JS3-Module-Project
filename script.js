//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  populateEpisodeDropdown(allEpisodes);
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
    const episodeId = `episode-${episode.id}`;
    showCard.querySelector(".card-temp").id = episodeId;

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
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", updateSearchTerm);

  function updateSearchTerm(event) {
    state.searchTerm = searchInput.value.toLowerCase();
    console.log(state.searchTerm);
    let numberOfEpisodesDisplayed = 0;
    const filteredEpisodes = allCards.forEach(function (episode) {
      if (episode.innerText.toLowerCase().includes(state.searchTerm)) {
        episode.style.display = "block";
        numberOfEpisodesDisplayed++;
      } else {
        episode.style.display = "none";
      }
      document.querySelector(
        "#number-of-filtered-episodes"
      ).innerHTML = `Displaying ${numberOfEpisodesDisplayed}/${allCards.length} episodes`;
    });
  }
};

function populateEpisodeDropdown(episodeList) {
  const dropdown = document.getElementById("episodeDropdown");

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episodeCode(episode.season, episode.number)} -${episode.name} `;
    dropdown.appendChild(option);
  });
  dropdown.addEventListener("change", handleDropdownChange);
}

function handleDropdownChange() {
  const selectedEpisodeId = document.getElementById("episodeDropdown").value;
  const selectedEpisode = state.episodes.find(
    (episode) => episode.id === parseInt(selectedEpisodeId)
  );
  if (selectedEpisode) {
    scrollToEpisode(selectedEpisode);
  }
}

function scrollToEpisode(episode) {
  const episodeId = `episode-${episode.id}`;
  const episodeElement = document.getElementById(episodeId);
  if (episodeElement) {
    episodeElement.scrollIntoView({ behavior: "smooth" });
  }
}
window.onload = setup;

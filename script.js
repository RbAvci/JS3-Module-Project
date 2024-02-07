//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (const episode of episodeList) {
    const showCard = document.getElementById("show-card").content.cloneNode(true);
    const showTitle = showCard.querySelector("#show-title");
    showTitle.textContent = episode.name;
    showTitle.setAttribute("href", episode.url);
    showCard.querySelector("#show-episode").textContent = episodeCode(episode.season, episode.number);
    showCard.querySelector("img").src = episode.image.medium;
    showCard.querySelector("#show-summary").innerHTML = episode.summary;

    rootElem.append(showCard);
  }
}

function episodeCode(season, number) {
  let s = season < 10 ? `0${season}` : season;
  let n = number < 10 ? `0${number}` : number;
  let code = `S${s}E${n}`;
  return code;
}

window.onload = setup;

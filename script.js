//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (const episode of episodeList) {
    const showCard = document.getElementById("show-card").content.cloneNode(true);

    showCard.querySelector("#show-title").textContent = episode.name;
    showCard.querySelector("#show-episode").textContent = `${episode.season} - ${episode.number}`;
    showCard.querySelector("img").src = episode.image.medium;
    showCard.querySelector("#show-summary").innerHTML = episode.summary;

    rootElem.append(showCard);
  }
}

window.onload = setup;

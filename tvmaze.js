"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TV_MAZE_SHOWS_URL = "http://api.tvmaze.com/search/shows";
const BROKEN_IMG_URL = "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";

// This needs to be put somewhere else and updated with string interpolation
const TV_MAZE_EPISODES_URL = "http://api.tvmaze.com/shows/";



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  //Pseudo-code: 
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  // Use Axios.get and then some query terms from the search
  // Return an array of show objects
  const response = await axios.get(TV_MAZE_SHOWS_URL, { params: { q: term } });
  // console.log("response:", response);
  // console.log("response.data:", response.data);
  let shows = [];
  for (let scoreAndShow of response.data) {
    let { id, name, summary, image } = scoreAndShow.show;
    // console.log("in loop destructured response=",{ id, name, summary, image });
    image = image === null ? BROKEN_IMG_URL : image.medium;
    shows.push({ id, name, summary, image });
  }

  // console.log("shows=",shows);
  // console.log("destructured response=",response.data);
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {

    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}"
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes episode-button">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", ".episode-button", handleEpisodesClick);

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  console.log("id=",id);
  const response = await axios.get(`${TV_MAZE_EPISODES_URL}${id}/episodes`);
  // console.log("episodes:", response);
  let episodes = [];
  for (let episode of response.data) {
    let { id, name, season, number } = episode;
    episodes.push({ id, name, season, number });
  }
  // const shortenedEpisodes = response.data.map(function(episode) {
  //   return { id, name, season, number} = episode;
  // })
  return episodes;
}

/** A function that is provided an array of episodes information and
 *  populates that into the #episodesList section of the DOM
 */

function populateEpisodes(episodes) {
  $("#episodesList").empty();
  //console.log("populateEpisodes ran;")
  // create a loop to go through each of the episodes
  for (let episode of episodes) {
    let newEpisode = $("<li>")
      .attr("episode-id", `${episode.id}`)
      .text(`${episode.name} (Season: ${episode.season}, Number: ${episode.number})`);
    $("#episodesList").append(newEpisode);
  }
    $episodesArea.show();
}

/** Handles the click on the Episodes button, runs the populateEpisodes for the respective show */
async function handleEpisodesClick(evt) {
  //console.log("handleEpisodesClick ran.");
  const showId = $(evt.target)
    .closest(".Show")
    .attr("data-show-id");
  //console.log("showId=",showId);
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}
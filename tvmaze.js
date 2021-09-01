"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TV_MAZE_SHOWS_URL = "http://api.tvmaze.com/search/shows";
const BROKEN_IMG_URL = "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";

// This needs to be put somewhere else and updated with string interpolation
// const TV_MAZE_EPISODES_URL = "http://api.tvmaze.com/shows/%5Bshowid%5D/episodes"



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
  console.log("response:", response);
  console.log("response.data:", response.data);
  return response.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let showImageUrl;
    
    showImageUrl = show.show.image === null ? BROKEN_IMG_URL : show.show.image.original;
    
    // if (show.show.image === null) {
    //   showImageUrl = "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
    // }
    // else {
    //   showImageUrl = show.show.image.original;
    // }

    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src= "${showImageUrl}";
              alt="${show.show.name}" ;
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
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

  // $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }

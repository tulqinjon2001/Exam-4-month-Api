let elForm = $(".js-movie-form");
let elInputTitle = $(".js-movie-input", elForm);
let elSelect = $(".js-form-select", elForm);

let elOutList = $(".js-out-list");
// let elBookmarkedMovies = $(".js-bookmarked-movies");

let bookmarkedMovies = []; // Array for bookmarked

// Template Card
let elCardTemplate = $("#search-result-template").content;
// Template bookmark
// let elBookmarkedMovieTemplate = $("#bookmarked-movie-template").content;

let elModalMovie = $(".js-modal-movie");

// Add spinner
const elSpinner = document.querySelector(".anime__spinner");

const errors = (err) => {
  let elMoviesErrorInfo = document.createElement("li");
  elMoviesErrorInfo.innerHTML = `<p>${err}</p>`
  
  elOutList.appendChild(elMoviesErrorInfo);
}

let renderResults = (datum) => {
  elOutList.innerHTML = "";
  
  let elResultsFragment = document.createDocumentFragment();
  
  datum.forEach(data => {
    let elData = elCardTemplate.cloneNode(true);
    
    $(".js-movie__poster", elData).src = data.Poster;
    $(".js-movie__poster", elData).alt = data.Title;
    $(".js-search-result__item", elData).dataset.dataId = data.imdbID;
    $(".movie__title", elData).textContent = data.Title;
    
    elResultsFragment.appendChild(elData);
  })
  
  elOutList.appendChild(elResultsFragment);
}

let elBackPage = $(".js-pagenation-back");
let elNextPage = $(".js-pagenation-next");
let elPageNum = $(".js-pagenation-page");

let resultPrice = 0;
let minPageNum = 1;
const pageSize = 10;

let nextPageFunc = (title) => {
  elNextPage.addEventListener('click', () => {
    if (minPageNum < Math.ceil(resultPrice/pageSize)) {
      minPageNum += 1;
      request(title);
      elPageNum.textContent = minPageNum;
    }
  })
}

let backPageFunc = (title) =>  {
  elBackPage.addEventListener('click', () => {
    if (minPageNum > 1) {
      minPageNum -= 1;
      request(title);
      elPageNum.textContent = minPageNum;
    } else {
      return;
    }
  })
}

let request = async (title) => {
  try {
    let URL = `https://omdbapi.com/?s=${title}&apikey=1bcf2514&page=${minPageNum}`;
    let response = await fetch(URL)
    .finally(spinnerAdd);
    let data = await response.json();
    renderResults(data.Search);
    
    elOutList.addEventListener("click", (evt) => {
      if (evt.target.matches(".js-movie-info-button")) {
        let dataId = evt.target.closest(".js-search-result__item").dataset.dataId;
        
        let foundMovie = data.Search.find(movie => {
          return movie.imdbID === dataId;
        })
        
        $(".modal-title", elModalMovie).textContent = foundMovie.Title;
        $(".js-movie__poster", elModalMovie).src = foundMovie.Poster;
        $(".js-movie__poster", elModalMovie).alt = foundMovie.Title;
        $(".js-modal-body__content-span", elModalMovie).innerText = `
        ${foundMovie.Type} Year: ${foundMovie.Year}\n
          Type: ${foundMovie.Type}\n
          ID: ${foundMovie.imdbID}
          `;
        }
    })

    elOutList.addEventListener("click", (evt) => {
      if (evt.target.matches(".js-movie-bookmark")) {
        let dataId = evt.target.closest(".js-search-result__item").dataset.dataId;
    
      let foundMovie = data.Search.find(movie => {
          return movie.imdbID === dataId;
        })
    
        if (!bookmarkedMovies.includes(foundMovie)) {
          bookmarkedMovies.push(foundMovie);
        }
        bookmarkResults(bookmarkedMovies);
      }
    })

    let maxElementPrice = Number(data.totalResults);
    resultPrice = maxElementPrice;
  } catch(err) {
    errors(err);
  }
}

// let categoryFunc = (category) => {
//   return category;
// }
  
function spinnerRemove() {
  elSpinner.classList.remove("d-none");
}
  
function spinnerAdd() {
  elSpinner.classList.add("d-none");
}
  
// elForm Event Listener
elForm.addEventListener("submit", (event) => {
  event.preventDefault();
    
  elOutList.innerHTML = null;
  spinnerRemove();
    
  let inputTitle = elInputTitle.value.trim();
  // let selectValue = elSelect.value.toString();
    
  request(inputTitle);
  console.log(request(inputTitle));

  minPageNum = 0;
  elPageNum.textContent = 1;

  nextPageFunc(inputTitle);
  backPageFunc(inputTitle);
  
  elInputTitle.value = "";
})

// Add Event listener Bookmark
let bookmarkResults = (bookmarkedResults) => {
  elBookmarkedMovies.innerHTML = "";

  let elBookmarksFragment = document.createDocumentFragment();

  bookmarkedResults.forEach(movie => {
    let elBookmarkMovie = elBookmarkedMovieTemplate.cloneNode(true);

    $(".js-bookmarked-movie", elBookmarkMovie).dataset.imdbId = movie.imdbID;
    $(".js-bookmarked-movie-title", elBookmarkMovie).textContent = movie.Title;

    elBookmarksFragment.appendChild(elBookmarkMovie);

    localStorage.setItem("films", movie.Title);
  })

  elBookmarkedMovies.appendChild(elBookmarksFragment);
}

// elBookmarkedMovies.addEventListener("click", (evt) => {
//   if (evt.target.matches(".js-bookmarked-remove")) {
//     let bookmarkedId = evt.target.closest(".js-bookmarked-movie").dataset.imdbId;
    
//     let foundBookmark = bookmarkedMovies.find(movie => {
//       return movie.imdbId === bookmarkedId;
//     })
    
//     if (foundBookmark.imdbId === bookmarkedId) {
//       bookmarkedMovies.splice(foundBookmark, 1);
//       // elBookmarkedMovies.removeChild(".js-bookmarked-movie");
//       console.log(bookmarkedMovies);
//     }
//   }
// })
const maxSliderResults = 21;
const maxResultPages = 4;
const imgPerSection = 7;

// ---------------------------------------------------------------------
//                      Setup Top Movie Head
// ---------------------------------------------------------------------

function createTopMovieHead(movieObject) {
  /**
   * Creates the Head Section for the Top Rated Movie.
   */
  let imageContainer = document.getElementById("bgImage");
  imageContainer.style.backgroundImage = `url(${movieObject.image_url})`;

  let movieTitle = document.querySelector(".movieTitleBox h2");
  movieTitle.innerText = movieObject.title;

  let playButton = document.querySelector(".movieTitleBox a");
  playButton.href = movieObject.imdb_url;
}

// ---------------------------------------------------------------------
//                      Setup Imagesliders
// ---------------------------------------------------------------------

const imgList = Array(12).fill(
  "https://images.unsplash.com/photo-1626191587911-45c8729b8d99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"
);

// preventing the window from scrolling to the Position of the link-tag.
let winX = null;
let winY = null;

window.addEventListener("scroll", function () {
  if (winX !== null && winY !== null) {
    window.scrollTo(winX, winY);
    winX = null;
    winY = null;
  }
});

function disableWindowScroll() {
  winX = window.scrollX;
  winY = window.scrollY;
}

// ------------------ creator for a new imageslider -------------------
function createImageSlider(title, movieObjectList) {
  /**
   * Takes two Arguments, Creates a new Imageslider,
   * and appends it at the end of the <div> with the id: sliderArea.
   *
   * Args:
   *  title: String
   *  movieObjectlist: array - array of movie-objects in json format.
   */
  const titleNoSpaces = title.replaceAll(" ", "_");

  let numberOfSections = Math.ceil(movieObjectList.length / imgPerSection);
  let listOfImageChunks = sliceIntoChunks(movieObjectList, imgPerSection);

  let newSlider = document.createElement("div");
  newSlider.id = "imageSlider";

  let newHeader = document.createElement("h2");
  newHeader.className = "sectionHeader";
  newHeader.innerText = title;

  let sectionIndicator = document.createElement("ul");
  sectionIndicator.className = "sectionIndicator";
  sectionIndicator.id = titleNoSpaces;
  sectionIndicator.style.visibility = "hidden";

  for (let i = 0; i < numberOfSections; i++) {
    let li = document.createElement("li");
    li.className = "";
    sectionIndicator.appendChild(li);
  }
  sectionIndicator.firstElementChild.className = "active";

  let sliderHeadline = document.createElement("div");
  sliderHeadline.className = "flexProperties";
  sliderHeadline.appendChild(newHeader);
  sliderHeadline.appendChild(sectionIndicator);

  let divScrollbar = document.createElement("div");
  divScrollbar.classList.add("categoryScrollbar");
  divScrollbar.style.gridTemplateColumns = `repeat(${numberOfSections}, 100%)`;
  divScrollbar.addEventListener("mouseover", function () {
    document.getElementById(titleNoSpaces).style.visibility = "visible";
  });
  divScrollbar.addEventListener("mouseout", function () {
    document.getElementById(titleNoSpaces).style.visibility = "hidden";
  });

  let sectionNumber = 1;
  for (const chunk of listOfImageChunks) {
    window["section" + sectionNumber] = document.createElement("section");
    let section = window["section" + sectionNumber];
    section.id = `section${sectionNumber}${title}`;
    section.style.gridTemplateColumns = `repeat(${imgPerSection}, auto)`;

    // if a section is incomplete the thumbnails will be aligned left to right
    // else they will have an even space in between
    if (chunk.length < imgPerSection) {
      section.style.justifyContent = "flex-start";
    } else {
      section.style.justifyContent = "space-between";
    }

    let arrowLeft = document.createElement("a");
    arrowLeft.textContent = "‹";
    arrowLeft.onmousedown = function () {
      disableWindowScroll();

      const newContent = highlightLastSectionIndicator(
        document.querySelectorAll(`#${titleNoSpaces} li`)
      );

      let ul = document.getElementById(`${titleNoSpaces}`);
      ul.innerHTML = "";
      for (const li of newContent) {
        ul.appendChild(li);
      }
    };

    arrowLeft.href = `#section${lastSectionNumber(
      sectionNumber,
      numberOfSections
    )}${title}`;
    arrowLeft.classList.add("arrowButton", "leftArrow");

    section.appendChild(arrowLeft);

    for (const movieObject of chunk) {
      let thumbnail = document.createElement("div");
      thumbnail.classList.add("movieImages");

      let link = document.createElement("a");
      link.href = movieObject.imdb_url;

      let img = document.createElement("img");
      img.src = movieObject.image_url;

      link.appendChild(img);

      thumbnail.appendChild(link);

      section.appendChild(thumbnail);
    }

    let arrowRight = document.createElement("a");
    arrowRight.textContent = "›";
    arrowRight.onmousedown = function () {
      disableWindowScroll();

      const newContent = highlightNextSectionIndicator(
        document.querySelectorAll(`#${titleNoSpaces} li`)
      );

      let ul = document.getElementById(`${titleNoSpaces}`);
      ul.innerHTML = "";
      for (const li of newContent) {
        ul.appendChild(li);
      }
    };

    arrowRight.href = `#section${nextSectionNumber(
      sectionNumber,
      numberOfSections
    )}${title}`;
    arrowRight.classList.add("arrowButton", "rightArrow");

    section.appendChild(arrowRight);

    divScrollbar.appendChild(section);
    sectionNumber += 1;
  }
  newSlider.appendChild(sliderHeadline);
  newSlider.appendChild(divScrollbar);
  document.getElementById("sliderArea").appendChild(newSlider);
}

function nextSectionNumber(sectionNumber, numberOfSections) {
  if (sectionNumber == numberOfSections) {
    return 1;
  } else {
    return sectionNumber + 1;
  }
}

function lastSectionNumber(sectionNumber, numberOfSections) {
  if (sectionNumber == 1) {
    return numberOfSections;
  } else {
    return sectionNumber - 1;
  }
}

function highlightNextSectionIndicator(nodeListElements) {
  let listElements = Array.from(nodeListElements);
  listElements.unshift(listElements.pop());

  return listElements;
}

function highlightLastSectionIndicator(nodeListElements) {
  let listElements = Array.from(nodeListElements);
  listElements.push(listElements.shift());

  return listElements;
}

//--------------------- Helper functions ------------------------------

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

// ---------------------------------------------------------------------
//                      Get Data from the Api
// ---------------------------------------------------------------------

const baseUrl = "http://localhost:8000/api/v1/";

async function fetchData(endpoint) {
  /**
   * Takes an endpoint as an argurment, and returns the response data
   * in a json format.
   *
   * If an error occures, it will be loged in the Console.
   */
  data = await fetch(baseUrl + endpoint)
    .then((response) => response.json())
    .catch((error) => console.log("An error has occurred!", error));
  return data;
}

// ---------------------------------------------------------------------
//         Create "Top Rated Movies - Section and Top-Movie-Head"
// ---------------------------------------------------------------------
let topMovieObjectsList = [];

// find all pages of the filter-endpoint

let next = `titles?sort_by=-imdb_score`;

let pagesChecked = 0;
function fetchResultPages() {
  fetchMovieDetails(next);
  fetchData(next).then((data) => {
    if (data.next && pagesChecked <= maxResultPages) {
      next = data.next.split("v1/")[1];
      fetchResultPages();
      pagesChecked += 1;
    } else {
      topMovieObjectsList = topMovieObjectsList.splice(0, maxSliderResults);
      createTopMovieHead(topMovieObjectsList[0]);
      setupTopRatedSlider(topMovieObjectsList);
      pagesChecked = 0;
    }
  });
}

// add the movie object to the list
function fetchMovieDetails(EndPoint) {
  fetchData(EndPoint).then((data) => {
    for (const movie of data.results) {
      topMovieObjectsList.push(movie);
    }
  });
}

// creat the slider with all Top rated movies
function setupTopRatedSlider(movieObjectList) {
  createImageSlider("Top Rated Movies", movieObjectList);
}

// ------------------- Fetch all categories ----------------------
let categoryNames = [];

let endPoint = "genres/";
function fetchAllCategories() {
  fetchCategoryNames(endPoint);
  fetchData(endPoint).then((data) => {
    if (data.next != null) {
      endPoint = data.next.split("v1/")[1];
      fetchAllCategories();
    } else {
      new CategorySlider();
    }
  });
}

function fetchCategoryNames(categoryPage) {
  fetchData(categoryPage).then((data) => {
    for (const result of data.results) {
      categoryNames.push(result.name);
    }
  });
}

// ---------------------------------------------------------------------
//         Creator for a new slider for the next available Category
// ---------------------------------------------------------------------

class CategorySlider {
  constructor() {
    this.allCategoryMovieObjects = [];
    this.categoryName = "";
    this.currentEndPoint = "";
    this.pagesChecked = 0;
    this.categoryName = categoryNames.shift();
    this.currentEndPoint = `titles?genre=${this.categoryName}&sort_by=-imdb_score`;
    this.fetchNextCategory();
  }

  fetchNextCategory() {
    this.fetchMovieObjects(this.currentEndPoint);
    fetchData(this.currentEndPoint).then((data) => {
      if (data.next && this.pagesChecked <= maxResultPages) {
        this.currentEndPoint = data.next.split("v1/")[1];
        this.fetchNextCategory();
        this.pagesChecked += 1;
      } else {
        this.allCategoryMovieObjects = this.allCategoryMovieObjects.splice(
          0,
          maxSliderResults
        );
        createImageSlider(this.categoryName, this.allCategoryMovieObjects);
        this.allCategoryMovieObjects = [];
      }
    });
  }

  fetchMovieObjects(currentCategoryPage) {
    fetchData(currentCategoryPage).then((data) => {
      for (const result of data.results) {
        this.allCategoryMovieObjects.push(result);
      }
    });
  }
}

fetchResultPages();
fetchAllCategories();

// add new category slider if user reached end of page
window.onscroll = function () {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    new CategorySlider();
  }
};

// ---------------------------------------------------------------------
//                        Setup Modal Window
// ---------------------------------------------------------------------

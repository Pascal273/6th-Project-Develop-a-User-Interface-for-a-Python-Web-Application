const minRatingForTopRatedSection = 9.2;
const minRatingForCategories = 8;
const maxSliderResults = 15;
const maxResultPages = 3;
const imgPerSection = 5;
const categoriesPerLoad = 3;

// ---------------------------------------------------------------------
//                      Setup Top Movie Head
// ---------------------------------------------------------------------

function createTopMovieHead(movieObject) {
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

// prevents the window from scrolling to the Position of the link-tag.
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

function createImageSlider(title, movieObjectList) {
  const titleNoSpaces = title.replaceAll(" ", "_");

  let numberOfSections = Math.ceil(movieObjectList.length / imgPerSection);
  let listOfImageChunks = sliceIntoChunks(movieObjectList, imgPerSection);

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

  document.getElementById("imageSlider").appendChild(sliderHeadline);
  document.getElementById("imageSlider").appendChild(divScrollbar);
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
  data = await fetch(baseUrl + endpoint)
    .then((response) => response.json())
    .catch((error) => console.log("An error has occurred!", error));
  return data;
}

// ------ Create "Top Rated Movies - Section and Top-Movie-Head" ------
let topMovieObjectsList = [];
let pagesChecked = 0;

// find all pages of the filter-endpoint

// let next = `titles?imdb_score_min=${minRatingForTopRatedSection}`;
let next = `titles?sort_by=-imdb_score`;

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
function fetchMovieDetails(movieEndPoint) {
  fetchData(movieEndPoint).then((data) => {
    for (const movie of data.results) {
      topMovieObjectsList.push(movie);
    }
  });
}

// creat the slider with all Top rated movies
function setupTopRatedSlider(movieObjectList) {
  createImageSlider("Top Rated Movies", movieObjectList);
}

fetchResultPages();

// ------------------- Fecth all categories ----------------------
let categoryNames = [];

let endPoint = "genres/";
function fetchAllCategories() {
  fetchCategoryNames(endPoint);
  fetchData(endPoint).then((data) => {
    if (data.next != null) {
      endPoint = data.next.split("v1/")[1];
      fetchAllCategories();
    } else {
      nextCategory();
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

// --------------- Fetch all titles from a Category ---------------

let allCategoryMovieObjects = [];
let categoryName = "";
let currentEndPoint = "";

function nextCategory() {
  categoryName = categoryNames.shift();
  currentEndPoint = `titles?genre=${categoryName}&sort_by=-imdb_score`;
  fetchNextCategory();
}

function fetchNextCategory() {
  fetchMovieObjects(currentEndPoint);
  fetchData(currentEndPoint).then((data) => {
    if (data.next && pagesChecked <= maxResultPages) {
      currentEndPoint = data.next.split("v1/")[1];
      fetchNextCategory();
      pagesChecked += 1;
    } else {
      allCategoryMovieObjects = allCategoryMovieObjects.splice(
        0,
        maxSliderResults
      );
      createCategorySlider(categoryName, allCategoryMovieObjects);
      allCategoryMovieObjects = [];
      pagesChecked = 0;
    }
  });
}

function fetchMovieObjects(currentCategoryPage) {
  fetchData(currentCategoryPage).then((data) => {
    for (const result of data.results) {
      allCategoryMovieObjects.push(result);
    }
  });
}

// ---------------- Creator for a new Category Section ---------------

function createCategorySlider(categoryName, listOfMovies) {
  createImageSlider(categoryName, listOfMovies);
  // console.log(categoryName, listOfMovies);
}

fetchAllCategories();

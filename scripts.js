const maxSliderResults = 21; // max number of movies per slider
const imgPerSection = 7; // number of images per slider section
const maxResultPages = 4; // max fetch-result pages
const categoryOrder = "r"; // (a)lphabetic / (r)andom
const catPerLoad = 3; // number of categories at start

// ---------------------------------------------------------------------
//                      Setup Top Movie Head
// ---------------------------------------------------------------------

function createTopMovieHead(movieId) {
  /**
   * Creates the Head Section for the Top Rated Movie.
   */
  movieEndPoint = `titles/${movieId}`;
  fetchData(movieEndPoint).then((movieObject) => {
    let imageContainer = document.getElementById("movieImage");
    imageContainer.src = movieObject.image_url;

    let movieTitle = document.querySelector(".movieTitleBox h1");
    movieTitle.innerText = movieObject.title;

    let description = document.querySelector(".movieTitleBox #description");
    description.innerText = movieObject.description;
  });
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
function createImageSlider(title, movieObjectList, containerId) {
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
  let movieListChunks = sliceIntoChunks(movieObjectList, imgPerSection);

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
  for (const chunk of movieListChunks) {
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
      link.href = "#/";
      link.addEventListener("click", () => displayModal(movieObject.id));

      let img = document.createElement("img");
      img.src = movieObject.image_url;
      img.onload = () => link.appendChild(img);
      img.onerror = () => {
        let titleText = document.createElement("h3");
        titleText.className = "noImageTitle";
        titleText.innerText = movieObject.title;
        let infoText = document.createElement("h3");
        infoText.className = "noImageTitle";
        infoText.innerText = "No image\navailable";

        link.append(titleText, infoText);

        link.id = "noThumbnail";
      };

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
  let newSlider = document.getElementById(containerId);

  newSlider.appendChild(sliderHeadline);
  newSlider.appendChild(divScrollbar);
  // document.getElementById(containerId).appendChild(newSlider);
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
//                     Fetch all categories
// ---------------------------------------------------------------------

let categoryNames = ["Top Rated Movies"];

let endPoint = "genres/";
function fetchAllCategories() {
  fetchCategoryNames(endPoint);
  fetchData(endPoint).then((data) => {
    if (data.next) {
      endPoint = data.next.split("v1/")[1];
      fetchAllCategories();
    } else {
      createNextSlider();
      if (categoryOrder == "r") {
        categoryNames.sort((a, b) => 0.5 - Math.random());
      }
      for (let i = 0; i < catPerLoad; i++) {
        createNextSlider();
      }
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
//        Creator Top Rated Movies and the next available Category
// ---------------------------------------------------------------------

class CategorySlider {
  constructor(categoryName, id) {
    this.movieObjects = [];
    this.pagesChecked = 0;
    this.categoryName = categoryName;
    this.id = id;
    if (this.categoryName == "Top Rated Movies") {
      this.endPoint = `titles?sort_by=-imdb_score`;
    } else {
      this.endPoint = `titles?genre=${this.categoryName}&sort_by=-imdb_score`;
    }
    this.fetchCategory();
  }

  fetchCategory() {
    this.fetchMovieObjects(this.endPoint);
    fetchData(this.endPoint).then((data) => {
      if (data.next && this.pagesChecked <= maxResultPages) {
        this.endPoint = data.next.split("v1/")[1];
        this.fetchCategory();
        this.pagesChecked += 1;
      } else {
        if (this.movieObjects.length >= imgPerSection) {
          this.movieObjects = this.movieObjects.splice(0, maxSliderResults);
          createImageSlider(this.categoryName, this.movieObjects, this.id);
        }
      }
    });
  }

  fetchMovieObjects(currentCategoryPage) {
    fetchData(currentCategoryPage)
      .then((data) => data.results)
      .then((results) => {
        if (this.categoryName == "Top Rated Movies" && this.pagesChecked == 0) {
          createTopMovieHead(results[0].id);
        }
        for (const result of results) {
          this.movieObjects.push(result);
        }
      });
  }
}

idNumber = 0;
function createNextSlider() {
  idNumber += 1;

  let newSlider = document.createElement("div");
  newSlider.className = "imageSlider";
  const id = `imageSlider_${idNumber}`;
  newSlider.id = id;
  document.getElementById("sliderArea").appendChild(newSlider);

  new CategorySlider(categoryNames.shift(), id);
}

fetchAllCategories();

// add new category slider if user reached end of page
window.onscroll = function () {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    for (let i = 0; i < catPerLoad; i++) {
      if (categoryNames) {
        createNextSlider();
      }
    }
  }
};

// ---------------------------------------------------------------------
//                        Setup Modal Window
// ---------------------------------------------------------------------

// key = gets Displayed at the left side of th detail section.
// value = key  the respective detail within the Api.
const detailsToDisplay = {
  Genres: "genres",
  "Release date": "date_published",
  "MPAA rating": "rated",
  "IMDb score": "imdb_score",
  Director: "directors",
  "List of actors": "actors",
  Duration: "duration",
  "Country of origin": "countries",
  "Box Office result": "worldwide_gross_income",
  "Movie summary": "long_description",
};

function displayModal(movieId) {
  /**
   * Takes a movie-ID and displayes the modal window
   * with detailed information to the movie.
   */
  setupModalContent(movieId);
  let modalWindow = document.getElementById("modalWindow");
  modalWindow.style.visibility = "visible";
}

function setupModalContent(movieId) {
  /**
   * Takes a movie-ID and creates the content inside the modal window.
   */
  const endPoint = `titles/${movieId}`;
  fetchData(endPoint).then((data) => {
    let contentArea = document.querySelector(".modal");

    let modalImage = document.createElement("img");
    modalImage.src = data.image_url;
    modalImage.onload = () => contentArea.appendChild(modalImage);
    modalImage.onerror = () => {
      let infoText = document.createElement("h3");
      infoText.id = "noImageInfo";
      infoText.innerText = "No image\navailable";

      contentArea.appendChild(infoText);
    };

    let modalTitle = document.createElement("h1");
    modalTitle.innerText = data.title;

    let modalOriginalTitle = document.createElement("h2");
    modalOriginalTitle.innerText = `(${data.original_title})`;

    contentArea.append(modalTitle, modalOriginalTitle);

    for (const key in detailsToDisplay) {
      let container = document.createElement("div");
      let p1 = document.createElement("p");
      let p2 = document.createElement("p");
      let detail = data[detailsToDisplay[key]];

      if (!detail) {
        detail = "Not available";
      }

      p1.innerText = `${key}: `;

      if (key == "Duration") {
        detail = minutesToHHMM(detail);
      }

      if (key == "Box Office result" && detail != "Not available") {
        detail = detail.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (data.budget_currency) {
          detail = detail + " " + data.budget_currency;
        } else {
          detail = detail + " USD";
        }
      }

      p2.innerText = `${detail}`;
      container.appendChild(p1);
      container.appendChild(p2);
      contentArea.appendChild(container);
    }

    let closeButton = document.createElement("a");
    closeButton.href = "#/";
    closeButton.id = "closeModal";
    closeButton.innerText = "X";
    closeButton.addEventListener("click", () => closeModal());
    contentArea.appendChild(closeButton);
  });
}

// Modal window also closes by click outside of it
let outsideModal = document.getElementById("modalWindow");
let modalArea = document.querySelector(".modal");
outsideModal.addEventListener("click", (event) => {
  let isClickInside = modalArea.contains(event.target);
  if (!isClickInside) {
    closeModal();
  }
});

function closeModal() {
  /**
   * Hides the modal window and clears it's content.
   */
  document.getElementById("modalWindow").style.visibility = "hidden";
  document.querySelector(".modal").innerHTML = "";
}

// ---------------------------------------------------------------------
//                      Helper Functions
// ---------------------------------------------------------------------

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function minutesToHHMM(totalMinutes) {
  let minutes = totalMinutes % 60;
  minutes = minutes.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let hours = (totalMinutes - minutes) / 60;
  return `${hours}h ${minutes}m`;
}

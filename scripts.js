// ---------------------------------------------------------------------
//                      Setup Imagesliders
// ---------------------------------------------------------------------

const imgList = Array(12).fill(
  "https://images.unsplash.com/photo-1626191587911-45c8729b8d99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"
);

const imgPerSection = 4;

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

function createImageSlider(title, listOfImages) {
  const titleNoSpaces = title.replaceAll(" ", "_");

  let numberOfSections = Math.ceil(listOfImages.length / imgPerSection);
  let listOfImageChunks = sliceIntoChunks(listOfImages, imgPerSection);

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

    for (const thumb of chunk) {
      let thumbnail = document.createElement("div");
      thumbnail.classList.add("movieImages");

      let link = document.createElement("a");
      link.href = "#";

      let img = document.createElement("img");
      img.src = thumb;

      let heading = document.createElement("h3");
      heading.textContent = "Movie Title";
      heading.className = "heading";

      let duration = document.createElement("p");
      duration.textContent = "Duration: 60 min";
      duration.className = "duration";

      link.appendChild(img);
      link.appendChild(heading);
      link.appendChild(duration);

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

// --------------- Create "Top Rated Movies - Section" -----------------
const topRatedMovies = [];

fetchData("titles?imdb_score_min=9").then((data) =>
  setupTopRated(data.results)
);

function setupTopRated(topRatedData) {
  for (const item of topRatedData) {
    topRatedMovies.push(item);
  }
  console.log(topRatedMovies);
}

createImageSlider("Top Rated Movies", imgList);

// ------------------- Create Categories sections ----------------------

fetchData("genres").then((data) => setupCategories(data.results));

function setupCategories(arrayOfCategories) {
  let categoryList = [];
  for (const item of arrayOfCategories) {
    categoryList.push(item.name);
  }
  for (const category of categoryList) {
    createImageSlider(category, imgList);
  }
}

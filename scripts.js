const imgPerSection = 4;

let winX = null;
let winY = null;

// prevents the window from scrolling to the Position of the link-tag.
window.addEventListener("scroll", function () {
  if (winX !== null && winY !== null) {
    window.scrollTo(winX, winY);
    winX = null;
    winY = null;
  }
});

function createImageSlider(title, listOfImages) {
  let numberOfSections = Math.ceil(listOfImages.length / imgPerSection);
  let listOfImageChunks = sliceIntoChunks(listOfImages, imgPerSection);

  let newHeader = document.createElement("h1");
  newHeader.className = "sectionHeader";
  newHeader.innerText = title;

  let divScrollbar = document.createElement("div");
  divScrollbar.classList.add("categoryScrollbar");

  let count = 1;
  for (const chunk of listOfImageChunks) {
    window["section" + count] = document.createElement("section");
    let section = window["section" + count];
    section.id = `section${count}${title}`;

    // if a section is incomplete the thumbnails will be aligned left to right
    // else they will have an even space in between
    if (chunk.length < imgPerSection) {
      section.style.justifyContent = "flex-start";
    } else {
      section.style.justifyContent = "space-between";
    }

    let arrowLeft = document.createElement("a");
    arrowLeft.textContent = "‹";
    arrowLeft.onmousedown = function disableWindowScroll() {
      winX = window.scrollX;
      winY = window.scrollY;
    };
    arrowLeft.href = `#section${lastSectionNumber(
      count,
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

      let heading = document.createElement("h1");
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
    arrowRight.onmousedown = function disableWindowScroll() {
      winX = window.scrollX;
      winY = window.scrollY;
    };

    arrowRight.href = `#section${nextSectionNumber(
      count,
      numberOfSections
    )}${title}`;
    arrowRight.classList.add("arrowButton", "rightArrow");

    section.appendChild(arrowRight);

    divScrollbar.appendChild(section);
    count += 1;
  }

  document.getElementById("imageSlider").appendChild(newHeader);
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

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const imgList = Array(12).fill(
  "https://images.unsplash.com/photo-1626191587911-45c8729b8d99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"
);

let topRated = createImageSlider("Top Rated Movies", imgList);
let category1 = createImageSlider("Action", imgList);
let category2 = createImageSlider("Crime", imgList);
let category3 = createImageSlider("Comedy", imgList);

const link = document.getElementsByTagName("a");

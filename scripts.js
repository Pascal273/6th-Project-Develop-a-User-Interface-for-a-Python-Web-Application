function createImageSlider(title, listOfImages) {
  let numberOfSections = Math.ceil(listOfImages.length / 4);
  let listOfImageChunks = sliceIntoChunks(listOfImages, 4);

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

    let arrowLeft = document.createElement("a");
    arrowLeft.href = `#section${lastSectionNumber(
      count,
      numberOfSections
    )}${title}`;
    arrowLeft.classList.add("arrowButton", "leftArrow");

    section.appendChild(arrowLeft);

    for (const thumb of chunk) {
      let img = document.createElement("div");
      img.classList.add("movieImages");
      img.style.backgroundImage = `url(${thumb})`;

      section.appendChild(img);
    }

    let arrowRight = document.createElement("a");
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

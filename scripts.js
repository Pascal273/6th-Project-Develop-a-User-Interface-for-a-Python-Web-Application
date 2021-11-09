class Imageslider {
  constructor(title, listOfImages) {
    this.numberOfSections = Math.ceil(listOfImages.length / 4);
    this.listOfImageChunks = sliceIntoChunks(listOfImages, 4);

    this.newHeader = document.createElement("h1");
    this.newHeader.className = "sectionHeader";
    this.newHeader.innerText = title;
    this.title = title;

    this.divScrollbar = document.createElement("div");
    this.divScrollbar.classList.add("categoryScrollbar");

    this.createSections();

    document.getElementById("imageSlider").appendChild(this.newHeader);
    document.getElementById("imageSlider").appendChild(this.divScrollbar);
  }

  createSections() {
    let count = 1;
    for (const chunk of this.listOfImageChunks) {
      window["section" + count] = document.createElement("section");
      let section = window["section" + count];
      section.id = `section${count}${this.title}`;

      let arrowLeft = document.createElement("a");
      arrowLeft.href = `#section${this.lastSectionNumber(count)}${this.title}`;
      arrowLeft.classList.add("arrowButton", "leftArrow");

      section.appendChild(arrowLeft);

      for (const thumb of chunk) {
        let img = document.createElement("img");
        img.classList.add("movieImages");
        img.src = thumb;

        section.appendChild(img);
      }

      let arrowRight = document.createElement("a");
      arrowRight.href = `#section${this.nextSectionNumber(count)}${this.title}`;
      arrowRight.classList.add("arrowButton", "rightArrow");

      section.appendChild(arrowRight);

      this.divScrollbar.appendChild(section);
      count += 1;
    }
  }

  nextSectionNumber(sectionNumber) {
    if (sectionNumber == this.numberOfSections) {
      return 1;
    } else {
      return sectionNumber + 1;
    }
  }

  lastSectionNumber(sectionNumber) {
    if (sectionNumber == 1) {
      return this.numberOfSections;
    } else {
      return sectionNumber - 1;
    }
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

let topRated = new Imageslider("Top Rated Movies", imgList);
let category1 = new Imageslider("Action", imgList);
let category2 = new Imageslider("Crime", imgList);
let category3 = new Imageslider("Comedy", imgList);

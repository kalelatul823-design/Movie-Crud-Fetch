let cl = console.log;

const spinner = document.getElementById("spinner");
const movieInfo = document.getElementById("movieInfo");
const movieForm = document.getElementById("movieForm");
const movieNameControl = document.getElementById("movieName");
const movieImgControl = document.getElementById("movieImg");
const movieDescriptionControl = document.getElementById("movieDescription");
const movieRatingControl = document.getElementById("movieRating");
const genreControl = document.getElementById("genre");
const backDrop = document.getElementById("backDrop");
const movieModel = document.getElementById("movieModel");
const addBtn = document.getElementById("addBtn");
const closeIcon = document.getElementById("closeIcon");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const createdAtControl = document.getElementById("createdAt");

let BASE_URL =
  "https://fetch-api-crud-c0cc4-default-rtdb.asia-southeast1.firebasedatabase.app";

let MOVIE_URL = `${BASE_URL}/movies.json`;

//state
let locatState = {
  movieArr: [],
  editId: null,
};

//snakBar
function snakBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
}

//spinner
function showHideSpinner() {
  spinner.classList.toggle("d-none");
}

//setRating
function setRating(rating) {
  if (rating > 8) {
    return "badge-success";
  } else if (rating > 5) {
    return "badge-warning";
  } else {
    return "badge-danger";
  }
}

//backDrop and MovieModel
function backDropMovieModel() {
  backDrop.classList.toggle("active");
  movieModel.classList.toggle("active");
  movieForm.reset();
  if (!movieModel.classList.contains("active")) {
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
  }
}

//showUpdateSmallElement
function showUpdateSmallElement(updateId) {
  let col = document.getElementById(updateId);
  let updateSmallElement = col.querySelector(".updatedAt");
  updateSmallElement.classList.remove("d-none");
}

//genric api call
function makeApiCall(url, methodType, msgBody = null) {
  let body = msgBody ? JSON.stringify(msgBody) : null;
  return fetch(url, {
    method: methodType,
    body: body,
    headers: {
      "Content-type": "application/json",
      Authorization: "JWT TOKEN",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      snakBar("Someting went wrong");
    })
    .finally(() => {
      showHideSpinner();
    });
}

//read
function showUi() {
  showHideSpinner();
  makeApiCall(MOVIE_URL, "GET")
    .then((res) => {
      cl(res);
      for (const key in res) {
        res[key].id = key;
        locatState.movieArr.push(res[key]);
        cl(locatState.movieArr);
      }
      templetingUi(locatState.movieArr);
    })
    .catch((err) => {
      snakBar("someting went wrong");
    });
}

//templeting
function templetingUi(arr) {
  let result = "";
  arr.forEach((ele) => {
    result += `<div class="col-md-3 mb-5" id="${ele.id}">
          <div class="card movieCard">
            <div class="card-header">
            <div class="row">
            <div class="col-10">
            <h3 class="m-0">${ele.movieName}</h3>
            <small class="createdAt">Created At: ${ele.createdAt}</small>
            <small class="updatedAt d-none">Updated At : ijfjdjkjjk</small>
            </div>
            <div class="col-2">
             <h4 class="m-0"><span class="badge ${setRating(ele.movieRating)}">${ele.movieRating}</span></h4>
            </div>
            </div>
            </div>
            <div class="card-body">
              <figure>
                <img
                  src="${ele.movieImg}"
                  alt="${ele.movieName}"
                />
                <figcaption>
                  <h3 class="m-0">${ele.movieName}</h3>
                  <p class="m-0">
                    ${ele.movieDescription}
                  </p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button onclick="onEdit(this)" class="btn btn-sm netflix-pri-Color">Edit</button>
              <button onclick="onRemove(this)" class="btn btn-sm netflix-sec-color">Delete</button>
            </div>
          </div>
        </div>`;
  });
  movieInfo.innerHTML = result;
}

showUi();

//create
function onAddMovie(eve) {
  eve.preventDefault();

  let newObj = {
    movieName: movieNameControl.value,
    movieImg: movieImgControl.value,
    movieDescription: movieDescriptionControl.value,
    movieRating: movieRatingControl.value,
    genre: genreControl.value,
    createdAt: createdAtControl.value,
    updatedAt: new Date(),
  };
  showHideSpinner();
  makeApiCall(MOVIE_URL, "POST", newObj)
    .then((data) => {
      cl(data);
      newObj.id = data.name;
      locatState.movieArr.push(newObj);

      let div = document.createElement("div");
      div.id = data.name;
      div.className = `col-md-3 mb-5`;
      div.innerHTML = `<div class="card movieCard">
            <div class="card-header d-flex justify-content-between">
              <div class="row">
            <div class="col-10">
            <h3 class="m-0">${newObj.movieName}</h3>
            <small class="createdAt">Created At: ${newObj.createdAt}</small>
            <small class="updatedAt d-none">Updated At : ijfjdjkjjk</small>
            </div>
            <div class="col-2">
             <h4 class="m-0"><span class="badge ${setRating(newObj.movieRating)}">${newObj.movieRating}</span></h4>
            </div>
            </div>
            </div>
            <div class="card-body">
              <figure>
                <img
                  src="${newObj.movieImg}"
                  alt="${newObj.movieName}"
                />
                <figcaption>
                  <h3 class="m-0">${newObj.movieName}</h3>
                  <p class="m-0">
                    ${newObj.movieDescription}
                  </p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button onclick="onEdit(this)" class="btn btn-sm netflix-pri-Color">Edit</button>
              <button onclick="onRemove(this)" class="btn btn-sm netflix-sec-color">Delete</button>
            </div>
          </div>`;
      movieInfo.append(div);
      backDropMovieModel();
    })
    .catch((err) => {
      snakBar("Something went wrong");
    });
}

//edit
function onEdit(ele) {
  let editId = ele.closest(".col-md-3").id;
  locatState.editId = editId;
  backDropMovieModel();
  let editObj = locatState.movieArr.find((ele) => ele.id === editId);
  movieNameControl.value = editObj.movieName;
  movieImgControl.value = editObj.movieImg;
  movieDescriptionControl.value = editObj.movieDescription;
  movieRatingControl.value = editObj.movieRating;
  genreControl.value = editObj.genre;

  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

//update
function onUpdateMovie(eve) {
  let updateId = locatState.editId;
  let updateUrl = `${BASE_URL}/movies/${updateId}.json`;
  showUpdateSmallElement(updateId)
  let updateObj = {
    movieName: movieNameControl.value,
    movieImg: movieImgControl.value,
    movieDescription: movieDescriptionControl.value,
    movieRating: movieRatingControl.value,
    genre: genreControl.value,
    createdAt: createdAtControl.value,
    updatedAt: new Date().toLocaleString(),
    id: updateId,
  };
  showHideSpinner();
  makeApiCall(updateUrl, "PATCH", updateObj)
    .then((res) => {
      cl(res);
      let getIndex = locatState.movieArr.findIndex(
        (ele) => ele.id === updateId,
      );
      locatState.movieArr[getIndex] = updateObj;
      let div = document.getElementById(updateId);
      cl(div);
      div.innerHTML = `<div class="card movieCard">
            <div class="card-header d-flex justify-content-between">
              <div class="row">
            <div class="col-10">
            <h3 class="m-0">${updateObj.movieName}</h3>
            <small class="createdAt">Created At: ${updateObj.createdAt}</small><br>
            <small class="updatedAt d-none">Updated At : ${updateObj.updatedAt}</small>
            </div>
            <div class="col-2">
             <h4 class="m-0"><span class="badge ${setRating(updateObj.movieRating)}">${updateObj.movieRating}</span></h4>
            </div>
            </div>
            </div>
            <div class="card-body">
              <figure>
                <img
                  src="${updateObj.movieImg}"
                  alt="${updateObj.movieName}"
                />
                <figcaption>
                  <h3 class="m-0">${updateObj.movieName}</h3>
                  <p class="m-0">
                    ${updateObj.movieDescription}
                  </p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button onclick="onEdit(this)" class="btn btn-sm netflix-pri-Color">Edit</button>
              <button onclick="onRemove(this)" class="btn btn-sm netflix-sec-color">Delete</button>
            </div>
          </div>`;
      showUpdateSmallElement(updateId);
      backDropMovieModel();
      locatState.editId = null;
    })
    .catch((err) => {
      snakBar("something went wrong");
    });
}



movieForm.addEventListener("submit", onAddMovie);
addBtn.addEventListener("click", backDropMovieModel);
closeIcon.addEventListener("click", backDropMovieModel);
backDrop.addEventListener("click", backDropMovieModel);
closeBtn.addEventListener("click", backDropMovieModel);
updateBtn.addEventListener("click", onUpdateMovie);

let cl = console.log;

const spinner = document.getElementById("spinner");
const movieInfo = document.getElementById("movieInfo")

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
function setRating(rating){
    if(rating > 8){
        return "badge-success";
    }else if(rating > 5){
        return "badge-warning";
    }else{
        return "badge-danger";
    }
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
        cl(locatState.movieArr)
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
    result += `<div class="col-md-3" id="${ele.id}">
          <div class="card movieCard">
            <div class="card-header d-flex justify-content-between">
              <h3 class="m-0">${ele.movieName}</h3>
              <h4 class="m-0"><span class="badge ${setRating(ele.movieRating)}">${ele.movieRating}</span></h4>
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
              <button class="btn btn-sm netflix-pri-Color">Edit</button>
              <button class="btn btn-sm netflix-sec-color">Delete</button>
            </div>
          </div>
        </div>`;
  });
  movieInfo.innerHTML = result;
}

showUi();

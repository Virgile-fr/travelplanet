// SELECTORS ///
let id = (id) => document.getElementById(id);
const erreur = id("error");
const goodC = id("good");
const form = id("form");
const user = id("user");
const site = id("site");
const pwd = id("pwd");
const submit = id("submit");

//SUBMIT ACTION -> GET TOKEN //
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let password = pwd.value;
  let siteID = site.value;
  let userID = user.value;
  getToken(password, siteID, userID);
});

// ASK FOR JSON BUTTON -> FETCH JSON //
function askForJson() {
  const travelButton = id("travelbutton");
  travelButton.addEventListener("click", () => {
    // console test // test the token format for traveler info fetching
    console.log({ access_token: JSON.parse(localStorage.getItem("data")) });
    // set request options
    const optionsGetJson = {
      method: "GET",
      Params: { access_token: JSON.parse(localStorage.getItem("data")) },
      headers: { "Content-Type": "application/json" }, };
    // set request url
    const urlGetJson = "https://api.qal.travelplanet.click/profils_v2/v1/profil/booking-rules/travellers-list/";
    // request the JSON
    fetch(urlGetJson, optionsGetJson)
      .then((res) => res.json())
      .then((json) => console.log(json));
  });
}

// SHOW HTML ERROR - ERASE GOOD CREDENTIALS //
function error() {
  goodC.classList.remove("show");
  goodC.classList.add("hide");
  erreur.classList.remove("hide");
  erreur.classList.add("show");
}

// HIDE LOGIN / SHOW GOOD CREDENTIALS MESSAGE / SHOW ASK FOR JSON BUTTON / CALL LISTENER FUNCTION ON BUTTON
function good(name) {
  erreur.classList.remove("show");
  erreur.classList.add("hide");
  form.classList.add("hide");
  goodC.classList.remove("hide");
  goodC.classList.add("show");
  goodC.insertAdjacentHTML(
  "beforeend",
  `<h1><b>👋 Hello.</b> ${user.value} </h1>
  <p>connection réussie</p>
  <button id='travelbutton'>Ask for Json</button>`
  );
  askForJson();
}

// FUNCTION IF FETCHING ERROR --> EXECUTE SHOW HTML ERROR
function handleErrors(response) {
  if (!response.ok) {
    error();
    throw Error(response.statusText);
  } else { good();
    return response;
  }
}

// GET TOKEN FUNCTION
function getToken(password, siteID, userID) {
  //credentials test
  console.log(siteID);
  console.log(userID);
  console.log(password);
  //set token fetch options
  const optionsGetToken = {
    method: "POST",
    body: JSON.stringify({
      site_id: siteID,
      user_id: userID,
      password: password,
    }),
    headers: { "Content-Type": "application/json" },
  };
  //set token fetch url
  const urlGetToken = "https://api.qal.travelplanet.click/auth/v1/click";
  //fetch token
  fetch(urlGetToken, optionsGetToken)
    .then((res) => res.json())
    // store token
    .then((json) => localStorage.setItem("data", JSON.stringify(json.token)));
    // store token in variable
    const data = JSON.parse(localStorage.getItem("data"));
  // FETCH TOKEN ERROR
  fetch(urlGetToken, optionsGetToken)
    // call function handleErrors
    .then(handleErrors)
    .then((response) => console.log("ok"))
    .catch((error) => console.log(error));
} //end function getToken

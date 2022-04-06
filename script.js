// 📌 SELECTORS
let id = (id) => document.getElementById(id);
const erreur = id("error");
const goodC = id("good");
const form = id("form");
const user = id("user");
const site = id("site");
const pwd = id("pwd");
const submit = id("submit");

// 👁 SUBMIT ➡️ 💾 CREDENTIALS ➡️ 🚀 getToken W credentials
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let password = pwd.value;
  let siteID = site.value;
  let userID = user.value;
  getToken(password, siteID, userID);
});

// OBTENTION TOKEN ➡️ 💾 TOKEN in LOCAL STORAGE ➡️ 🚀 ifNoError
function getToken(password, siteID, userID) {
  //show credentials on console
  console.log(siteID); console.log(userID); console.log(password);
  //set token fetch options
  const optionsGetToken = {
    method: "POST",
    body: JSON.stringify({
      site_id: siteID,
      user_id: userID,
      password: password,
    }),
    headers: { "Content-Type": "application/json" }
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
  // fetch for errors
  fetch(urlGetToken, optionsGetToken)
    // call function ifNoError
    .then(ifNoError)
    .then((response) => console.log("ok"))
    .catch((error) => console.log(error));
}

// if error ➡️ 🚀 error // if no error ➡️ 🚀 showAskJson
function ifNoError(response) {
  if (!response.ok) {
    error();
    throw Error(response.statusText);
  } else { showAskJson();
    return response;
  }
}

// 💥 Show error message
function error() {
  goodC.classList.remove("show");
  goodC.classList.add("hide");
  erreur.classList.remove("hide");
  erreur.classList.add("show");
}

// 💥 Show Ask Json page ➡️ 🚀 AskForJson
function showAskJson(name) {
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

// 👁 ask json button ➡️ 🚀 AskForJsonUrl
function askForJson() {
  const travelButton = id("travelbutton");
  travelButton.addEventListener("click", () => {
    askForJsonUrl()
  });
}

// 💾 Json url ➡️ 🚀 download W url
function askForJsonUrl() {
    let tokenString = JSON.parse(localStorage.getItem("data"));
    const params = `access_token=${tokenString}`;
    const urlGetJson = `https://api.qal.travelplanet.click/profils_v2/v1/profil/booking-rules/travellers-list?${params}`;
    download(urlGetJson);
};

// 💥💾 JSON
function download(url) {
  fetch(url)
    .then(async (response) => {
      let clone = response.clone();
      let res = await clone.json();
      console.log(res);
      return response.blob();
    })
    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = `${user.value}'s travellers.json`;
      a.click();
    })
    .catch(function (err) {
      console.error(err);
    });
};

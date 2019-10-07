const tasteDiveApi = "347272-recommen-FAY8D5B1";
const tasteDiveUrl =
  "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?";
const booksUrl = "https://www.googleapis.com/books/v1/volumes?";
const colors = [
  "ffbbcc",
  "b2e4d5",
  "f7be16",
  "8ac6d1",
  "c05c7e",
  "e5b0ea",
  "ff8080",
  "d6e4aa",
  "7f78d2",
  "64c4ed",
  "b18ea6",
  "00818a"
];

function watchForm() {
  $("#ellips")
    .find("div")
    .addClass("hidden");
  $("form").submit(event => {
    $("#ellips")
      .find("div")
      .removeClass("hidden");
    event.preventDefault();
    let searchTerm = $("#js-search-term").val();
    let searchType = $("#contentType").val();
    getRecommendations(searchTerm, searchType);
  });
}

function getRecommendations(search, type) {
  const params = {
    q: search,
    k: tasteDiveApi,
    limit: 12,
    info: 1,
    type
  };
  const queryString = formatQueryParams(params);
  const url = tasteDiveUrl + queryString;
  fetchData(url);
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function fetchData(url) {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  $("main").removeClass("hidden");
  let results = responseJson["Similar"]["Results"];

  if (results.length === 0) {
    noResults();
    animateResults();
  } else {
    let searchInfo = responseJson["Similar"]["Info"][0]["wTeaser"];
    let searchInfoWiki = responseJson["Similar"]["Info"][0]["wUrl"];
    let type = responseJson["Similar"]["Results"][0]["Type"];
    beforeResultsInfo(searchInfo, searchInfoWiki, type);
    appendLisWithResults(results);
    animateResults();
  }
}

function noResults() {
  $(".section-one").empty();
  $(".section-one").append(
    `<h3 id='head-search'>We weren't able to find anything! :(</h3>
        <p>Try to refrase your search parametr. Make sure to select a type of a content you are looking for.</p>`
  );
}

function beforeResultsInfo(searchInfo, searchInfoWiki, type) {
  $(".section-one").empty();
  if (type != "music") {
    $(".section-one").append(
      `<h3 id='head-search'>You've got an excelent taste! Wow!</h3>
          <p>So, ${searchInfo} <a href='${searchInfoWiki}' target="_blank">Read more..</a></p>
          
          <h3 id='foot-search'>And here is a selection of some ${type}s you may also like. Take a look:</h3>`
    );
  } else {
    $(".section-one").append(
      `<p>You've got an excelent taste! Wow!
            <br>So, ${searchInfo}</p>
            <a href='${searchInfoWiki}' target="_blank">Read more..</a>
            <p>And here is a selection of some ${type} you may also like. Take a look:</p>`
    );
  }
}

function appendLisWithResults(results) {
  $(".section-two").empty();
  for (let i = 0; i < results.length; i++) {
    let title = results[i]["Name"];
    let wiki = results[i]["wUrl"].replace(/^http:\/\//i, "https://");
    let info = results[i]["wTeaser"];
    $(".section-two").append(
      `<li><h3 style="border-bottom: 8px solid #${colors[i]};">${title}</h3>
          <p>${info}</p>
          <br>
          <button type='button' class='slideButton' style="border-bottom: 3px solid #${colors[i]};">More</button>
          <iframe src='${wiki}' class='webFrame'></iframe>
          <a href='${wiki}' id='mobile-version-wiki-link' style="border-bottom: 3px solid #${colors[i]};" target="_blank">More</a>
          </li>`
    );
  }
}

function animateResults() {
  $("#ellips")
    .find("div")
    .addClass("hidden");
  $("html, body").animate(
    {
      scrollTop: $("main").offset().top
    },
    900
  );

  $(".slideButton").click(function() {
    $(this)
      .parents("li")
      .toggleClass("bigClass");
    $("html, body").animate(
      {
        scrollTop: $(this)
          .parents("li")
          .offset().top
      },
      400
    );
    $(this)
      .siblings(".webFrame")
      .slideToggle("slow", function() {});
  });
}

$(watchForm);

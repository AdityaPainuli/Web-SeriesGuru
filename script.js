//API
const APIURL = 'http://api.tvmaze.com/shows';
const HOMEURL = `${APIURL}/shows`;
const SEARCHAPI = 'http://api.tvmaze.com/search/shows?q=';
const DescriptionAPI = 'http://api.tvmaze.com/lookup/shows?thetvdb=';



//Dom ELements
const form = document.getElementById('form');
const section = document.querySelector('section');

const searchInput = document.getElementById('search');
const main = document.querySelector('main');

async function getSeries(url) {
  try {
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData);
    main.innerHTML = '';
    //Fetch all Information
    const divEL = document.createElement('div');
    divEL.classList.add('container');
    divEL.innerHTML = '';
    respData.forEach((series) => {
      const boxEL = document.createElement('div');
      boxEL.classList.add('box');
      boxEL.innerHTML = `
        <img
          src="${series.image.medium}"
          ,
          alt="${series.name}"
        />
          <a onclick = "getDetails(${series.externals.thetvdb},${series.id})"></a>

      `;
      divEL.appendChild(boxEL);
    });

    main.appendChild(divEL);
    return respData;
  }
  catch (error) {
    const divEL = document.createElement('div');
    divEL.classList.add('container');
    divEL.innerHTML = `
      < h3 > Something went wrong..</h3 >
        `;
    main.appendChild(divEL);
  }
}


function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = searchInput.value;

  if (searchTerm === '') {
    getSeries(APIURL);
  }

  if (searchTerm) {
    try {
      getSearchSeries(`${SEARCHAPI}${searchTerm}`);

      searchInput.value = "";
    } catch (error) {
      console.log(error);
    }
  }
});

async function getSearchSeries(url) {

  const resp = await fetch(url);
  const respData = await resp.json();
  console.log(respData);
  main.innerHTML = '';
  //Fetch all Information
  const divEL = document.createElement('div');
  divEL.classList.add('container');
  divEL.innerHTML = '';
  try {
    respData.forEach((series) => {
      const boxEL = document.createElement('div');
      boxEL.classList.add('box');
      boxEL.innerHTML = `
        <img src = "${series.show.image.medium}"
      alt = "${series.show.name}"
      />

      <a onclick="getDetails(${series.show.externals.thetvdb},${series.show.id})"></a>

    `;
      divEL.appendChild(boxEL);
    });

    main.appendChild(divEL);
    return respData;
  }
  catch (error) {
    console.log(error);
  }



}
//Overview and Details Panel..
function getDetails(id, mainId) {
  sessionStorage.setItem('movieId', id);
  sessionStorage.setItem('mainId', mainId);
  window.location = 'overview.html';
  window.location = 'overview.html'
  return false;
}

async function getDescription() {
  let movieId = sessionStorage.getItem('movieId');
  let mainMovieId = sessionStorage.getItem('mainId');
  const resp = await fetch(DescriptionAPI + movieId);
  const respData = await resp.json();
  //More Information..
  const resp3 = await fetch(`${APIURL}/${mainMovieId}/images`);
  const respData3 = await resp3.json();
  const resp1 = await fetch(`${APIURL}/${mainMovieId}/episodes`);
  const respData1 = await resp1.json();
  const resp2 = await fetch(`${APIURL}/${mainMovieId}/cast`);
  const respData2 = await resp2.json();
  console.log(respData3);

  section.innerHTML = `
      <div class="description-main" >
        <section class = 'background' style = "background:url(${respData.image.original})no-repeat center center/cover;background-attachement:fixed;"></section>
        <div class = "info-main-grid">
        <img src = "${respData.image.medium}" alt = "${respData.name}" />
        
        <div class="primary-info">
          <h1>${respData.name}</h1>

           ${respData.summary}

          <button class="btn-primary">
            <a href="${respData.officialSite}">Go to Official Site.</a>
          </button>
        </div>
        
        </div>
      </div >
      <div class="secondary-information">
        <h1>Basic Information</h1>
        <span>
          <ul>
            <strong>Genre:</strong>
            <li>${respData.genres[0]}</li>
            <li>${respData.genres[1]}</li>
            <li>${respData.genres[2]}</li>
          </ul>
        </span>
        <strong>Languge: <span>${respData.language}</span></strong>
        <strong>Runtime: <span>${respData.runtime}</span></strong>
        <strong>Status:<span>${respData.status}</span></strong>
      </div>
    `;

  // Cast Persons
  const sectionpr = document.createElement('div');
  sectionpr.classList.add('section-cast');
  const secDiv = document.createElement('div');
  secDiv.classList.add('grid-cast');
  sectionpr.innerHTML = `<h1> Images of Cast member of ${respData.name}</h1 > `;
  try {
    respData2.forEach((castMember) => {

      const DivEL = document.createElement('div');
      DivEL.classList.add('cast-box');
      const ImgEl = document.createElement('img');
      ImgEl.src = castMember.person.image.medium;
      const info = document.createElement('div');
      info.classList.add('info-cast');
      info.innerHTML = `
      <h1> ${castMember.person.name}</h1 >
        <span>Character Name: ${castMember.character.name}<span>;
        `


      DivEL.appendChild(ImgEl);
      DivEL.appendChild(info);
      secDiv.appendChild(DivEL);
    });

  }
  catch (error) {
    console.log(error);
  }
  sectionpr.appendChild(secDiv);
  section.appendChild(sectionpr);

  //Episodes
  const episodeDiv = document.createElement('div');
  episodeDiv.classList.add('episodes-section');
  const secEpiDiv = document.createElement('div');
  secEpiDiv.classList.add('episodes-grid');
  episodeDiv.innerHTML = `<h1>Episodes of ${respData.name}</h1>`;
  try {
    respData1.forEach((episode) => {
      const DivEL = document.createElement('div');
      DivEL.classList.add('episode');
      DivEL.innerHTML = `
        <img src = "${episode.image.medium}" alt = "${respData.name}"/>
        <div class = "episode-info">
        <h1>${episode.name}</h1>
        ${episode.summary}
        <ul>
        <li><strong>Episode:${episode.season}</strong></li>
        <li>Runtime: ${episode.runtime}</li>
        </ul>
        </div>

      `;
      secEpiDiv.appendChild(DivEL);
    });
  }
  catch (error) {
    console.log(error);
  }
  episodeDiv.appendChild(secEpiDiv);
  section.appendChild(episodeDiv);
  // Images
  const DivEL = document.createElement('div');
  const secEl = document.createElement('div');
  DivEL.classList.add('gallery');
  secEl.classList.add('grid-main');
  secEl.innerHTML = `<h1>Images of ${respData.name}</h1>`
  try {
    respData3.forEach((seriesImg) => {
      const imageEL = document.createElement('img');
      imageEL.src = seriesImg.resolutions.original.url;


      DivEL.appendChild(imageEL);
    });
  }
  catch (error) {
    console.log(error);
  }
  secEl.appendChild(DivEL);
  section.appendChild(secEl);
  document.body.appendChild(section);
  console.log(123);




  return respData;

}
getSeries(APIURL);
//Theme-changer
const toggleTheme = document.getElementById('theme-toggle');

toggleTheme.addEventListener('click', (e) => {
  document.body.classList.toggle('purple');
  toggleTheme.classList.toggle('dark');
});
//Footer Addition
const footerEl = document.createElement('footer');

footerEl.innerHTML = 'WebSeries GURU &copy; ALL Right Reserved 2020-21';
document.body.appendChild(footerEl);

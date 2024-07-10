const API_KEY = `0aae60967edd4c56b1638d815f1f994c`;
let newsList = [];

// 뉴스 리스트를 가져오는 함수
const getLatestNews = async () => {
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  //const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log(newsList);
  // 뉴스 내용들이 모두 받아진 뒤에 그려야 하므로 getLatestNews함수 안에서 render()를 호출함
  render();
}

getLatestNews();


// 뉴스를 그려주는 함수
const render = () => {
  const newsHTML = newsList.map(news => `
    <div class="row news-item">
      <div class="col-lg-4">
        <img class="news-image" src=${news.urlToImage}>
      </div>
      <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>${news.description}</p>
        <div>${news.source.name} * ${news.publishedAt}</div>
      </div>
    </div><!--row-->`).join('');

  document.getElementById("news-list").innerHTML = newsHTML;
}







// 모바일 버전 nav
function openNav(){
  document.getElementById('side-menu').style.width = "200px"
}

function closeNav(){
  document.getElementById('side-menu').style.width = "0";
}

function openSearch(){
  let inputBox = document.querySelector('.input-box');
  if (inputBox.style.display == "none"){
    inputBox.style.display = "inline";
  } else {
    inputBox.style.display = "none";
  }
}

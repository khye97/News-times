const API_KEY = `0aae60967edd4c56b1638d815f1f994c`;
let newsList = [];

// 뉴스 리스트를 가져오는 함수
const getLatestNews = async () => {
  //const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
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
        <img class="news-image" onerror="this.src='image/no_img.jpg'; this.onerror=null;" src=${news.urlToImage == null
          ? "image/no_img.jpg" : news.urlToImage}>
      </div>
      <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
          ${news.description == null || news.description == ""
            ? "내용없음"
            : news.description.length > 200
            ? news.description.substring(0, 200) + "..."
            : news.description}
        </p>
        <div>${news.source.name == null || news.source.name == ""
              ? news.source.name = "no source" : news.source.name} * ${moment(news.publishedAt).fromNow()}</div>
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
  //let inputBox = document.querySelector('.input-box');
  if (document.querySelector('.input-box').style.display == "none"){
    document.querySelector('.input-box').style.display = "inline";
  } else {
    document.querySelector('.input-box').style.display = "none";
  }
}

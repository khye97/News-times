const API_KEY = `0aae60967edd4c56b1638d815f1f994c`;
let newsList = [];
const menus = document.querySelectorAll('.menus button');
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
//let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);


// 코드 리팩토링 : 많은 부분에서 겹치는 코드를 한 곳에 모아 함수로 만듦
const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // 통신 결과가 200이면 정상, 200이 아니면 에러 상황
    // 결과가 200이면 정상적으로 보여줌
    if (response.status == 200){
      // 통신 결과는 정상이지만 검색 결과가 0일 경우
      if (data.articles.length == 0){
        throw new Error ("No result for this search");
      }
      // 뉴스 그려주는 함수를 쓰기 전에 항상 newsList를 지금 받아온 뉴스로 업데이트 해 줘야 한다
      newsList = data.articles;
      // 뉴스 내용들이 모두 받아진 뒤에 그려야 하므로 getLatestNews함수 안에서 render()를 호출함
      render();
    } else {
      // 통신 결과가 200이 아니면 에러 던짐
      throw new Error (data.message);
    }
  } catch (error){
    errorRender(error.message);
  }
}

// 뉴스 리스트를 가져오는 함수(기본 첫 화면 뉴스)
const getLatestNews = async () => {
  url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  //url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  getNews();
}

getLatestNews();




// 메뉴 버튼에 클릭 이벤트 달기
menus.forEach(menu => {
  menu.addEventListener('click', (event) => {getNewsByCategory(event)});
})

// 카테고리별 뉴스 불러오기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`);
  //url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
  getNews();
}


// 검색 버튼에 클릭이벤트 달기 
document.querySelector('.go-btn').addEventListener('click', () => searchKeyword());

// 키워드 뉴스 검색
const searchKeyword = async () => {
  let keyword = document.getElementById('search-input').value;
  url = new URL(`https://newsapi.org/v2/top-headlines?q=${keyword}&country=us&apiKey=${API_KEY}`);
  //url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  getNews();
}




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


const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
                      ${errorMessage}
                    </div>`
  document.getElementById('news-list').innerHTML = errorHTML;
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

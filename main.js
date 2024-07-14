let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);

const APT_KEY = `0aae60967edd4c56b1638d815f1f994c`;
//let url = new URL (`https://newsapi.org/v2/top-headlines?country=us&apiKey=${APT_KEY}`);
let newsList = [];
const menus = document.querySelectorAll('.menus button');
const sideMenus = document.querySelectorAll('.side-menu-items a');
const searchValue = document.getElementById('search-input');
let menuBtn = document.querySelectorAll('.menu-btn');
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;



// 데스크탑 네비게이션 메뉴 클릭 효과
for (let i = 0; i < menuBtn.length; i++){
  $('.menu-btn').eq(i).on('click', function(){
    $('.menu-btn').removeClass('clicked');
    $('.menu-btn').eq(i).addClass('clicked');
  })
}


// 각 메뉴 버튼에 카테고리 함수 부착
menus.forEach(menu => menu.addEventListener('click', (event) => getNewsByCategory(event)));


// 검색 버튼에 키워드 검색 함수 부착
document.querySelector('.go-btn').addEventListener('click', () => searchKeyword());


// 엔터키 입력시 검색 
document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchKeyword();
  }
});


// 메인 로고 클릭시 최초 뉴스 재로드
document.getElementById('main-logo').addEventListener('click', () => {
  getLatestNews()
  for (let i = 0; i < menuBtn.length; i++){
    document.querySelectorAll('.menu-btn')[i].classList.remove('clicked');
  }
});


// 뉴스 가져오는 함수
const getNews = async () => {
  try {
    // url 뒤에 파라미터(페이지 정보) 붙이는 코드
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();

    // 통신 결과가 200이면 정상, 200이 아니라면 에러
    if (response.status === 200){
      // 통신 결과는 정상이지만 검색 결과가 0일 경우
      if (data.articles.length === 0){
        document.querySelector('.pagination').style.display = "none";
        throw new Error ("No result for this search");
      }
      // render() 함수 쓰기 전에 항상 newList를 지금 받아온 뉴스로 업데이트 해줘야함
      newsList = data.articles;
      totalResults = data.totalResults;
      // 뉴스가 모두 받아진 후 그려야 하므로 getLatestNews() 안에서 render() 호출
      render();
      paginationRender();
    } else {
      throw new Error (data.message);
    }
  } catch (error){
    errorRender(error.message);
  }
  
}


// 최초 뉴스 로드
const getLatestNews = async () => {
  page = 1;
  //url = new URL (`https://newsapi.org/v2/top-headlines?country=us&apiKey=${APT_KEY}`);
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  await getNews();
}


// 카테고리별 뉴스 검색
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  page = 1;
  //url = new URL (`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${APT_KEY}`);
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
  await getNews();
}


// 키워드별 뉴스 검색
const searchKeyword = async () => {
  const keyword = document.getElementById('search-input').value;
  page = 1;
  if (keyword == ""){
    alert('검색어를 입력하세요');
  }
  //url = new URL (`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${APT_KEY}`);
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  await getNews();
  searchValue.value = "";
}


// 뉴스 그려주는 함수
const render = () => {
  const newsHTML = newsList.map(news => `<div class="row news-item">
    <div class="col-lg-4 image-box">
      <img class="news-image" onerror="this.src='image/no_img.jpg'; this.onerror=null;" src=${news.urlToImage == null
        ? "image/no_img.jpg" : news.urlToImage}>
    </div>
    <div class="col-lg-8">
      <a href=${news.url} target=_blank class="title"><h2>${news.title}</h2></a>
      <p>${news.description == null || news.description == ""
        ? "내용없음"
        : news.description.length > 200
        ? news.description.substring(0, 200) + "..."
        : news.description}</p>
      <div>${news.source.name == null || news.source.name == ""
        ? news.source.name = "no source" : news.source.name} * ${moment(news.publishedAt).fromNow()}</div>
    </div>
  </div>`).join('');

  document.getElementById('news-list').innerHTML = newsHTML;
}


// 에러 핸들링 함수
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger error-message" role="alert">${errorMessage}</div>`

  document.getElementById('news-list').innerHTML = errorHTML;
}


// 페이지네이션 함수
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages){
    lastPage = totalPages;
  }
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let paginationHTML = ``;

  // 이전 페이지로
  if (page >= 2){
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt&lt</a></li>
    <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt</a></li>`;
  }
  
  for (let i = firstPage; i <= lastPage; i++){
    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
  }

  // 다음 페이지로
  if (lastPage < totalPages || page <= totalPages - 1){
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#">&gt</a></li>
    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#">&gt&gt</a></li>`;
  }
  
  

  document.querySelector('.pagination').innerHTML = paginationHTML;
}

// totalResult : 전체 데이터의 개수
// totalPages : 총 몇개의 페이지가 필요한지
// page : 현재 보고있는(선택된) 페이지
// pageSize : 한 페이지에서 보여줄 데이터 개수
// groupSize : 페이지를 몇 개씩 끊어서 보여줄건지
// pageGroup : 현재 보고있는 페이지가 속한 그룹
// lastPage : 현재 속한 그룹의 마지막 페이지
// firstPage : 현재 속한 그룹의 첫 번째 페이지


// 페이지 이동 함수
const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
}


// 모바일 버전 nav
function openNav(){
  document.getElementById('side-menu').style.width = "200px"
}

function closeNav(){
  document.getElementById('side-menu').style.width = "0";
}

// 모바일 버전 메뉴에 클릭 이벤트
sideMenus.forEach(menu => {
  menu.addEventListener('click', (event) => {
    getNewsByCategory(event)
    document.getElementById('side-menu').style.width = "0";
  });
});

// 검색창 열고닫는 함수
function openSearch(){
  //let inputBox = document.querySelector('.input-box');
  if (document.querySelector('.input-box').style.display == "none"){
    document.querySelector('.input-box').style.display = "inline";
  } else {
    document.querySelector('.input-box').style.display = "none";
  }
}

getLatestNews();
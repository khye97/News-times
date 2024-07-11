const API_KEY = `0aae60967edd4c56b1638d815f1f994c`;
let newsList = [];
const menus = document.querySelectorAll('.menus button');
const sideMenus = document.querySelectorAll('.side-menu-items a');
const searchValue = document.getElementById('search-input');
//let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
let totalPages = 1;



// 코드 리팩토링 : 많은 부분에서 겹치는 코드를 한 곳에 모아 함수로 만듦
const getNews = async () => {
  try {
    // url 뒤에 파라미터(페이지 정보)를 붙이는 코드
    url.searchParams.set("page", page); // &page=page
    url.searchParams.set("pageSize", pageSize);  // &pageSize=pageSize
    const response = await fetch(url);
    const data = await response.json();
    //console.log(data);
    // 통신 결과가 200이면 정상, 200이 아니면 에러 상황
    // 결과가 200이면 정상적으로 보여줌
    if (response.status == 200){
      // 통신 결과는 정상이지만 검색 결과가 0일 경우
      if (data.articles.length == 0){
        page = 0; //여기 추가
        totalPages = 0; // 여기추가
        paginationRender(); // 여기추가
        throw new Error ("No result for this search");
      }
      // 뉴스 그려주는 함수를 쓰기 전에 항상 newsList를 지금 받아온 뉴스로 업데이트 해 줘야 한다
      newsList = data.articles;
      totalResults = data.totalResults;
      // 뉴스 내용들이 모두 받아진 뒤에 그려야 하므로 getLatestNews함수 안에서 render()를 호출함
      //totalPages = Math.ceil(data.totalResults / pageSize);
      render();
      paginationRender();
    } else {
      // 통신 결과가 200이 아니면 에러 던짐
      page = 0; //여기 추가
      totalPages = 0; // 여기추가
      //paginationRender(); // 여기추가
      throw new Error (data.message);
    }
  } catch (error){
    errorRender(error.message);
    page = 0; //여기 추가
    totalPages = 0; // 여기추가
    //paginationRender(); // 여기추가
  }
}



// 뉴스 리스트를 가져오는 함수(기본 첫 화면 뉴스)
const getLatestNews = async () => {
  page = 1; // 여기 추가
  //url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  getNews();
}



// 메인 로고 클릭하면 기본 뉴스 화면으로 돌아옴
document.getElementById('main-logo').addEventListener('click', function(){
  getLatestNews();
});

// 메뉴 버튼에 클릭 이벤트
menus.forEach(menu => {
  menu.addEventListener('click', (event) => {getNewsByCategory(event)});
});

// 모바일 버전 메뉴에 클릭 이벤트
sideMenus.forEach(menu => {
  menu.addEventListener('click', (event) => {getNewsByCategory(event)});
});

// 카테고리별 뉴스 불러오기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  page = 1; // 여기 추가
  //url = new URL(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`);
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
  getNews();
}



// 검색 버튼에 클릭이벤트 달기 
document.querySelector('.go-btn').addEventListener('click', () => searchKeyword());

// 키워드 뉴스 검색
const searchKeyword = async () => {
  let keyword = document.getElementById('search-input').value;
  page = 1;
  if (keyword == ""){
    alert('검색어를 입력하세요');
  }
  //url = new URL(`https://newsapi.org/v2/top-headlines?q=${keyword}&country=us&apiKey=${API_KEY}`);
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  getNews();
  searchValue.value = "";
}

// 엔터키 입력시 검색 
document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchKeyword();
  }
});




// 뉴스를 그려주는 함수
const render = () => {
  const newsHTML = newsList.map(news => `
    <div class="row news-item">
      <div class="col-lg-4">
        <img class="news-image" onerror="this.src='image/no_img.jpg'; this.onerror=null;" src=${news.urlToImage == null
          ? "image/no_img.jpg" : news.urlToImage}>
      </div>
      <div class="col-lg-8">
        <a href="${news.url}" target="_blank"><h2>${news.title}</h2></a>
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



// 에러처리 함수
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
                      ${errorMessage}
                    </div>`
  document.getElementById('news-list').innerHTML = errorHTML;
}



// 페이지네이션 함수
const paginationRender = () => {
  let paginationHTML = ``;
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  totalPages = Math.ceil(totalResults / pageSize);
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  if (lastPage > totalPages){
    lastPage = totalPages;
  }

  if (firstPage >= 6){
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt&lt</a></li>
  <li class="page-item prev" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt</a></li>`
  }

  for (let i = firstPage; i <= lastPage; i++){
    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`
  }

  if (lastPage < totalPages){
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#">&gt</a></li>
  <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#">&gt&gt</a></li>`;
  }

  // if (lastPage < totalPages) {
  //   paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
  //                       <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
  //                      </li>
  //                      <li class="page-item" onclick="moveToPage(${totalPages})">
  //                       <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
  //                      </li>`;
  // }



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
// paginationRender 함수 내 li onclick에서 사용
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

function openSearch(){
  //let inputBox = document.querySelector('.input-box');
  if (document.querySelector('.input-box').style.display == "none"){
    document.querySelector('.input-box').style.display = "inline";
  } else {
    document.querySelector('.input-box').style.display = "none";
  }
}


getLatestNews();
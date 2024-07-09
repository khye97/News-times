const API_KEY = `0aae60967edd4c56b1638d815f1f994c`;
let news = [];


const getLatestNews = async () => {
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log(news);
}

getLatestNews();
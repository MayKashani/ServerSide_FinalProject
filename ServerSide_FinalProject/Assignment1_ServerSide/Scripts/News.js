//$(document).ready(function () {


//    key = "e9657119e6324c7daa3dd0d6d06567a1";
//    url = "https://newsapi.org/";
//    method = "v2/everything?q=movie&from=2021-05-21&sortBy=publishedAt&";
//    api_key = "apikey=" + key + "&";
//    source = "source=google-news";
//    getNews();

//});

//function getNews() {

//    let apiCall = url + method + api_key + source;
//    ajaxCall("GET", apiCall, "", getNewsSuccessCB, getNewsErrorCB);
//}

//function getNewsSuccessCB(news) {
//    console.log(news)



//    const cont = document.getElementById("news");
//    for (const news_item of news) {
//        cont.appendChild(createNewsItemEl(news_item));

//    }
   
//}

//function getNewsErrorCB(err) {
//    console.log(err);
//}

////const dog = { name: "tributo", age: 10 };
////const { age } = dog;(=10)

//const getNews1 = async () => {

//    const url = `https://newsapi.org/v2/everything?q=movie&from=2021-05-21&sortBy=publishedAt&apiKey=e9657119e6324c7daa3dd0d6d06567a1&source=google-news`;
//    const res = await fetch(url); //פונקציה שיש בדפדפן המקבלת כתובת ומחזירה את התוכן שלו.
//    // await תמשיך לשורה הבאה רק כאשר התוכן נטען במלואו
//    const { articles } = await res.json();  //לוקחים רק את articles מבין כל השדות שיש בכתובת.
//    return articles;
//};

//const createNewsItemEl = ({ description, title, url, urlToImage }) => {
//    const d = document.createElement("div");
//    d.innerHTML = `
//<div><a href="${url}" target="_blank">${title}</a><div>
//<div>${description}<div>
//<img src="${urlToImage}" style="width:100px"/>

//`;
//    return d;
//};

//getNews1().then((news) => { // שיטה מודרנית לפונקצית הצלחה
//    console.log(news)
//    const cont = document.getElementById("news");
//    for (const news_item of news) {
//        cont.appendChild(createNewsItemEl(news_item));

//    }
//}).catch(console.error);
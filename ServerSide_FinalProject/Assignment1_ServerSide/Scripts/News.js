﻿
    //const dog = {name: "tributo", age: 10 };
        //const {age} = dog;(=10)



        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() - 1;

        const getNews1 = async () => {

            const url = "https://newsapi.org/v2/everything?domains=mtv.com,ew.com&q=movies&q=movie&q=film&q=trailer&q=tv&q=series&from=" + currentMonth + "&sortBy=publishedAt&apiKey=e9657119e6324c7daa3dd0d6d06567a1&language=en";
            const res = await fetch(url); //פונקציה שיש בדפדפן המקבלת כתובת ומחזירה את התוכן שלו.
            // await תמשיך לשורה הבאה רק כאשר התוכן נטען במלואו
            const {articles} = await res.json();  //לוקחים רק את articles מבין כל השדות שיש בכתובת.
            return articles;
        };

        const createNewsItemEl = ({description, title, url, urlToImage}) => {
            const d = document.createElement("div");
            d.innerHTML = `
            <div><a href="${url}" target="_blank" ><h2>${title}</h2></a><div>
            <div><h5>${description}</h5><div>
            <img src="${urlToImage}" style="width:300px" />     
            <hr class="solid">
                `
                ;
            return d;
        };

    getNews1().then((news) => { // שיטה מודרנית לפונקצית הצלחה
    console.log(news)

            const cont = document.getElementById("news");
            for (const news_item of news) {
                cont.appendChild(createNewsItemEl(news_item));

            }
        }).catch(console.error);


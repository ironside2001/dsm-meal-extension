// Variables

// dateNow: Date 객체. 출력되어 있는 날짜 정보를 담고 있음.
// menu: dateNow의 메뉴 정보를 담고 있는 객체.

let meal = {date: new Date(), menu: new Object()};

console.log(chrome.storage);

updateMenu(true);

document.getElementById("button-yesterday").addEventListener("click", onClickYesterday);
document.getElementById("button-tomorrow").addEventListener("click", onClickTomorrow);
document.getElementById("button-size").addEventListener("click", onClickSize);

chrome.storage.local.set({size: 12});

function onClickYesterday() {
    meal.date.setDate(meal.date.getDate() - 1);
    updateMenu(true);
}

function onClickTomorrow() {
    meal.date.setDate(meal.date.getDate() + 1);
    updateMenu(true);
}

function onClickSize() {
    chrome.storage.local.get("size", function(items) {
        let newSize = 12;
        switch(items.size) {
            case 8: newSize = 12;
            case 12: newSize = 16;
            case 16: newSize = 8;
        }

        chrome.storage.local.set({size: newSize});
        document.querySelector("*").style.fontSize = newSize;
        document.getElementById("button-size").innerHTML = newSize + "px";
    });
}

function updateMenu(print) {
    let year = meal.date.getFullYear().toString();
    let month = (meal.date.getMonth() + 1).toString();
    let date = meal.date.getDate().toString();

    month = month.length == 1 ? "0" + month : month;
    date = date.length == 1 ? "0" + date : date;

    let url = `http://dsm2015.cafe24.com/meal/${year}-${month}-${date}`;

    axios.get(url)
    .then(response => {
        meal.menu = JSON.parse(JSON.stringify(response.data));
        if(print == true) printMenu();
    })
    .catch(err => {
        console.log(err);
    })
}

function printMenu() {
    let month = (meal.date.getMonth() + 1).toString();
    let date = meal.date.getDate().toString();
    let day = ['일', '월', '화', '수', '목', '금', '토'][meal.date.getDay()];

    document.getElementById("date").innerHTML = `${month}월 ${date}일 ${day}요일`;

    let breakfast = document.getElementById("breakfast").getElementsByClassName("menu-list")[0];
    let lunch = document.getElementById("lunch").getElementsByClassName("menu-list")[0];
    let dinner = document.getElementById("dinner").getElementsByClassName("menu-list")[0];

    breakfast.innerHTML = "";
    lunch.innerHTML = "";
    dinner.innerHTML = "";

    for (item of meal.menu.breakfast) {
        breakfast.innerHTML += '<li><span class="text">' + item + '</span></li>';
    }

    for (item of meal.menu.lunch) {
        lunch.innerHTML += '<li><span class="text">' + item + '</span></li>';
    }

    for (item of meal.menu.dinner) {
        dinner.innerHTML += '<li><span class="text">' + item + '</span></li>';
    }
}
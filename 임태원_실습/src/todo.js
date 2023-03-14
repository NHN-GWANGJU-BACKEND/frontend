const dateList1 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 윤년 x
const dateList2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 윤년 o
const dayList = ["일", "월", '화', '수', '목', '금', '토']; // 요일

const today = new Date();

const userId = "marco";

let currentYear = today.getFullYear();
let currentMonth = today.getMonth() + 1;
let dayPeriod = dateList1[currentMonth - 1];    // 현재 년도,월 default값 설정

let prev = document.getElementById("previous");
let next = document.getElementById("next");

prev.addEventListener("click", prevClick);
next.addEventListener("click", nextClick);

function isLeapYear() {
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)) {
        dayPeriod = dateList2[currentMonth-1];
    }else{
        dayPeriod = dateList1[currentMonth-1]
    }
}


function prevClick() {
    if (currentMonth === "01") {
        currentYear -= 1;
        currentMonth = 12;
    } else {
        currentMonth -= 1;
    }

    isLeapYear();  // 윤년을 포함하여 월마다 날짜범위 가져오기
    setTitle();  // 2022년 9월 TODO-LIST 새롭게 렌더링
    daySetting(); // 매 일 todo list 컨테이너 렌더링 + localstorage에 데이터 있으면 꺼내오기
}

function nextClick() {
    if (currentMonth === 12) {
        currentYear += 1;
        currentMonth = 1;
    } else {
        currentMonth-=1;
        currentMonth += 2;
    }

    isLeapYear();
    setTitle();
    daySetting();
}


function setTitle() {
    let todoTitle = document.getElementById("todoTitle");
    if(currentMonth<10){
        currentMonth = '0'+currentMonth;
    }
    todoTitle.innerHTML = null;

    let year = document.createElement("span");
    let month = document.createElement("span");

    year.innerHTML = `${currentYear}년&nbsp`;
    month.innerHTML = `${currentMonth}월 TODO-LIST`;

    todoTitle.appendChild(year);
    todoTitle.appendChild(month);
}

function daySetting() {
    let body = document.getElementById("body");
    body.innerHTML = null;

    for (let i = 1; i <= dayPeriod; i++) {
        if(i<10){
            i = '0'+i;
        }
        let myDate = currentYear+"-"+currentMonth+"-"+i;

        let thisDate = new Date(myDate);
        let day = dayList[thisDate.getDay()];  // 요일 계산

        let div = document.createElement("div");

        let divInner =
            `<div class="todo" id="todo,${myDate}">
            <div class="dayInfo">
                <span class="dayNum">${i}</span>
               <span class="day ${day}">${day}</span>
            </div>
            <div class="inputField" id="inputField,${myDate}">
                <div class = "mainInput">
                    <input class="input" id="input,${myDate}" type="text" placeholder="할 일 입력하기">
                    <button class="inputBtn" id="inputBtn,${myDate}">저장</button>
                </div>
                <div class="subInput">
                    <button class="removeBtn" id="removeBtn,${myDate}">전체 삭제</button>
                </div>
            </div>
            <div class="ListContainer" id="ListContainer,${myDate}">
                <ul class = "dayPerList" id="dayPerList,${myDate}"></ul> 
            </div>
        </div>`

        div.innerHTML = divInner;
        body.appendChild(div);
        getEvent(userId,myDate);
    }


    let inputBtn = document.querySelectorAll(".inputBtn");
    inputBtn.forEach((value) => {
        value.addEventListener("click", inputTodo);
    })

    let removeBtn = document.querySelectorAll(".removeBtn");
    removeBtn.forEach((value) => {
        value.addEventListener("click", removeAll);
    })

    let input = document.querySelectorAll(".input");
    input.forEach((value) => {
        value.addEventListener("keypress", function (e){if(e.key==="Enter")inputPress(this);});
    })

    let removeOne = document.querySelectorAll(".removeOne");
    removeOne.forEach((value) => {
        value.addEventListener("click", remove);
    })

}

function getEvent(userId, targetDate){
    const promise = new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        const url = `http://133.186.211.156:8100/api/${userId}/calendars/day/${targetDate}`;
        xhr.open('GET',url);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);
                console.log(this.responseText);
                resolve(this.responseText);
            }
        };
        xhr.send('');
    }).then((items)=>{
        const result = JSON.parse(items);
        let dayPerList = document.getElementById(`dayPerList,${targetDate}`);
        for(let i=0;i<result.length;i++){
            const id = result[i].id;
            const userId = result[i].userId;
            const subject = result[i].subject;
            const eventDt = result[i].eventDt;
            console.log("id",id);
            console.log("userId:",userId);
            console.log("subject:",subject);
            console.log("eventDt:",eventDt);
            let ListInner = `
            <li class="removeOne" id="removeOne,${targetDate}" value="${subject}">${subject}</li>`
            let li = document.createElement("li");
            li.innerHTML = ListInner;
            dayPerList.appendChild(li);
        }
    }).catch(e=>{
        console.log("error:",e);
    }).finally(()=>{
        console.log("api 호출");
    });
}


function main() {
    setTitle();
    daySetting();
}

main();
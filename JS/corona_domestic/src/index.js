const dateList1 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 윤년 x
const dateList2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 윤년 o

let today = new Date();

let currentYear = today.getFullYear();
let currentMonth = today.getMonth() + 1;
let currentDate = today.getDate();
let currentPage = 1;
let totalPage;
let itemList;

function isLeapYear() {  //윤년 계산 함수
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)) {
        return true;
    } else {
        return false;
    }
}

function setCurrentDate() { // 이전 달로 이동했을 경우 날짜를 설정하기 위해
    if (isLeapYear()) {
        currentDate = dateList2[currentMonth - 1];
    } else {
        currentDate = dateList1[currentMonth - 1];
    }
}

function YMD() {  // 날짜를 계산해서 헤더부분에 date를 표시해주는 함수
    if (currentMonth < 10 && currentMonth[0] !== '0') {
        currentMonth = '0' + currentMonth;
    }
    if (currentDate < 10 && currentDate[0] !== '0') {
        currentDate = '0' + currentDate;
    }

    let header = document.getElementById("header");
    let h3 = document.getElementById('date');
    h3.innerHTML=null;
    h3.innerHTML = `[${currentYear}-${currentMonth}-${currentDate}] 기준`
    header.appendChild(h3);

    return currentYear + "" + currentMonth + "" + currentDate;
}

function setDate(){  // 공휴일, 주말에는 공공데이터가 업데이트 되지 않아서 표에 아무것도 안뜨는 경우 존재
                    // 만약 데이터가 없다면 날짜를 하루 전날로 이동시키는 함수
    if (currentDate === "01") {
        if (currentMonth === 1) {
            currentMonth = 12;
            currentYear -= 1;
            setCurrentDate();
        } else {
            currentMonth -= 1;
            setCurrentDate();
        }
    } else {
        currentDate -= 1;
    }
}


function getData() {  // 공공데이터 api로부터 데이터를 불러오는 함수
    const promise = new Promise((resolve, reject) => {
        const nowDate = YMD();
        const xhr = new XMLHttpRequest();
        let serviceKey = "hHLAjVcJYvlI0p8PWtd2NXUS9C7hjAlvYkvla2iIBsQ6LIISjWbOI961vvPlTA5S5nkfOe1tbODRfWhgEs3F6Q%3D%3D";
        let url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
        let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
        queryParams += '&' + encodeURIComponent('pageNo') + '=1';
        queryParams += '&' + encodeURIComponent('numOfRows') + '=10';
        queryParams += '&' + encodeURIComponent('startCreateDt') + `=${nowDate}`;
        queryParams += '&' + encodeURIComponent('endCreateDt') + `=${nowDate}`;

        xhr.open("GET", url + queryParams);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);

                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                let items = xmlDoc.getElementsByTagName("item");

                if(items.length===0){
                    setDate();
                    getData();
                    return;
                }

                paintPaging(items.length);

                itemList = [];
                for (let i = 0; i < items.length; i++) {
                    let area = items[i].getElementsByTagName('gubun')[0].innerHTML;
                    let defCnt = items[i].getElementsByTagName('defCnt')[0].innerHTML;
                    let incDec = items[i].getElementsByTagName('incDec')[0].innerHTML;

                    let item = {
                        area,
                        defCnt,
                        incDec
                    }
                    if (area === "합계") continue;
                    itemList.push(item);
                }
                itemList.reverse();
                makeContent();
            }
        }
        xhr.send('');
    })
}

function makeContent(){  // 페이징을 하여 데이터 추출범위 설정 함수
    let start = 0;

    if (currentPage !== 1) {
        start = currentPage * 8 - 8;
    }
    let end = start+8;


    if(end>itemList.length){
        end = itemList.length;
    }
    let newItemList = [];

    for(let i = start; i<end;i++){
        newItemList.push(itemList[i]);
    }
    paintTable(newItemList,newItemList.length);
}

function paintTable(itemList, length) {  // 설정한 내용대로 데이터를 그려주는 함수
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = null;

    for (let i = 0; i < length; i++) {
        let divInner;
        if (itemList[i].area === "검역") {
            divInner =
                `<div class = "tableContent">
             <div class = "location left">${itemList[i].area}</div>
            <div class = "accumulate center">${itemList[i].defCnt}</div>
            <div class = "new right">${itemList[i].incDec}</div>  
        </div>`
        } else {
            divInner =
                `<div class = "tableContent">
             <div class = "location left"><a href="detail.html?location=${itemList[i].area}" target="_blank" >${itemList[i].area}</a></div>
            <div class = "accumulate center">${itemList[i].defCnt}</div>
            <div class = "new right">${itemList[i].incDec}</div>  
        </div>`
        }

        let div = document.createElement('div');
        div.innerHTML = divInner;

        tableBody.appendChild(div);
    }
}

function paintPaging(totalData) {  // 페이징 버튼 그려주는 함수
    let dataPerPage = 8;
    totalPage = Math.ceil(totalData / dataPerPage);

    let tableFoot = document.getElementById('tableFoot');
    tableFoot.innerHTML = null;

    let Inner = `<span id="prevBtn"><&nbsp&nbsp&nbsp&nbsp</span>
        <span id ="pageInfo"> ${currentPage} / ${totalPage}</span>
        <span id="nextBtn">&nbsp&nbsp&nbsp&nbsp></span>
    `
    let div = document.createElement('div');
    div.style = "display:flex; align-items:center";
    div.innerHTML = Inner;

    tableFoot.appendChild(div);


    let nextBtn = document.getElementById("nextBtn");
    let prevBtn = document.getElementById("prevBtn");

    nextBtn.addEventListener('click',nextPage);
    prevBtn.addEventListener('click',previousPage);

    if(currentPage===1){
        prevBtn.style.display = "none";
    }

    if(currentPage===totalPage){
        nextBtn.style.display = "none";
    }
}

function nextPage() {  // 다음 페이지 버튼 눌렀을 때 작동하는 clickEvent
    currentPage+=1;
    makeContent();
    paintPaging(itemList.length);
}

function previousPage() { // 이전 페이지 버튼 눌렀을 때 작동하는 clickEvent
    currentPage-=1;
    makeContent();
    paintPaging(itemList.length);
}


function main() { // 실행순서 조절 main 함수
    getData();
}

main();

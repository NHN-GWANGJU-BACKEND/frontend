let itemList = [];
function keepStore(key){
    let arr = new Array();

    if(localStorage.getItem(key)==null){
        return arr;
    }else{
        let data = localStorage.getItem(key).split(',');
        data.forEach((value)=>{
            arr.push(value);
        })
    }
    return arr;
}


function inputPress(btn_class){
    let id = btn_class.id.split(',');
    id = id[1];

    console.log(id);

    const promise = new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        const url = `http://133.186.211.156:8100/api/${userId}/calendars/events`;
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type",'application/json');
        let item = document.getElementById(`input,${id}`).value;

        const data = {
            "subject" : item,
            "eventDt" : id
        }

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);
                console.log(this.responseText);
                resolve(this.responseText);
            }
        };

        xhr.send(JSON.stringify(data));
    }).then(function(jsonString){
        result = JSON.parse(jsonString);
        console.log(result.message);
        console.log(result.id);
        alert("등록완료!");
        location.reload();
    });

    daySetting();
}

function inputTodo(btn_class){
    let id = btn_class.target.id.split(',');
    id = id[1];

    const promise = new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        const url = `http://133.186.211.156:8100/api/${userId}/calendars/events`;
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type",'application/json');
        let item = document.getElementById(`input,${id}`).value;

        const data = {
            "subject" : item,
            "eventDt" : id
        }

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);
                console.log(this.responseText);
                resolve(this.responseText);
            }
        };

        xhr.send(JSON.stringify(data));
    }).then(function(jsonString){
        result = JSON.parse(jsonString);
        console.log(result.message);
        console.log(result.id);
        alert("등록완료!");
        location.reload();
    });

    daySetting();
}


function remove(btn_class){
    let id = btn_class.target.id.split(',');
    id = id[1];
    let value = btn_class.target.attributes.value.value;
    console.log(id);

    const promise = new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        const url = `http://133.186.211.156:8100/api/${userId}/calendars/events/${id}`;
        xhr.open('DELETE', url);
        xhr.setRequestHeader("Content-Type",'application/json');
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);
                console.log(this.responseText);
                resolve(this.responseText);
            }
        };

    }).then(function(jsonString){
        result = JSON.parse(jsonString);
        console.log(result.message);
        console.log(result.id);
        alert("삭제완료!");
        location.reload();
    });


    daySetting();
}


function removeAll(btn_class){
    let id = btn_class.target.id.split(',');
    id = id[1];

    if(localStorage.getItem(id)!=null){
        localStorage.setItem(id,"");
    }
    daySetting();
}

/*Uncaught TypeError: Cannot read property 'style' of undefined
    at Pagination (all.js:149)(all.js:170)*/


    
//指定dom，選取option下拉式選單和button和content
const listDown = document.getElementById('listDown');
const hotspaceBtn = document.querySelector('.hotspaceBtn');
const content = document.querySelector('.content');
const zoneTitle = document.querySelector('.zoneTitle');


//資料
let upData = []

const xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);

xhr.onload = function () {
    var str = JSON.parse(xhr.responseText);
    upData = str.result.records;
    //console.log(upData[56].Zone)             

    //抓取需要的旅遊資料
    let dataLen = upData.length;
    let selectZones = []
    for (let i = 0; i < dataLen; i++) {
        var str = JSON.parse(xhr.responseText);
        upData = str.result.records;
        selectZones.push(upData[i].Zone);
    }
    //console.log(selectZones)

    //手動增加下拉選單Zone區域
    function addSelect() {
        let zones = [];
        let str = '<option value="請選擇行政區" >- - 請選擇行政區 - -</option>';
        //array.forEach() 方法會將陣列內的每個元素，皆傳入並執行給定的函式一次。
        //forEach()判斷陣列裡面所有值是否有吻合

        //舉例  //var beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];                 
        //console.log(beasts.indexOf('bison', 2));?
        //index['ant'=0, 'bison'=1, 'camel'=2, 'duck'=3, 'bison'=4]
        //indexOf('bison', 2));的2是從index['camel'=2]開始尋找，找到index['bison'=4]
        // expected output: 4

        //forEach()、indexOf() - 過濾重複篩選區域
        selectZones.forEach(function (item) {
            //自己思考是因為zones[]中並沒有item.Zone這筆資料所以回傳失敗-1執行下面的code
            //indexOf(item.Zone)，item：要在陣列中搜尋的項目。 Zone：起始搜尋索引，由此索引位置開始向後搜尋。
            //傳回值：匹配成功則傳回該元素所在位置的索引，失敗則傳回-1。
            if (zones.indexOf(item) == -1) {           /*一開始zones內是空陣列，沒有任何一筆資料 */
                zones.push(item);
            }
            //console.log(zones);
        });
        for (let j = 0; j < zones.length; j++) {
            str += `<option value="${zones[j]}">${zones[j]}</option>`
        }
        listDown.innerHTML = str;
    }
    addSelect();

}


//渲染到html網頁內容
function updateList(Items) {
    let str2 = '';
    for (let k = 0; k < upData.length; k++) {
        if (Items == upData[k].Zone) {
            if (upData[k].Ticketinfo == '') {  /*不是免費的*/
            str2 +=
                    `<div class="nxtnxtpage">
    <div data-num="${k}" class="frameBox">
        <div class="imgBox">
            <div class="imgPic" style="background-image:url(
    ${upData[k].Picture1})"></div>
            <div class="imgpic_Text">
                <h3>${upData[k].Name}</h3>
                <h5>
                    ${upData[k].Zone}</h5>
            </div>
        </div>
        <ul class="icons_Space">
            <li class="icons _openTime">${upData[k].Opentime}
            </li>
            <li class="icons _adress">
                ${upData[k].Add}</li>
            <li class="icons _tel">
                ${upData[k].Tel}</li>
        </ul>
    </div>
</div>`
            } else {
            str2 +=
                `<div class="nxtnxtpage">
    <div data-num="${k}" class="frameBox">
        <div class="imgBox">
            <div class="imgPic" style="background-image:url(
    ${upData[k].Picture1})"></div>
            <div class="imgpic_Text">
                <h3>${upData[k].Name}</h3>
                <h5>${upData[k].Zone}
                </h5>
            </div>
        </div>
        <ul class="icons_Space">
            <li class="icons _openTime">${upData[k].Opentime}</li>
            <li class="icons _adress">${upData[k].Add}
            </li>
            <li class="icons _tel">${upData[k].Tel}</li>
            <li class="icons _forFree">
                ${upData[k].Ticketinfo}</li>
        </ul>
    </div>
</div>`     
            }

        }

    }                                      /* Items--點擊下拉式選單的內容*/
    content.innerHTML = `<h2 class="zoneTitle">${Items}</h2><div class="wrap_allData">${str2}</div>`
}


//事件監聽
listDown.addEventListener('change', function selectDown(e) {    //change事件
    let select = e.target.value;
    if (select == '請選擇行政區') {
        alert('請選擇行政區域');
        content.innerHTML = '';
        return;
    }
    updateList(select);//重新渲染到網頁上
    list_down.innerHTML = '';//頁數按鈕重複的問題，可以在 Pagination() 函式被觸發時先清空 list_down 的內容
    Pagination()//產生分頁btn
    renderContent()//讓頁面focus在h2上

});
hotspaceBtn.addEventListener('click', function hotspaceBtn(e) {  //click事件
    //查看資訊console.log(e)
    let select = e.target.value;
    if (e.target.nodeName !== 'INPUT') { return };
    updateList(select);
    list_down.innerHTML = '';
    Pagination()
    renderContent()
});

//上下頁btn 指定dom
const nextpage = document.querySelector('.nextpage');
const list_down = document.querySelector('.list_down');

// 每一個分頁要顯示的數量
let show_per_page = 4;
let number_of_items = 0; //?
let number_of_pages = 0; //?
function Pagination() {
    // 選取出 .content 這個 div 下有多少個 framebox /
    number_of_items = document.querySelectorAll('.frameBox').length;
    // 用『總數量』除以『每一頁分頁要顯示的數量』= 要有多少頁
    number_of_pages = Math.ceil(number_of_items / show_per_page); //Math.ceil() 函式會回傳大於等於所給數字的最小整數。
    //console.log(number_of_items); 總數量
    //console.log(number_of_pages); 分頁數量
    // 頁數顯示：算出 number_of_pages 後就可以新增下方的分頁數列，頁數從1開始設var i =1
    for (let i = 1; i < number_of_pages + 1; i++) {
        let textnode = `<li class="page-item"onclick="changePage(${i - 1})"><a class="page-link" href="#">${i}</a></li>`;
        list_down.innerHTML += textnode;
    }

    // 首次內容顯示
    let arr = [];
    for (let i = 0; i < number_of_items; i++) {
        // 先將 .content 中的所有內容都 display: none
        document.querySelectorAll('.frameBox')[i].style.display = 'none';
        // 將每一筆內容都依序推入 arr 這個陣列
        arr.push(document.querySelectorAll('.frameBox')[i]);
    }
    // 再用 slice 去切出陣列中 (開始選取的陣列位置,
    // 結束選取的陣列位置) 這兩個位置間的資料來 display: block
    for (let j = 0; j < show_per_page; j++) {                    //array.slice() 方法會回傳一個新陣列物件，為原陣列選擇之 begin 至 end（不含 end）部分的淺拷貝（shallow copy）。而原本的陣列將不會被修改。
        arr.slice(0, show_per_page)[j].style.display = 'block'; //arr.slice([begin[, end]])                                                          
    }                                                          //ex:slice(1,4)  提取元素中1.2.3來拷貝
}

// 切換頁數 
function changePage(page_num) {
    // 開始選取的陣列位置：用頁碼乘以每頁顯示數量
    let start_from = page_num * show_per_page;
    // 結束選取的陣列位置：用開始選取的陣列位置加上每頁顯示數量
    let end_on = start_from + show_per_page;
    let arr = [];
    // 先把 .content下所有內容都 display: none
    for (let i = 0; i < number_of_items; i++) {
        //console.log(number_of_items); 顯示7
        document.querySelectorAll('.frameBox')[i].style.display = 'none';
        arr.push(document.querySelectorAll('.frameBox')[i]);
    }
    //console.log(start_from)
    //console.log(end_on)
    // 再用 slice 去切出陣列中 (開始選取的陣列位置, 結束選取的陣列位置) 這兩個位置間的資料來 display: block
    for (let j = 0; j < show_per_page; j++) {
        arr.slice(start_from, end_on)[j].style.display = 'block'; //假如選第2頁就是顯示8.9.10.11?
    }
    //console.log(arr)
}

//clickc或change讓頁面focus在h2上
function renderContent() {
    $('html,body').animate({ scrollTop: $('.zoneTitle').offset().top }, 950);
}

//top按鈕
$('.quit_top').click(function (event) {
    /* Act on the event */
    event.preventDefault();
    $('html,body').animate({ scrollTop: 0 }, 600);
});
//top圖案
$(".quit_top a[href$='.jpg']").addClass('fas fa-angle-double-up');



































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































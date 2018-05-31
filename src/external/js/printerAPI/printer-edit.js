// export function print() {
//   console.log("2. Hello from external printer js!")
// }
import * as Cookies from "../js.cookie.js";

export {init, downloadImageCmd, printerStatus, setTotolImages, isFinish}

var wsUri = "ws://127.0.0.1:60089/";
var output;
var print_count = 0;
//var status = false;
var photo_status;
var timer_status;
var retry_count = 0;
var retryCount;
var easyCard_retry_count = 0;
var image_download_url = "";
var QT_timer;

var arr_printPhoto = [];
var print_photo_count = 0;
var isPrinting = false; //開始列印設true, 訂單結束設false
var printFinishCount = 1;
var easyCardResult = false;
var READY_STATUS;
var printerStatus;
var websocket;
var PAPER_OUT;
var printer_paper_count;
var foto_index;
var foto_price;
var mergedPhotos;
var PRINTER;
var isDownloading;
var isFinish;
var LANG;

function init() {
  //output = document.getElementById("output");
  console.log('websocket');
  printFinishCount = 1;
  print_count = 0;
  isDownloading = false;
  printerStatus = undefined;
  isFinish = false;
  Cookies.set('printer', 'false');

  websocket = new WebSocket(wsUri);

  websocket.onopen = function (evt) {
    onOpen(evt)
  };

  websocket.onclose = function (evt) {
    onClose(evt)
  };

  websocket.onmessage = function (evt) {
    onMessage(evt)
  };

  websocket.onerror = function (evt) {
    onError(evt)
  };
}

function setTotolImages(value) {
  foto_index = value;
}

function onOpen(evt) {
  //getInitial();

  openStatus();
  //getPrintStatusCmd();
  //getRibbonCountCmd();
}

function onClose(evt) {
  writeToScreen("DISCONNECTED");
  websocket.close();
}

function onMessage(evt) {
  writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
  //websocket.close();

  messageResponse(JSON.parse(evt.data));
}

function onError(evt) {
  retryCount++;

  if (retryCount > 24) {
    retryCount = 0;
    send_email('QT websocket error');
  }

  setTimeout(function () {
    // window.location.replace('QT.html?'+retryCount);
  }, 5000);

  //window.location.replace('error.html?error=系統連線錯誤!');
  //writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
  //writeToScreen("SENT: " + message);
  websocket.send(message);
}

function Send() {
  //writeToScreen("SENT: 111111");
  websocket.send('{"command": "0200"}');
}

function writeToScreen(message) {
  //var pre = document.createElement("p");
  //pre.style.wordWrap = "break-word";
  //pre.innerHTML = message;
  //output.appendChild(pre);
}

/*****  Command   *****/
function getPrintStatusCmd() {
  websocket.send('{"command": "0000"}');
}

function getPrinterStatus(status) {
  websocket.send('{"command": "0000","id":"' + status + '"}');
}

function openStatus() {
  var url = window.location.pathname;
  var filename = url.substring(url.lastIndexOf('/') + 1);

  if (filename == 'index.html' || filename == 'page_profile.html' || filename == 'page_upload.html' || filename == 'page_edit_photo.html')
    return;

  websocket.send('{"command": "0000","id":"INITIAL"}');
}

function doCommand(param) //印表機執行特定動作，param = 100代表Reset/101代表Lock/102代表Unlock/103代表Cut paper
{
  websocket.send('{"command": "0100","param": ' + param + '}');
}

function getPaperCountCmd() {
  websocket.send('{"command": "0200","param": 5}');
}

function getRibbonCountCmd() {
  websocket.send('{"command": "0200","param": 4}');
}

function printImageCmd(imagePath) {
  console.log('JESS: printImageCmd: ' + imagePath);

  isPrinting = true;
  //setTracking('QT print photo:'+ printFinishCount + ',' + imagePath);

  //多張列印時，不檢查狀態(DNP)
  // if(1)
  // {
  if(printFinishCount == 1) {
    console.log('JESS: print checking');
    websocket.send('{"command": "0300","skipCheckPrinter":0,"id": "'+ printFinishCount +'","imagePath":"'+ imagePath +'"}');
  } else {
    console.log('JESS: print no checking');
    websocket.send('{"command": "0300","skipCheckPrinter":1,"id": "'+ printFinishCount +'","imagePath":"'+ imagePath +'"}');
  }
  // }
  // else {
  //   websocket.send('{"command": "0300","skipCheckPrinter":0,"id": "'+ printFinishCount +'","imagePath":"'+ imagePath +'"}');
  // }
  printFinishCount++;
}

function downloadImageCmd(url) {
  //setTracking('QT download photo');
  console.log('JESS: call downloadImageCmd');

  image_download_url = url;

  // wait prev download done
  let download_status = setInterval(() => {
    if ( !isDownloading) {
      clearInterval(download_status);
      websocket.send('{"command": "0400","imageUrl":"' + url + '"}');
      isDownloading = true;
    }
  }, 3000);

}

function getInitialCmd() {
  //setInitialTracking('QT get Initial');
  websocket.send('{"command":"0500"}');
}

function clearPrintQueneCmd() {
  websocket.send('{"command":"0600"}');
}

function setPcRestartCmd(status) {
  if (status === 'RESTART')
    websocket.send('{"command":"0700","param":2,"id":"RESTART"}');
  else //shutdown
    websocket.send('{"command":"0700","param":1,"id":"SHUTDOWN"}');
}

function setOrderCmd(status) {
  var result;
  if (AD_MODE === 'true')
    var price = (foto_index - 1) * foto_price * 2;
  else {
    if (payment === 'CASH') {
      var price = foto_index * foto_price;
      if (promo_code == 'fortest')
        discount = price;
    }
    else {
      /*
        if(foto_index >= 6)
            discount = discount + Math.floor(foto_index/6) * 50;
        else
            discount = discount;*/

      discount = $("#check_discount").val();
      var price = foto_index * foto_price;
    }
  }

  if (discount > price) discount = price;

  var account = igid;//foto[0].username;

  order_number = Math.floor(Date.now() / 1000);

  var cmdstring = '{"id": "SET",' +
    '"command": "0800",' +
    '"param": 1,' +
    '"transact": {' +
    '"order_id":"' + order_number + '",' +
    '"order_number":"' + order_number + '",' +
    '"lab":"' + LAB + '",' +
    '"price":' + price + ',' +
    '"quantity":' + foto_index + ',' +
    '"paid":' + amount_paid + ',' +
    '"return_coins":0,' +
    '"discount":' + discount + ', ' +
    '"promo_code":"' + promo_code + '",' +
    '"account":"' + account + '",' +
    '"is_hashtag":' + isHashtag + ',' +
    '"campaign_id":' + CAMPAIGN_ID + ',' +
    '"is_test":false,' +
    '"status":"' + status + '",' +
    '"payment":"' + payment + '",' +
    '"create_date":"' + getNow() + '",' +
    '"fail_return_coins":0,' +
    '"product_no":"MP001"' +
    '}}';

  console.log(cmdstring);
  websocket.send(cmdstring);
}

function updateOrderCmd(status) {
  if (status == 'FINISHED' && promo_code != '') {
    updatePromoCode();
  }

  var result;
  if (AD_MODE === 'true')
    var price = (foto_index - 1) * foto_price * 2;
  else {
    if (payment === 'CASH') {
      var price = foto_index * foto_price;
      if (promo_code == 'fortest')
        discount = price;
    }
    else {
      //if(foto_index >= 6)
      //    discount = discount + Math.floor(foto_index/6) * 50;
      //else
      discount = discount;

      var price = foto_index * foto_price;
    }
  }

  if (discount > price) discount = price;

  var account = igid;//foto[0].username;

  var cmdstring = '{"id":"' + status + '",' +
    '"command": "0800",' +
    '"param": 0,' +
    '"transact": {' +
    '"order_id":"' + order_number + '",' +
    '"order_number":"' + order_number + '",' +
    '"lab":"' + LAB + '",' +
    '"price":' + price + ',' +
    '"quantity":' + foto_index + ',' +
    '"paid":' + amount_paid + ',' +
    '"return_coins":0,' +
    '"discount":' + discount + ', ' +
    '"promo_code":"' + promo_code + '",' +
    '"account":"' + account + '",' +
    '"is_hashtag":' + isHashtag + ',' +
    '"campaign_id":' + CAMPAIGN_ID + ',' +
    '"is_test":false,' +
    '"status":"' + status + '",' +
    '"payment":"' + payment + '",' +
    '"create_date":"' + getNow() + '",' +
    '"fail_return_coins":0,' +
    '"product_no":"MP001"' +
    '}}';

  console.log(cmdstring);
  websocket.send(cmdstring);
}

function setPhotoCmd() {
  var cmdstring = '{"id": "PHOTO",' +
    '"command": "0800",' +
    '"param": 2,' +
    '"photo":[{' +
    '"photo_id":111,' +
    '"order_id":"orderid1",' +
    '"username":"chiyehyu",' +
    '"url":"https://XXX",' +
    '"photo_url":"https://photo.XXX",' +
    '"frame_url":"http://frame.XXX",' +
    '"create_date":"2017-07-11 15:46:00"' +
    '},' +
    '{' +
    '"photo_id":222,' +
    '"order_id":"orderid1",' +
    '"username":"chiyehyu",' +
    '"url":"https://YYY",' +
    '"photo_url":"https://photo.YYY",' +
    '"frame_url":"http://frame.YYY",' +
    '"create_date":"2017-07-11 15:47:00"' +
    '}]' +
    '}';

  websocket.send(cmdstring);
}

function changeOverCmd() {
  var cmdstring = '{"id": "CHANGE",' +
    '"command": "0800",' +
    '"param": 3,' +
    '"circuit": {' +
    '"equipment_id":"91",' +
    '"equipment_name":"LAB020",' +
    '"sold_count":0,' +
    '"unit_price":25,' +
    '"sold_price":0,' +
    '"left_count":0,' +
    '"final_count":1000,' +
    '"lab":"LAB020",' +
    '"location":"",' +
    '"create_date":"' + getNow() + '",' +
    '"change_over_time":"' + getNow() + '",' +
    '"record_id":"91",' +
    '"type":"input",' +
    '"user_id":91,' +
    '"product_no":"MP001"' +
    '}}';

  websocket.send(cmdstring);
}

function registerCmd() {
  websocket.send('{"id": "ABC","command": "0900","propertyNo": "LAB020","param": 1}');
}

function easyCardCmd(price) {
  websocket.send('{"id": "pay","command": "0A00","amount":' + price + ',"param": 1}');
}

function printReceipt(RRN) {
  websocket.send('{"id": "' + RRN + '","command": "0B00","RRN":"' + RRN + '"}');
}

/******* Response ********/
function messageResponse(json) {
  switch (json.command) {
    case '0000': //status
      checkPrinterStatus(json);
      break;
    case '0100': //printer action
      checkDoCommand(json);
      break;
    case '0200': //paper
      checkPrinterPaper(json);
      break;
    case '0300': //print
      checkPrintImage(json);
      break;
    case '0400': //download
      checkDownloadImage(json);
      break;
    case '0500': //initial
      checkInitial(json);
      break;
    case '0600': //clear print quene
      checkPrintQuene(json);
      break;
    case '0700': //pc restart / shutdown
      checkPcStatus(json);
      break;
    case '0800': // 交易記錄 / 補換貨記錄
      checkOrderStatus(json);
      break;
    case '0900': // pc register
      checkRegisterStatus(json);
      break;
    case '0A00': // easy card payment
      checkEasyCardStatus(json);
      break;
    case '0B00': // Receipt
      checkReceiptStatus(json);
      break;
  }
}

function checkPrinterStatus(data) {
  /*---------------------------
HITI printerStatus
0: Ready
2: busy
1024: paper out
769: ribbon out

DNP printerStatus
65537: IDLE
65538: Printing
65544: paper end
65552: ribbon end
  -----------------------------*/

  if (data.result) {
    if (data.printer === 'HITI') {
      READY_STATUS = 0;
    } else {
      //DNP
      READY_STATUS = 65537;
    }

    if (data.printer == 'HITI') {
      Cookies.set('printer', 'false');
    } else {
      Cookies.set('printer', 'true');
    }

    printerStatus = data.printerStatus;
    console.log('JESS: check printer status: ', printerStatus);

    if (isPrinting === true && data.printerStatus === READY_STATUS && print_photo_count === foto_index) {
      console.log('JESS: is finish printing.');
      clearInterval(timer_status);
      isPrinting = false;
      isFinish = true;
      // print_counter(1);
    }

    if (data.printer === 'HITI') {
      //0x500 (1280) 卡紙
      if (data.printerStatus === 1024 || data.printerStatus === 1025)
        return window.location.replace('error.html?error=' + LANG.ERROR_PAPER_LOW);
      else if (data.printerStatus === 769 || data.printerStatus === 768)
        return window.location.replace('error.html?error=' + LANG.ERROR_PAPER_LOW);
      //else if(data.printerStatus === 4096)
      //	return window.location.replace('error.html?error=印表機錯誤 0x1000!'); //晶片錯誤
      else if (data.printerStatus === 4096 || data.printerStatus === 31 || data.printerStatus === 524288 || data.printerStatus === 512) //retry again
      {
        //setTracking('printer error :' + data.printerStatus);

        if (data.id !== 'RETRY') {
          setTimeout(function () {
            getPrinterStatus('RETRY');
          }, 5000);
        }
        else
          return window.location.replace('error.html?error=印表機未就緒!' + '(' + data.printerStatus + ')');
      }
      else if (data.printerStatus !== 0 && data.printerStatus !== 2) //2 is busy
        return window.location.replace('error.html?error=印表機未就緒!' + '(' + data.printerStatus + ')');
      else if (data.printerStatus === 2 && isPrinting === false)
        return window.location.replace('error.html?error=印表機狀態錯誤!');
    }
    else {
      if (data.printerStatus === 65544 || data.printerStatus === 65552)
        return window.location.replace('error.html?error=' + LANG.ERROR_PAPER_LOW + '(' + data.printerStatus + ')');
      else if (data.printerStatus === -2147483648)
        return window.location.replace('error.html?error=' + LANG.ERROR_PRINTER_OFFLIE);
      else if (data.printerStatus !== 65537 && data.printerStatus !== 65538)
        return window.location.replace('error.html?error=' + LANG.ERROR_PRINTING);
    }

    if (data.id == 'INITIAL')
      getRibbonCountCmd();
  }
  else
    window.location.replace('error.html?error=' + LANG.ERROR_PRINTING);
}

function checkDoCommand(data) {
  if (data.result) {

  }
  else {

  }
}

function checkPrinterPaper(data) {
  if (data.result) {
    if (data.printer === 'HITI')
      PAPER_OUT = 1; //沒紙時，會顯示1
    else
      PAPER_OUT = 51;

    if (data.cnt < PAPER_OUT)
      return window.location.replace('error.html?error=相紙已用完!');

    printer_paper_count = parseInt(data.cnt) - PAPER_OUT;
  }
  else {
    window.location.replace('error.html?error=' + LANG.ERROR_PRINTING);
  }
}

function checkInitial(data) {
  //setInitialTracking('QT check Initial:' + data.result);
  if (data.result) {
    setConstantsValue(data.authPasswd);
  }
  else {
    window.location.replace('error.html?error=' + LANG.ERROR_INITIALIZATION);
  }
}

function checkDownloadImage(data) {

  //setTracking('QT check download image:' + data.result);
  //clearTimeout(QT_timer);
  console.log("JESS: Check download image.");

  if (data.result) {
    arr_printPhoto[print_count / 2] = data.imagePath;
    console.log('JESS: Print Photo Array: ', arr_printPhoto);

    retry_count = 0;
    print_count += 2;

    // if (print_count < foto_index) {
    //   setTimeout(function () {
    //     //setPrintingPhoto(print_count);
    //     downloadImageCmd(mergedPhotos[print_count / 2]);
    //   }, 3000);
    // }
    // else {
    //   //readyToPrint = true;
    //   //setPercentage(99);
    // }

    //if(LAB != 'LITE005')
    isDownloading = false;
    printImageCmd(data.imagePath);
  }
  else {
    //error 時 更新訂單狀態為fail
    console.log('JESS: Download Image ERROR:' + image_download_url);
    if (retry_count > 3) {
      // window.location.replace('error.html?error=' + LANG.ERROR_NETWORK_PRINT);
    } else {
      downloadImageCmd(image_download_url);
    }
    retry_count++;
  }
}

function checkPrintImage(data) {
  if (data.result) {
    // setTracking('QT check print photo:' + data.result + ',index:' + printFinishCount);

    if (PRINTER === 'false' && printFinishCount === 1) {
      setTimeout(function () {
        getPrintStatusCmd(); //make sure printer is printing (ststus = 2)
      }, 5000);
    }

    // printFinishCount++;
    print_photo_count += 2;

    if (print_photo_count === foto_index) {
      // setTimeout(function () {
      //   checkPrintFinish();
      // }, 20000);

      var sleepTime = foto_index/2 * 20 *1000; //一張20s
      setTimeout(function(){
        checkPrintFinish();
      }, sleepTime);
    }

    // photo_status = setInterval(function () {
    //
    //   if (arr_printPhoto[print_photo_count / 2] !== undefined) {
    //     clearInterval(photo_status);
    //     printImageCmd(arr_printPhoto[print_photo_count / 2]);
    //   }
    // }, 2000);
  }
  else {
    console.log('JESS: checkPrintImage failed!');
    // setTracking('QT check print photo error:' + data.result + ',' + data.printerStatus);
    if (data.printerStatus == -2147483648)
      window.location.replace('error.html?error=' + LANG.ERROR_PRINTER_OFFLIE);
  }
}

function checkPrintQuene(data) {
  if (data.result) {
    //alert('SUCCESS');
  }
  else {
    //alert('ERROR');
  }
}

function checkPcStatus(data) {
  console.log('checkPcStatus');
  if (data.result) {
    window.location.replace('shutdown.html');
  }
  else {
    //retry
    setPcRestartCmd(data.id);
  }
}

function printImageFlow(url) {
  // setTracking('start printing');
  photo_status = setInterval(function () {

    console.log(arr_printPhoto);
    if (arr_printPhoto[print_photo_count / 2] !== undefined) {
      clearInterval(photo_status);
      printImageCmd(arr_printPhoto[0]);
    }
  }, 2000);
}

function checkOrderStatus(data) {
  if (data.result) {
    //alert('SUCCESS');
  }
  else {
    //alert('ERROR');
    if (data.id == 'FINISHED')
      updateOrderCmd('FINISHED');
  }
}

function checkRegisterStatus(data) {
  if (data.result) {
    //alert('SUCCESS');
  }
  else {
    //alert('ERROR');
  }
}

function checkEasyCardStatus(data) {
  clearInterval(easyCard_timer);

  if (data.result) {
    easyCardResult = true;
    document.getElementById("easyCard_counter").innerHTML = '已完成付款';
    setTracking('easyCard pay success');

    easyCardOrders(data);

    //列印收據
    //printReceipt(data.RRN);
    modify_printing();
  }
  else {
    if (easyCardResult == true)
      return;

    if (data.errorCode == "-119")
      document.getElementById("easyCard_counter").innerHTML = LANG.ERROR_EASYCARD;
    else
      document.getElementById("easyCard_counter").innerHTML = data.errorMessage;

    setTracking('easyCard ' + data.errorMessage);

    document.getElementById('easyCard_retry').style.display = 'block';
    document.getElementById("easyCard_retry").disabled = false;
    $('#easyCard_retry').css({"width": "350px", "left": "100px"});
    //$('#easyCard_retry').click(function(){
    //	console.log('click easy');
    //       easyCard_payment();
    //});

    $('#easyCard_cancel').css({"width": "350px", "left": "480px"});
    document.getElementById('easyCard_cancel').style.display = 'block';
    $('#easyCard_cancel').html('取消');
    //$('#easyCard_cancel').click(function(){
    //    window.location.replace('index.html');
    //});

    easyCard_retry_count++;
    if (easyCard_retry_count > 3) {
      document.getElementById("easyCard_counter").innerHTML = '悠遊卡無法正常感應,請更換付款方式';
      document.getElementById('easyCard_retry').style.display = 'none';
      document.getElementById("easyCard_retry").disabled = true;
      $('#easyCard_cancel').css({"width": "350px", "left": "280px"});
      //modify_close_print();
      //updateOrderStatus('CANCELLED');
      //window.location.replace('index.html');
    }
  }
}

function checkReceiptStatus(data) {
  if (data.result) {
    //alert('SUCCESS');
  }
  else {
    //alert(data.errorMessage);
    document.getElementById("easyCard_counter").innerHTML = data.errorMessage;
  }
}

function setConstantsValue(auth_token) {
  $.support.cors = true;
  $.ajax({
    url: 'http://52.199.212.142/api/login/authentication/' + auth_token,
    dataType: 'json',
    type: 'GET',
    async: false,
    success: function (data) {

      if (data.result === 'SUCCESS') {
        getSettingValue(data.encrypt);
        window.location.replace('memopresso.html');
      }
      else if (data.result === 'ERROR') {
        window.location.replace('error.html?error=' + LANG.ERROR_SYSTEM);
      }
    },
    error: function (data) {
      console.log(data);
      result = 'ERROR';
      setConstantsValue(auth_token);
    }
  });
}

/*
function setInitialTracking(action)
{
    $.ajax({
        url: ROOT_URL + '/api/log/tracking/',
        dataType: 'json',
        type: 'POST',
        cache: false,
        data: {lab:LAB,account:'INITIAL',action:action},
        success: function(data){
            console.log(data);
        },
        error: function(data){
            console.log(data); // send the error notifications to console
        }
    });
}
*/

function getNow() {
  var today = new Date();
  var y = today.getFullYear();
  var mm = today.getMonth() < 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1); // getMonth() is zero-based
  var dd = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
  var hh = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  var min = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
  var ss = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

  var dmy = y + "-" + mm + "-" + dd;
  var t = hh + ":" + min + ":" + ss;

  return dmy + ' ' + t;
}

function updatePromoCode() {

  //order_number = Math.floor(Date.now() / 1000);
  $.support.cors = true;
  $.ajax({
    url: 'http://52.199.212.142/api/promo/useCode',
    dataType: 'json',
    type: 'POST',
    async: false,
    cache: false,
    data: {"code": promo_code, "order_id": order_number, "machine_id": MACHINE_ID, "LAB": LAB},
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      console.log(data);
      result = 'ERROR';
    }
  });
}

function checkPrintFinish() {
  console.log('JESS: check Print Finish');
  timer_status = setInterval(function () {
    getPrintStatusCmd();
  }, 3000);
}

function send_email(condition) {
  var result;

  $.support.cors = true;
  $.ajax({
    url: 'http://52.199.212.142/api/log/email',
    dataType: 'json',
    type: 'POST',
    //async: false,
    cache: false,
    data: {lab: Cookies.get('LAB'), condition: condition},
    success: function (data) {

      if (data.result === 'SUCCESS') {
        console.log(data.result + '! 剩下' + data.paper + '張照片');
        result = parseInt(data.paper);
      }
      else if (data.result === 'ERROR') {
        result = data.description;
      }
    },
    error: function (data) {

      console.log(data);
      result = 'ERROR';
    }
  });

  return result;
}

function easyCardOrders(data) {

  data.lab = LAB;
  data.order_number = order_id;

  $.support.cors = true;
  $.ajax({
    url: ROOT_URL + '/api/order/setEasycardOrders',
    dataType: 'json',
    type: 'POST',
    async: false,
    cache: false,
    data: data,
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      console.log(data);
      result = 'ERROR';
    }
  });
}

// window.addEventListener("load", init, false);


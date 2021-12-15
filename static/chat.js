const socket = io('/')
let uid = sessionStorage.getItem('uid')

let contactList = {}
if (uid == null) {
    uid = "fvsdx"
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1uz2XvnZYW3OHL7aneH-ZLKgnG0iRWjI",
    authDomain: "videochat-shweta.firebaseapp.com",
    databaseURL: "https://videochat-shweta-default-rtdb.firebaseio.com",
    projectId: "videochat-shweta",
    storageBucket: "videochat-shweta.appspot.com",
    messagingSenderId: "252477914872",
    appId: "1:252477914872:web:23c0ee6f159eb45976c50d",
    measurementId: "G-6EYDS5R6H8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const db = firebase.firestore()
const template = document.createElement('div');
template.style = "color:white;z-index:10"
template.innerHTML = "uid: " + uid;

document.body.appendChild(template);
let html = ''

db.settings({ timestampsInSnapshots: true });
let namedict = {}

//cotacts


// if (docSnap.exists) {
//     contactList = docSnap.data()
//     console.log(contactList)
//     if(contactList){
//     contactList.forEach(name => {
//         const li = `
//         <li>
//         <button class = "${name}">${name}</button>
//         </li>
//         `
//         html += li


//     })
//     namedict = contactList
// }
//     const contactHTML = document.getElementById('contacts')
//     contactHTML.innerHTML = html
//     console.log(html)

// } else {
    let i  = 0;
function hello(data) {
    console.log('clicked')
    if (sessionStorage.getItem(data)=='on') {
        console.log('on')
        
        document.getElementById('messageBox').innerHTML = '';

        sessionStorage.setItem(data, 'of')
        sessionStorage.setItem('senderuid', null)
    }
    
    else {
        console.log('off')
      
        sessionStorage.setItem(data, 'on')
        sessionStorage.setItem('senderuid', namedict[data].uid)
        const box = `<div class="messageArea" id="journal-scroll">        <div class=" " id="chatmsg">        </div>      </div>
      <div id="inputPlace">
        <input type="text" placeholder="Type a message..." id="typemsg">
    
    
        <div>
          <button id="message">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 495.003 495.003"
              style="enable-background:new 0 0 495.003 495.003;" xml:space="preserve">
              <g id="XMLID_51_">
                <path id="XMLID_53_" style="fill: #6264a7" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
            l-67.6-32.22V456.687z" />
                <path id="XMLID_52_" style="fill: #6264a7" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
            c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
            l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
            L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z" />
              </g>
            </svg>
    
          </button>
        </div>
      </div>
    `
        let b = ''
        b += box
        document.getElementById('messageBox').innerHTML = b;



        //printing prev message

        let mssgArray = namedict[namedict[data].uid].chat
        const ChatBox = document.getElementById("chatbox")
        if (mssgArray != undefined || mssgArray != null || mssgArray != {}) mssgArray.forEach(printPrevMessage)

        function printPrevMessage(item) {
            let NAME = item['uid']
            let MSSG = item['mssg']
            let TIME = item['time']
            if (uid == NAME) {
                var printtext = document.getElementById('chatmsg');



                var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px">' + MSSG + '</span>' + '<span class="senttime" >' + TIME + '</span>' + '</span>' + '</div>';

                printtext.insertAdjacentHTML('beforeend', printnow);

                var box = document.getElementById('journal-scroll');
                box.scrollTop = box.scrollHeight;

            }
            else {

                var printtext = document.getElementById('chatmsg');

                var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + MSSG + '</p>' + '</div>' + '<span class="time">' + TIME + '</span>' + '</div>' + '</div>';
                printtext.insertAdjacentHTML('beforeend', printnow);

                var box = document.getElementById('journal-scroll');
                box.scrollTop = box.scrollHeight;

            }
        }

        
//sending message
var Input = document.getElementById("typemsg");

if (Input)
    Input.addEventListener("keydown", function (event) {

        if (event.code === "Enter") {

            event.preventDefault();

            if (Input.value != "") document.getElementById("message").click();
        }
    });
if (document.getElementById('message'))
    document.getElementById('message').onclick = () => {
        var copytext = document.getElementById('typemsg');
        socket.emit('mssg', {
            messagE: copytext.value,
            uid: namedict[data].uid,
            myuid:uid


        })


        var printtext = document.getElementById('chatmsg');

        var currentdate = new Date();

        var copiedtext = copytext.value;

        var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px">' + copiedtext + '</span>' + '<span class="senttime" >' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</span>' + '</div>';

        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;
        copytext.value = "";
        
    }







    }
}
//recieving message
socket.on(uid, text => {
    var currentdate = new Date();

    if(sessionStorage.getItem('senderuid')==text.senderuid){
    var printtext = document.getElementById('chatmsg');


    var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';
    printtext.insertAdjacentHTML('beforeend', printnow);

    var box = document.getElementById('journal-scroll');
    box.scrollTop = box.scrollHeight;
    }
    
        

      document.body.innerHTML+= '<div class="receive" id = "messagePopup"style = "position:absolute;right:calc(50% - 10rem);z-index:100;">' + '<div class="receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';
      
      setTimeout(function () { document.getElementById("messagePopup").remove() }, 3000);

    
    let item = {

        'mssg': text.messagE,
        'time': currentdate.getHours() + ':' + currentdate.getMinutes(),
        
        

    }
    namedict[text.senderuid]['chat'].push(item)

    db.collection('contacts').doc(uid).update({
        list: namedict
    })


});





// add contact
const closemodal = document.getElementById("enter")
closemodal.onclick = () => {
    sessionStorage.getItem(document.getElementById("names").value,0)
    namedict[document.getElementById("names").value] = {
        
        'uid': document.getElementById("uid").value,
        
    }
    namedict[document.getElementById("uid").value] = {
        
        'name':document.getElementById("names").value,
        'chat': []
    }
    const li = `
                <li>
                <button id = "${document.getElementById("names").value}"  >${document.getElementById("names").value}</button>
                </li>
                `

    html += li

    const contactHTML = document.getElementById('contacts')
    contactHTML.innerHTML = html
    document.getElementById(document.getElementById("names").value).addEventListener("click",function f(){ try{hello(document.getElementById("names").value)}catch{console.error();}});
    db.collection('contacts').doc(uid).update({
        list: namedict
    }).then(
        () => {

            const room_id = document.getElementById("room_id")
            room_id.style.display = "none";
        }
    )


}







const openmodal = document.getElementById("addContact")


openmodal.onclick = () => {
    room_id.style.display = "flex";

}

// })















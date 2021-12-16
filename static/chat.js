const socket = io('/')
let uid = sessionStorage.getItem('uid')
let namedict = {}
let contactss = []
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
template.style = "color:whitesmoke;z-index:10"
template.innerHTML = "uid: " + uid;




document.body.appendChild(template);
let html = ''

db.settings({ timestampsInSnapshots: true });

//opening a contact
db.collection('connections').doc(uid).get().then((doc) => {
    if (doc.exists) {
        contactss = doc.data().name
        console.log(doc.data().name)
        doc.data().name.forEach(s => {

            const li = `
                <li>
                <button id = "${s.name}" style = "width:100%;background-color:#6264a7;" >${s.name}</button>
                </li>
                `

            html += li
            namedict[s.name] = s.uid
            namedict[s.uid] = s.name
            const contactHTML = document.getElementById('contacts')
            contactHTML.innerHTML = html
            document.getElementById(s.name).addEventListener("click", function f() { try { hello(s.name) } catch { console.error(); } });
        })

    }
    else {
        console.log("no doc")
    }
})
function hello(data) {
    console.log('clicked')
    if (sessionStorage.getItem(data) == 'on') {
        console.log('on')

        document.getElementById('messageBox').innerHTML = '';

        sessionStorage.setItem(data, 'of')
        sessionStorage.setItem('senderuid', null)
        document.getElementById('inputPlace').style.display = 'none'
    }

    else {


        sessionStorage.setItem(data, 'on')

        sessionStorage.setItem('senderuid', namedict[data])
        console.log('off')
        const box = `<div class="messageArea" id="journal-scroll">        <div class=" " id="chatmsg">        </div>      </div>`
        let b = ''
        b += box
        document.getElementById('inputPlace').style.display = 'flex'
        document.getElementById('messageBox').innerHTML = b;



        //printing prev message

        let mssgArray = {}
        db.collection('contacts').doc(uid).get().then((doc) => {

            mssgArray = doc.data().list[doc.data().list[data].uid]
        })
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

    }
}
        //sending message\
        console.log("ss")
        var Input = document.getElementById("typemsg");

        if (document.getElementById("typemsg") != null) {
            console.log('open')
            var Input = document.getElementById("typemsg");
            Input.addEventListener("keydown", function (event) {

                if (event.code === "Enter") {
                    console.log('enter pressed')
                    event.preventDefault();

                    if (Input.value != "") document.getElementById("message").click();
                }
            });
        }
        if (document.getElementById('message') != null) {
            console.log('cc')
            document.getElementById('message').onclick = () => {
                var copytext = document.getElementById('typemsg');
                console.log("sended")
                socket.emit('mssg', {
                    messagE: copytext.value,
                    uid: sessionStorage.getItem('senderuid'),
                    myuid: uid


                })


                var printtext = document.getElementById('chatmsg');

                var currentdate = new Date();

                var copiedtext = copytext.value;

                var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px">' + copiedtext + '</span>' + '<span class="senttime" >' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</span>' + '</div>';

                printtext.insertAdjacentHTML('beforeend', printnow);

                var bb = document.getElementById('journal-scroll');
                bb.scrollTop = bb.scrollHeight;

                db.collection('contacts').doc(uid).get().then((doc) => {
                    doc.data().list[sessionStorage.getItem('senderuid')].chat.push({
                        'uid': uid,
                        'mssg': copiedtext,
                        'time': currentdate.getHours() + ':' + currentdate.getMinutes()

                    })
                })
                copytext.value = "";
            }

        }







//recieving message
socket.on(uid, text => {
    var currentdate = new Date();
    console.log('recieved')
    if (sessionStorage.getItem('senderuid') == text.senderuid) {
        console.log('printing')
        var printtext = document.getElementById('chatmsg');


        var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';
        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;
    }
    else {

        console.log("notif")
        document.body.innerHTML += '<div class="receive" id = "messagePopup"style = "position:absolute;right:calc(50% - 10rem);z-index:100;">' + '<div class="receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';

        setTimeout(function () { document.getElementById("messagePopup").remove() }, 3000);
    }


    db.collection('contacts').doc(uid).get().then((doc) => {
        doc.data().list[text.senderuid].chat.push({
            'uid': text.senderuid,
            'mssg': text.messagE,
            'time': currentdate.getHours() + ':' + currentdate.getMinutes()

        })
    })


});





// add contact
const closemodal = document.getElementById("enter")
closemodal.onclick = () => {
    sessionStorage.getItem(document.getElementById("names").value, 0)
    
    //add in connection database
    contactss.push({ 'name': document.getElementById("names").value, 'uid': document.getElementById("uid").value })
    db.collection('connections').doc(uid).update({
        name: contactss
    })

    
    const li = `
                <li>
                <button id = "${document.getElementById("names").value}" style = "width:100%;background-color:#6264a7;" >${document.getElementById("names").value}</button>
                </li>
                `

    html += li

    const contactHTML = document.getElementById('contacts')
    contactHTML.innerHTML = html
    document.getElementById(document.getElementById("names").value).addEventListener("click", function f() { try { hello(document.getElementById("names").value) } catch { console.error(); } });
    namedict[document.getElementById("names").value] = document.getElementById("uid").value
    namedict[document.getElementById("uid").value] = document.getElementById("name").value
            const room_id = document.getElementById("room_id")
            room_id.style.display = "none";
        


}







const openmodal = document.getElementById("addContact")


openmodal.onclick = () => {
    room_id.style.display = "flex";

}

// })















const socket = io('/')
let uid = sessionStorage.getItem('user')
var l = {}
var c = []
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





let html = ''

db.settings({ timestampsInSnapshots: true });

//opening a contact
// db.collection('connections').doc(uid).get().then((doc) => {
//     if (doc.exists) {
//         contactss = doc.data().name
//         console.log(doc.data().name)
//         let html = ''
//         let lii = []
//         doc.data().name.forEach(s => {
//             db.collection('contacts').doc(uid).get().then((docs) => {

//                 function con(ms) {
//                     const li = `
//             <li>
//             <button id=${s.name} class = "but">
//             <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/The_Friends_Stage.jpg/1280px-The_Friends_Stage.jpg" class = "imagestylecont">
//             <div style = "display:flex; flex-direction:column">
//             <div role="gridcell" aria-colindex="2" class="top">
//             <div class="names">
//             ${s.name}          
//             </div>
//             <div class="times">
//             ${ms['time']}
//             </div>
//             </div>

//             <div class="lastmessage">
//             ${ms['mssg']}
//             </div>
//             </div>
//             </button>
//             </li>
//             `

//                     html += li
//                     console.log(s.name)
//                     namedict[s.name] = s.uid
//                     namedict[s.uid] = s.name
//                     lii.push(s.name)



//                 }
//                 const contactHTML = document.getElementById('contacts')
//                 contactHTML.innerHTML = html
//                 lii.forEach(sss => {
//                     document.getElementById(sss).addEventListener("click", function f() { try { hello(sss) } catch { console.error(); } });
//                 })
//                 // console.log(namedict[s.name])
//                 console.log(docs.data().list[s.uid])
//                 if (docs.data().list[s.uid].at(-1) != undefined) {
//                     console.log(docs.data().list[s.uid].at(-1))
//                     let ms = docs.data().list[s.uid].at(-1)
//                     con(ms)
//                 }
//                 else {
//                     let ms = { 'mssg': '', 'time': '', }
//                     con(ms)
//                 }
//             })
//         })

//     }
//     else {
//         console.log("no doc")
//     }
// })
db.collection('logins').doc('namelist').get().then((doc) => {

    contactss = doc.data().listt
    let html = ''
    let lii = []

    db.collection('contacts').doc(uid).get().then((docs) => {

        function con(ms, s) {
            let nam = s.name
            // console.log(lii.find(s.name.split(' ')[0]))
            const li = `
            <li>
            <button id=${s.name} class = "but">
            <img src = "${s.photo}" class = "imagestylecont">
            <div style = "display:flex; flex-direction:column">
            <div role="gridcell" aria-colindex="2" class="top">
            <div class="names">
            ${s.name}          
            </div>
            <div class="times">
            ${ms['time']}
            </div>
            </div>
            
            <div class="lastmessage">
            ${ms['mssg']}
            </div>
            </div>
            </button>
            </li>
            `

            html += li
            console.log(s.name)
            namedict[s.name] = s.email
            namedict[s.email] = s.name.split(" ")[0]
            namedict[s.name+'photo'] = s.photo
            lii.push(s.name)
            const contactHTML = document.getElementById('contacts')
            contactHTML.innerHTML = html
        }

        // console.log(namedict[s.name])

        contactss.forEach(s => {
            db.collection('contacts').doc(uid).get().then((doc) => {


                let k = doc.data().list
        
                if(k[s.email]==undefined){
                k[s.email] = []}
        
                console.log(k)
                db.collection('contacts').doc(uid).update({
        
                    list: k
                })
            })

            if(s.email!=uid){
            if (docs.data().list[s.email] != undefined) {
                if (docs.data().list[s.email].at(-1) != undefined) {
                    console.log(docs.data().list[s.email].at(-1))
                    let ms = docs.data().list[s.email].at(-1)
                    con(ms, s)
                }
                else {
                    let ms = { 'mssg': '', 'time': '', }
                    con(ms, s)
                }
            }
            else {
                let ms = { 'mssg': '', 'time': '', }
                con(ms, s)
            }
        }
        })
        console.log(lii)
        lii.forEach(sss => {

            
            document.getElementById(sss.split(" ")[0]).addEventListener("click", function f() { try { hello(sss) } catch { console.error(); } });
        })
    })



})
document.getElementById('mee').innerHTML = '<img src ='+sessionStorage.getItem('photo')+' class = "imagestyle">'
function hello(data) {
    console.log('clicked')
    // if (sessionStorage.getItem('senderuid') != data)  {

    // console.log(document.getElementById(data).getElementsByClassName('imagestylecont').attr('src'))


    sessionStorage.setItem('senderuid', namedict[data])
    // console.log('off')
    const box = `<div class="messageArea" id="journal-scroll"> 
        <div id = "topname">
    
        </div>
               <div class=" " id="chatmsg"style="position: relative;top: 9vh;"> 
                      </div> 
                           </div>`
    let b = ''
    b += box
    console.log(data)
    document.getElementById('inputPlace').style.display = 'flex'
    document.getElementById('messageBox').innerHTML = b;
    document.getElementById('topname').innerHTML = '<img src ='+namedict[data+'photo']+' class = "imagestyle">' + data;



    //printing prev message


    db.collection('contacts').doc(uid).get().then((doc) => {

        let mssgArray = doc.data().list[namedict[data]]

        console.log(mssgArray)
        const ChatBox = document.getElementById("chatbox")
        console.log(mssgArray)
        if (mssgArray != undefined) mssgArray.forEach(printPrevMessage)
    })
    function printPrevMessage(item) {
        let NAME = item['uid']
        let MSSG = item['mssg']
        let TIME = item['time']
        if (uid == NAME) {
            var printtext = document.getElementById('chatmsg');



            var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span class="mm">' + MSSG + '</span>' + '<span class="senttime" >' + TIME + '</span>' + '</span>' + '</div>';

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

    // }
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

        var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px; margin: 0px 10px; font-size:medium;">' + copiedtext + '</span>' + '<span class="senttime" >' + ('0' + currentdate.getHours()).slice(-2)+ ':' + ('0' + currentdate.getMinutes()).slice(-2) + '</span>' + '</span>' + '</div>';

        printtext.insertAdjacentHTML('beforeend', printnow);

        var bb = document.getElementById('journal-scroll');
        bb.scrollTop = bb.scrollHeight;

        db.collection('contacts').doc(uid).get().then((doc) => {

            let l = doc.data().list


            l[sessionStorage.getItem('senderuid')].push({
                'uid': uid,
                'mssg': copiedtext,
                'time': ('0' + currentdate.getHours()).slice(-2)+ ':' + ('0' + currentdate.getMinutes()).slice(-2)


            })

            db.collection('contacts').doc(uid).update({

                list: l

            })
        })



        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].textContent = copiedtext
        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("times")[0].textContent = ('0' + currentdate.getHours()).slice(-2)+ ':' + ('0' + currentdate.getMinutes()).slice(-2)

        // console.log(namedict[s.name])



        copytext.value = "";
    }

}







//recieving message
socket.on(uid, text => {
    var currentdate = new Date();
    console.log('recieved')
    document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].textContent = text.messagE
    document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("times")[0].textContent = ('0' + currentdate.getHours()).slice(-2)+ ':' + ('0' + currentdate.getMinutes()).slice(-2)
    if (sessionStorage.getItem('senderuid') == text.senderuid) {
        console.log('printing')
        var printtext = document.getElementById('chatmsg');


        var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + ('0' + currentdate.getHours()).slice(-2)+ ':' + ('0' + currentdate.getMinutes()).slice(-2) + '</span>' + '</div>' + '</div>';
        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;
    }
    // else {

    //     console.log("notif")

    //     document.body.insertAdjacentHTML('beforeend', '<div class="receive" id = "messagePopup"style = "position:absolute;right:calc(50% - 10rem);z-index:100;">' + '<div class="receive1" >' + '<div class="receiveMessage">' + '<p class="name">' + namedict[text.senderuid] + '</p>' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>');

    //     setTimeout(function () { document.getElementById("messagePopup").remove() }, 3000);
    // }

    firebase.firestore().collection('contacts').doc(uid).get().then((doc) => {

        let l = doc.data().list


        l[text.senderuid].push({
            'uid': text.senderuid,
            'mssg': text.messagE,
            'time': ('0' + currentdate.getHours()).slice(-2)+ ':' + ('0' + currentdate.getMinutes()).slice(-2)


        })

        firebase.firestore().collection('contacts').doc(uid).update({

            list: l

        })

    })

});





// // add contact
// const closemodal = document.getElementById("enter")
// closemodal.onclick = () => {
//     // sessionStorage.getItem(document.getElementById("names").value, 0)

//     //add in connection database
//     contactss.push({ 'name': document.getElementById("names").value, 'uid': document.getElementById("uid").value })
//     db.collection('connections').doc(uid).update({
//         name: contactss
//     })

//     db.collection('contacts').doc(uid).get().then((doc) => {


//         let k = doc.data().list


//         k[document.getElementById("uid").value] = []

//         console.log(k)
//         db.collection('contacts').doc(uid).update({

//             list: k
//         })
//     })
//     const li = '<li>' + '<button id=' + document.getElementById("names").value + ' class = "but"><img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/The_Friends_Stage.jpg/1280px-The_Friends_Stage.jpg" class = "imagestylecont">'
//         + '<div style = "display:flex; flex-direction:column">'
//         + '<div role="gridcell" aria-colindex="2" class="top">'
//         + '<div class="names">'
//         + document.getElementById("names").value
//         + '</div>'
//         + '<div class="times">'
//         + ''
//         + '</div>'
//         + '</div>'

//         + '<div class="lastmessage">'
//         + ''
//         + '</div>'
//         + '</div>'
//         + '</button>'
//         + '</li>'





//     const contactHTML = document.getElementById('contacts')
//     contactHTML.insertAdjacentHTML('beforeend', li);
//     document.getElementById(document.getElementById("names").value).addEventListener("click", function f() { try { hello(document.getElementById("names").value) } catch { console.error(); } });
//     namedict[document.getElementById("names").value] = document.getElementById("uid").value
//     namedict[document.getElementById("uid").value] = document.getElementById("names").value
//     const room_id = document.getElementById("room_id")
//     room_id.style.display = "none";



// }







// const openmodal = document.getElementById("addContact")


// openmodal.onclick = () => {
//     room_id.style.display = "flex";

// }

// // })















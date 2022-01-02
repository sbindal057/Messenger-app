const socket = io('/')
let uid = sessionStorage.getItem('user')
var l = {}
var c = []
let namedict = {}
let contactss = []
var dd = ''
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

//sorting contact
function sortList() {
    // console.log('sorting')
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("contacts");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("LI");

        // Loop through all list items:
        for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should
            switch place with the current item: */
            if (b[i].getElementsByClassName("times")[0].innerHTML < b[i + 1].getElementsByClassName("times")[0].innerHTML) {
                /* If next item is alphabetically lower than current item,
                mark as a switch and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}


// connected contacts
db.collection('connections').doc(uid).onSnapshot((doc) => {
    let mycontact = []

    mycontact = doc.data().name

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
            <div style = "display:flex; flex-direction:column;align-items: flex-start;">
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
            lii.push(s.name)

            const contactHTML = document.getElementById('contacts')
            contactHTML.innerHTML = html
        }

        // console.log(namedict[s.name])
        mycontact.sort((a, b) => a.name.localeCompare(b.name))
        mycontact.forEach(s => {


            if (s.email != uid) {
                if (docs.data().list[s.email] != undefined) {
                    if (docs.data().list[s.email].at(-1) != undefined) {
                        // console.log(docs.data().list[s.email].at(-1))
                        let ms = docs.data().list[s.email].at(-1)
                        con(ms, s)

                    }
                    else {
                        let ms = { 'mssg': 'Tap to chat', 'time': '', }
                        con(ms, s)

                    }
                }
                else {
                    let ms = { 'mssg': 'Tap to chat', 'time': '', }
                    con(ms, s)

                }
            }
        })
        // console.log(lii)
        sortList()
        lii.forEach(sss => {


            document.getElementById(sss.split(" ")[0]).addEventListener("click", function f() { try { hello(sss) } catch { console.error(); } });
        })
    })



})
//all contacts
db.collection('logins').doc('namelist').onSnapshot((doc) => {

    contactss = doc.data().listt
    // console.log(contactss)
    let html = ''
    let lii = []


    db.collection('contacts').doc(uid).get().then((docs) => {

        function con(ms, s) {


            const li = `
            <li>
            <button id=${s.name} class = "but">
            <img src = "${s.photo}" class = "imagestylecont">
            <div style = "display:flex; flex-direction:column;align-items: flex-start;">
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
            // console.log(s.name)
            namedict[s.name] = s.email
            namedict[s.email] = s.name.split(" ")[0]
            // console.log(namedict[s.email])
            namedict[s.name + 'photo'] = s.photo
            lii.push(s.name)
            // const contactHTML = document.getElementById('allcontacts')
            const contactHTML = document.getElementById('allcontacts')
            contactHTML.innerHTML = html
        }

        // console.log(namedict[s.name])
        contactss.sort((a, b) => a.name.localeCompare(b.name))
        let k = docs.data().list
        contactss.forEach(s=>{

            
           

            if (s.email != uid) {
                if (!k[s.email]) {
                    k[s.email] = []
                }
            }
            console.log(s.email)

            console.log(k)
            
        })
        db.collection('contacts').doc(uid).update({

            list: k
        })
        contactss.forEach(s => {
            // db.collection('contacts').doc(uid).get().then((docss) => {


            // })

            if (s.email != uid) {
                if (docs.data().list[s.email] != undefined) {
                if (docs.data().list[s.email].at(-1) != undefined) {
                    // console.log(docs.data().list[s.email].at(-1))
                    let ms = docs.data().list[s.email].at(-1)
                    con(ms, s)

                }
                else {
                    let ms = { 'mssg': 'Tap to chat', 'time': '', }
                    con(ms, s)

                }
                }
                else {
                    let ms = { 'mssg': 'Tap to chat', 'time': '', }
                    con(ms, s)

                }
            }
        })
        // console.log(lii)
        // sortList()
        lii.forEach(sss => {


            document.getElementById(sss.split(" ")[0]).addEventListener("click", function f() { try { hiii(sss) } catch { console.error(); } });
        })
    })



})

function hiii(data) {
    // console.log('heyy')

    db.collection('connections').doc(uid).get().then((doc) => {
        let l = doc.data().name
        let kk = 0
        l.forEach(element => {
            if (element.email == namedict[data]) kk = 1
        });
        if (kk == 0) {

            l.push(
                {
                    'name': data,
                    'email': namedict[data],
                    'photo': namedict[data + 'photo']
                }
            )
            db.collection('connections').doc(uid).update({

                name: l

            })
        }
    })
}
document.getElementById('mee').innerHTML = '<img src =' + sessionStorage.getItem('photo') + ' class = "imagestyle">'
function hello(data) {
    // console.log('clicked')


    sessionStorage.setItem('senderuid', namedict[data])

    const box = `<div class="messageArea" id="journal-scroll"> 
        <div id = "topname">
    
        </div>
               <div class=" " id="chatmsg"style="position: relative;top: 6vh;"> 
                      </div> 
                           </div>`
    let b = ''
    b += box
    // console.log(data)
    document.getElementById('inputPlace').style.display = 'flex'
    document.getElementById('messageBox').innerHTML = b;
    document.getElementById('topname').innerHTML = '<img src =' + namedict[data + 'photo'] + ' class = "imagestyle">' + data;



    //printing prev message


    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

    db.collection('contacts').doc(uid).get().then((doc) => {

        let mssgArray = doc.data().list[namedict[data]]

        // console.log(mssgArray)
        const ChatBox = document.getElementById("chatbox")
        // console.log(mssgArray)
        if (mssgArray != undefined) {

            if (mssgArray[0]['date'] == utc) {
                dd = 'TODAY'
            }
            else {
                dd = mssgArray[0]['date']
            }

            var printtext = document.getElementById('chatmsg');



            var printnow = '<div class = "datee">' + '<div class = "datee1">' + '<span>' + dd + '</span>' + '</div>' + '</div>'

            printtext.insertAdjacentHTML('beforeend', printnow);

            var box = document.getElementById('journal-scroll');
            box.scrollTop = box.scrollHeight;

            mssgArray.forEach(a => {

                if (dd != 'TODAY') {
                    if (dd != a['date']) {
                        if (a['date'] == utc) {
                            dd = 'TODAY'
                        }
                        else {
                            dd = a['date']
                        }
                        var printtext = document.getElementById('chatmsg');



                        var printnow = '<div class = "datee">' + '<div class = "datee1">' + '<span>' + dd + '</span>' + '</div>' + '</div>'

                        printtext.insertAdjacentHTML('beforeend', printnow);

                        var box = document.getElementById('journal-scroll');
                        box.scrollTop = box.scrollHeight;


                    }
                }

                printPrevMessage(a)
            }


            )
        }
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


}


var Input = document.getElementById("typemsg");
var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');


if (document.getElementById("typemsg") != null) {
    // console.log('open')
    var Input = document.getElementById("typemsg");
    Input.addEventListener("keydown", function (event) {

        if (event.code === "Enter") {
            // console.log('enter pressed')
            event.preventDefault();

            if (Input.value != "") document.getElementById("message").click();
        }
    });
}
if (document.getElementById('message') != null) {
    // console.log('cc')
    document.getElementById('message').onclick = () => {


        var copytext = document.getElementById('typemsg');
        // console.log("sended")
        socket.emit('mssg', {
            messagE: copytext.value,
            uid: sessionStorage.getItem('senderuid'),
            myuid: uid,



        })


        var printtext = document.getElementById('chatmsg');

        var currentdate = new Date();

        var copiedtext = copytext.value;
        if (dd != 'TODAY' || dd == '') {


            dd = 'TODAY'

            var printnow = '<div class = "datee">' + '<div class = "datee1">' + '<span>' + dd + '</span>' + '</div>' + '</div>'

            printtext.insertAdjacentHTML('beforeend', printnow);

            var box = document.getElementById('journal-scroll');
            box.scrollTop = box.scrollHeight;



        }


        var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px; margin: 0px 10px; font-size:medium;">' + copiedtext + '</span>' + '<span class="senttime" >' + ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2) + '</span>' + '</span>' + '</div>';

        printtext.insertAdjacentHTML('beforeend', printnow);

        var bb = document.getElementById('journal-scroll');
        bb.scrollTop = bb.scrollHeight;

        db.collection('contacts').doc(uid).get().then((doc) => {

            let l = doc.data().list


            l[sessionStorage.getItem('senderuid')].push({
                'uid': uid,
                'mssg': copiedtext,
                'time': ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2),
                'date': utc

            })

            db.collection('contacts').doc(uid).update({

                list: l

            })
        })
        firebase.firestore().collection('contacts').doc(sessionStorage.getItem('senderuid')).get().then((doc) => {

            let l = doc.data().list


            l[uid].push({
                'uid': uid,
                'mssg': copiedtext,
                'time': ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2),
                'date': utc

            })

            firebase.firestore().collection('contacts').doc(sessionStorage.getItem('senderuid')).update({

                list: l

            })

        })



        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].textContent = copiedtext
        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("times")[0].textContent = ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2)
        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].scrollTop
        sortList()
        // console.log(namedict[s.name])



        copytext.value = "";
    }

}







//recieving message
socket.on(uid, text => {
    var currentdate = new Date();
    // console.log('recieved')

    if (sessionStorage.getItem('senderuid') == text.senderuid) {
        // console.log('printing')
        var printtext = document.getElementById('chatmsg');
        if (dd != 'TODAY' || dd == '') {


            dd = 'TODAY'

            var printnow = '<div class = "datee">' + '<div class = "datee1">' + '<span>' + dd + '</span>' + '</div>' + '</div>'

            printtext.insertAdjacentHTML('beforeend', printnow);

            var box = document.getElementById('journal-scroll');
            box.scrollTop = box.scrollHeight;



        }


        var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2) + '</span>' + '</div>' + '</div>';
        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;
    }
    document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].textContent = text.messagE
    document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("times")[0].textContent = ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2)


    sortList()

});

const openmodal = document.getElementById("addContact")


openmodal.onclick = () => {
    room_id.style.display = "block";
    // console.log('ssssssss')

}
const closemodal = document.getElementById("close_room")

closemodal.onclick = () => {
    room_id.style.display = "none";

}

















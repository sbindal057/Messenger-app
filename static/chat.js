const socket = io('/')
let uid = sessionStorage.getItem('user')
var l = {}
let mssgArray = []
var c = []
let namedict = {}
let currentdate = new Date()
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

let lii = []
let lis = []

db.collection('logins').doc('namelist').get().then((doc) => {
    let l = doc.data().listt
    let kk = 0
    l.forEach(element => {
      if (element.email == sessionStorage.getItem('user')) {
        
        kk = 1
      }
    });
    if (kk == 0) {
      l.push(
        {
          'name': sessionStorage.getItem('username'),
          'email': sessionStorage.getItem('user'),
          'photo': sessionStorage.getItem('photo'),
          
        }
      )

    }
    db.collection('logins').doc('namelist').update({

      listt: l

    })

  })

  db.collection('contacts').doc(sessionStorage.getItem('user')).get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc);
    }
    else {
      return db.collection('contacts').doc(sessionStorage.getItem('user')).set({
        'list': {}
      })
    }
  })

  db.collection('status').doc(sessionStorage.getItem('user')).get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc);
    }
    else {
      return db.collection('status').doc(sessionStorage.getItem('user')).set({
        'list': {}
      })
    }
  })

  db.collection('connections').doc(sessionStorage.getItem('user')).get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc);
    }
    else {
      return db.collection('connections').doc(sessionStorage.getItem('user')).set({
        'name': []
      })
    }
  })








// connected contacts
db.collection('connections').doc(uid).onSnapshot((doc) => {
    let mycontact = []

    mycontact = doc.data().name

    let html = ''



    db.collection('contacts').doc(uid).get().then((docs) => {

        function con(ms, s) {
            let nam = s.name

            let showingtimestamp = ''
            if (ms['date'] == new Date().toJSON().slice(0, 10).replace(/-/g, '/')) {
                showingtimestamp = ms['time']

            }
            else if (ms['date'] == new Date(Date.now() - 864e5).toJSON().slice(0, 10).replace(/-/g, '/')) {
                showingtimestamp = 'Yesterday'

            }
            else if (!ms['date']) showingtimestamp = ''
            else {
                showingtimestamp = ms['date']
            }
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
            ${showingtimestamp}
            </div>
            </div>
            
            <div class="lastmessage">
            ${ms['mssg']}
            </div>
            </div>
            </button>
            </li>
            `
            namedict[s.name] = s.email
            namedict[s.email] = s.name.split(" ")[0]
            namedict[s.name + 'photo'] = s.photo

            html += li
            lis.push(s.name)

            const contactHTML = document.getElementById('contacts')
            contactHTML.innerHTML = html
        }


        mycontact.sort((a, b) => a.name.localeCompare(b.name))
        mycontact.forEach(s => {


            if (s.email != uid) {
                if (docs.data().list[s.email] != undefined) {
                    if (docs.data().list[s.email].at(-1) != undefined) {

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

        
        lis.forEach(sss => {


            document.getElementById(sss.split(" ")[0]).addEventListener("click", function f() { try { hello(sss) } catch { console.error(); } });
        })
    })
    sortList()



})



//all contacts
db.collection('logins').doc('namelist').onSnapshot((doc) => {

    contactss = doc.data().listt

    let html = ''

    db.collection('status').doc(uid).get().then((docs) => {
        let k = docs.data().list
        contactss.forEach(s => {




            if (s.email != uid) {
                if (!k[s.email]) {
                    k[s.email] = {
                        'status':'offline',
                        'date':'',
                        'time':'',
                    }
                }
            }


        })
        db.collection('status').doc(uid).update({

            list: k
        })

    })

    db.collection('contacts').doc(uid).get().then((docs) => {

        function con(s) {
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
            ${''}
            </div>
            </div>
            
            <div class="lastmessage">
            ${'Tap to add'}
            </div>
            </div>
            </button>
            </li>
            `

            html += li


            lii.push(s.name)

            const contactHTML = document.getElementById('allcontacts')
            contactHTML.innerHTML = html
        }


        contactss.sort((a, b) => a.name.localeCompare(b.name))
        let k = docs.data().list
        contactss.forEach(s => {




            if (s.email != uid) {
                if (!k[s.email]) {
                    k[s.email] = []
                }
            }


        })
        db.collection('contacts').doc(uid).update({

            list: k
        })
        contactss.forEach(s => {
            // db.collection('contacts').doc(uid).get().then((docss) => {


            // })

            if (s.email != uid) {
                namedict[s.name] = s.email
                namedict[s.email] = s.name.split(" ")[0]
                namedict[s.name + 'photo'] = s.photo
                console.log(lis.length)
                let ff = 0
                lis.forEach(kess => {
                    console.log('fsedf')
                    if(kess==s.name)ff=1
                })
                console.log(ff)
                if (ff!=1)
                    con(s)


            }
        })
        // sortList()
        lii.forEach(sss => {


            document.getElementById(sss.split(" ")[0]).addEventListener("click", function f() { try { hiii(sss) } catch { console.error(); } });
        })
    })


})




function hiii(data) {


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
    var elem = document.getElementById("allcontacts").querySelectorAll("#" + data.split(' ')[0]);
    elem[0].outerHTML = ''
    lii.remove(data)



}
// sessionStorage.setItem('senderuid','')
document.getElementById('mee').innerHTML = '<img src =' + sessionStorage.getItem('photo') + ' class = "imagestyle">'
db.collection('status').doc(uid).onSnapshot((docs) => {
    console.log('snap')
    let k = docs.data().list
    let xxx = sessionStorage.getItem('senderuid')
    let statuss = ''
    if(k[xxx]!=undefined){
        if(k[xxx]['status']=='online'||k[xxx]['status']=='offline')
        {
            statuss = k[xxx]['status']
        }
        else
        {
            statuss = 'Last seen '
            if(k[xxx]['date']==new Date().toJSON().slice(0, 10).replace(/-/g, '/')){
                statuss+=k[xxx]['time']
            }
            else{
                statuss+=k[xxx]['date']
            }

        }
    
    }
    if(document.getElementById('status'))
        document.getElementById('status').innerHTML = statuss
    
   

})
function hello(data) {
    console.log('clicked')
    let xxx = sessionStorage.getItem('senderuid')
    console.log('clicked')
    console.log(xxx)    
    if(xxx!=null){
    db.collection('status').doc(xxx).get().then((docs) => {
        console.log('xx')
        let k = docs.data().list
        k[uid] = {
            'status':'ofline',
            'time':('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2),
            'date': new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        }
        db.collection('status').doc(xxx).update({

            list: k
        })
    
    })
}
    db.collection('status').doc(namedict[data]).get().then((docs) => {
        console.log('xxxxxxx')
        let k = docs.data().list
        k[uid] = {
            'status':'online',
            'time':'',
            'date':'',
        }
        db.collection('status').doc(namedict[data]).update({

            list: k
        })
    
    })

    console.log('clicked')
    




    sessionStorage.setItem('senderuid', namedict[data])
    console.log('clicked')
    const box = `<div class="messageArea" id="journal-scroll"> 
        <div id = "topname">
        
    
        </div>
               <div class=" " id="chatmsg"style="position: relative;top: 6vh;"> 
                      </div> 
                           </div>`
    let b = ''
    b += box
    console.log(b)

    document.getElementById('inputPlace').style.display = 'flex'
    document.getElementById('messageBox').innerHTML = b;
    document.getElementById('topname').innerHTML = '<img src =' + namedict[data + 'photo'] + ' class = "imagestyle">' + '<div>'+data+'<p id = "status"class = "lastmessage"></p></div>';
    // console.log(namedict[data + 'photo'])
    db.collection('status').doc(uid).get().then((docs) => {
        
        console.log('snap')
        let k = docs.data().list
        let xxx = namedict[data]
        let statuss = ''
        
            if(k[xxx]['status']=='online'||k[xxx]['status']=='offline')
            {
                statuss =k[xxx]['status']
            }
            else
            {
                statuss = 'Last seen '
                if(k[xxx]['date']==new Date().toJSON().slice(0, 10).replace(/-/g, '/')){
                    statuss+=k[xxx]['time']
                }
                else{
                    statuss+=k[xxx]['date']
                }
    
            }
        
        console.log(statuss)

        if(document.getElementById('status'))
            document.getElementById('status').innerHTML = statuss
       
    
    })



    //printing prev message


    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

    db.collection('contacts').doc(uid).get().then((doc) => {

         mssgArray = doc.data().list[namedict[data]]


        const ChatBox = document.getElementById("chatbox")
        console.log(mssgArray)

        if (mssgArray[0] != undefined) {

            if (mssgArray[0]['date'] == utc) {
                dd = 'TODAY'
            }
            else if (mssgArray[0]['date'] == new Date(Date.now() - 864e5).toJSON().slice(0, 10).replace(/-/g, '/')) {
                dd = 'Yesterday'

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

                    if ((dd != a['date'] && dd != 'Yesterday') || (dd == 'Yesterday' && a['date'] != new Date(Date.now() - 864e5).toJSON().slice(0, 10).replace(/-/g, '/'))) {
                        if (a['date'] == utc) {
                            dd = 'TODAY'
                        }
                        else if (a['date'] == new Date(Date.now() - 864e5).toJSON().slice(0, 10).replace(/-/g, '/')) {
                            dd = 'Yesterday'

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

    var Input = document.getElementById("typemsg");
    Input.addEventListener("keydown", function (event) {

        if (event.code === "Enter") {

            event.preventDefault();

            if (Input.value != "") document.getElementById("message").click();
        }
    });
}
if (document.getElementById('message') != null) {

    document.getElementById('message').onclick = () => {


        var copytext = document.getElementById('typemsg');

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
        db.collection('connections').doc(sessionStorage.getItem('senderuid')).get().then((doc) => {
            let l = doc.data().name
            let kk = 0
            l.forEach(element => {
                if (element.email == uid) kk = 1
            });
            console.log(kk)
            console.log(sessionStorage.getItem('senderuid'))
            if (kk == 0) {
    
                l.push(
                    {
                        'name': sessionStorage.getItem('username'),
                        'email': uid,
                        'photo':sessionStorage.getItem('photo')
                    }
                )
                console.log(sessionStorage.getItem('senderuid'))
                db.collection('connections').doc(sessionStorage.getItem('senderuid')).update({
    
                    name: l
    
                })
            }
        })




        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].textContent = copiedtext
        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("times")[0].textContent = ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2)
        document.getElementById(namedict[sessionStorage.getItem('senderuid')]).getElementsByClassName("lastmessage")[0].scrollTop
        sortList()




        copytext.value = "";
    }

}







//recieving message
socket.on(uid, text => {
    var currentdate = new Date();


    if (sessionStorage.getItem('senderuid') == text.senderuid) {

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


}
const closemodal = document.getElementById("close_room")

closemodal.onclick = () => {
    room_id.style.display = "none";

}

//search in all contacts
var search = document.getElementById("search");
search.oninput = function () {




    if (search.value != "") {

        document.getElementById('finded').style.display = 'block';
        document.getElementById('finded1').innerHTML = ''

        let xx = ''
        let results = []
        lii.forEach(s => {
            if (s.substr(0, search.value.length).toLowerCase() == (search.value).toLowerCase()) {
                results.push(s)

                const lee = `
                    <li>
                    <button id=${s.split(" ")[0] + 'finded'} class = "but">
                    <img src = "${namedict[s + 'photo']}" class = "imagestylecont">
                    <div style = "display:flex; flex-direction:column;align-items: flex-start;">
                    <div role="gridcell" aria-colindex="2" class="top">
                    <div class="names">
                    ${s}          
                    </div>
                    
                    </div>
                    <div class="lastmessage">
                    ${'Tap to add'}
                    </div>
                    </div>
                    </button>
                    </li>
                    `


                xx += lee

                const contactHTML = document.getElementById('finded1')
                contactHTML.innerHTML = xx

            }
        })
        results.forEach(s => {
            document.getElementById(s.split(" ")[0] + 'finded').addEventListener("click", function f() { try { hiii(s) } catch { console.error(); } });
        })



    }
    else {

        if (document.getElementById('finded').style.display == 'block') document.getElementById('finded').style.display = 'none'

    }
    // }
};

document.getElementById('logout').onclick = ()=>{

    if(sessionStorage.getItem('senderuid')!=null){
        db.collection('status').doc(sessionStorage.getItem('senderuid')).get().then((docs) => {
            console.log('xx')
            let k = docs.data().list
            k[uid] = {
                'status':'ofline',
                'time':('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2),
                'date': new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
            }
            db.collection('status').doc(sessionStorage.getItem('senderuid')).update({
    
                list: k
            })
        
        })
    }

}

//search in added contacts

var searchcon = document.getElementById("searchcon");
searchcon.oninput = function () {




    if (searchcon.value != "") {

        document.getElementById('findedcon').style.display = 'block';
        document.getElementById('findedcon1').innerHTML = ''

        let xx = ''
        let results = []
        lis.forEach(s => {
            if (s.substr(0, searchcon.value.length).toLowerCase() == (searchcon.value).toLowerCase()) {
                results.push(s)

                const lee = `
                    <li>
                    <button id=${s.split(" ")[0] + 'findedcon'} class = "but">
                    <img src = "${namedict[s + 'photo']}" class = "imagestylecont">
                    <div style = "display:flex; flex-direction:column;align-items: flex-start;">
                    <div role="gridcell" aria-colindex="2" class="top">
                    <div class="names">
                    ${s}          
                    </div>
                    <div class="times">
            ${document.getElementById(s.split(" ")[0]).getElementsByClassName("times")[0].textContent}
            </div>
                    </div>
                    <div class="lastmessage">
                    ${document.getElementById(s.split(" ")[0]).getElementsByClassName("lastmessage")[0].textContent}
                    </div>
                    </div>
                    </button>
                    </li>
                    `


                xx += lee

                const contactHTML = document.getElementById('findedcon1')
                contactHTML.innerHTML = xx

            }
        })
        results.forEach(s => {
            document.getElementById(s.split(" ")[0] + 'findedcon').addEventListener("click", function f() { try { hello(s) } catch { console.error(); } });
        })



    }
    else {

        if (document.getElementById('findedcon').style.display == 'block') document.getElementById('findedcon').style.display = 'none'

    }
    // }
};

document.getElementById('logout').onclick = ()=>{

    if(sessionStorage.getItem('senderuid')!=null){
        db.collection('status').doc(sessionStorage.getItem('senderuid')).get().then((docs) => {
            console.log('xx')
            let k = docs.data().list
            k[uid] = {
                'status':'ofline',
                'time':('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2),
                'date': new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
            }
            db.collection('status').doc(sessionStorage.getItem('senderuid')).update({
    
                list: k
            })
        
        })
    }

}













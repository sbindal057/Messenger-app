const socket = io('/')

window.addEventListener("DOMContentLoaded", () => {
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

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore()
  db.settings({ timestampsInSnapshots: true });

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);






  document
    .getElementById("google_signin")
    .addEventListener('click', (event) => {

      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.
        auth().
        signInWithPopup(provider)

        .then((result) => {

          sessionStorage.setItem('uid', result.user.uid)
          sessionStorage.setItem('user', result.user.email)
          sessionStorage.setItem('username', result.user.displayName)
          sessionStorage.setItem('photo', result.user.photoURL)

          return result.user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
              },
              body: JSON.stringify({ idToken }),
            });
          });
        })
        .then(() => {
          db.collection('logins').doc('namelist').get().then((doc) => {
            let l = doc.data().listt
            let kk = 0
            l.forEach(element => {
              if(element.email == sessionStorage.getItem('user'))kk = 1
            });
            if(kk==0){
            l.push(
              {
                'name': sessionStorage.getItem('username'),
                'email': sessionStorage.getItem('user'),
                'photo': sessionStorage.getItem('photo')
              }
            )
            db.collection('logins').doc('namelist').update({

              listt: l

          })
        }
          })

        })
        .then(() => {
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
        })
        .then(() => {
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
        })
        .then(() => {
          return firebase.auth().signOut();
        })
        .then(() => {
          window.location.assign("/profile");
        });


    });

})
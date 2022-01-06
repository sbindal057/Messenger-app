const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
var admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");


const serviceAccount = require("./serviceAccountKey.json")
app.set('view engine', 'ejs')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://videochat-shweta-default-rtdb.firebaseio.com"
});


const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;


app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/", function (req, res) {

  res.sendFile(__dirname + '/views/auth.html');
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + '/views/signup.html');
});

app.get("/profile", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.sendFile(__dirname + '/views/c.html');
    })
    .catch((error) => {
      res.redirect("/");
    });
});


app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
 
});





app.get('/chat/:room', (req, res) => {

  rr = req.params.room;
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render('chat', { roomId: req.params.room })
    })
    .catch((error) => {
      res.redirect("/");
    });



})

io.on('connection', socket => {

//   socket.on('join-room', (roomId, userId) => {

//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId)

//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//     socket.on('screen-sharing-disconnect', () => {
//       socket.to(roomId).broadcast.emit('screen-disconnected', userId)
//     })

//   })



  // console.log('a user connected');
  socket.on('mssg', (mssg) => {
    console.log(mssg);
    io.emit(mssg.uid, { messagE: ` ${mssg.messagE}`,recieveruid:`${mssg.uid}`,senderuid:`${mssg.myuid}` });
  });
  // socket.on('onstatus', (st) => {
  //   console.log(st);
  //   io.emit(st.uidstatus, { status: ` ${st.status}`,time:`${st.time}`,date:`${st.date}`,of:`${st.myuid}` });
  // });
  // socket.on('ofstatus', (st) => {
    
  //   io.emit(st.uidstatus, { status: ` ${st.status}`,time:`${st.time}`,date:`${st.date}`,of:`${st.myuid}` });
  // });

  io.emit('id', socket.id)

})

server.listen(process.env.PORT || 3000)



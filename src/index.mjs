//npm run start:dev

import express from "express"; // not need of using require. package.json type --> module
// no need to refresh terminal because package nodemon
const app = express();

app.use(express.json());

//middlewar -->

const middleware = (req, res, next) => {
  const { id } = req.params;
  const idParsed = parseInt(id);
  if (isNaN(idParsed)) return res.sendStatus(400);
  const findUserIndex = users.findIndex((user) => user.id === idParsed);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex; // request is required for the others middlewares to access that property
  next(); // it is required to allow the following middleware to initiate.
};

const PORT = process.env.PORT || 3000;

const users = [
  { id: 4, name: "Joseph", surname: "San" },
  { id: 3, name: "Juan", surname: "Saez" },
  { id: 2, name: "Julia", surname: "Martin" },
  { id: 1, name: "Ester", surname: "Gamacho" },
  { id: 5, name: "Pepe", surname: "Galve" },
];

// route

app.get("/", (req, res) => {
  res.status(201).send({ msg: "How you doing?" });
});

//route & query string

app.get("/api/users", (req, res) => {
  //filter data using query string to withdraw key elements to manage the filter method
  const { filter, value } = req.query;
  if (filter && value) {
    return res.send(users.filter((user) => user[filter].includes(value)));
  } else {
    res.send(users);
  }
});

// params

app.get("/api/users/:id", middleware,  (req, res) => {
  const { findUserIndex } = req
  return res.status(200).send(users[findUserIndex]);
});


// create new user

app.post("/api/users", (req, res) => {
  const { body } = req;
  const randomId = Math.floor(Math.random() * 1000);
  const newUser = { id: randomId, ...body };
  users.push(newUser);
  return res.status(201).send(newUser);
});

// put to modify all the user CAREFUL!!! you require to write all the keys otherways they will disappear

app.put("/api/users/:id", middleware, (req, res) => {
  const { body, findUserIndex, } = req;
  users[findUserIndex] = { id: users[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

//patch just modify the key you want to modify no need to indluce the other keys.

app.patch("/api/users/:id", middleware, (req, res) => {
  const { body, findUserIndex } = req;
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return res.sendStatus(200);
});

//delete

app.delete("/api/users/:id", middleware, (req, res) => {
  const { findUserIndex } = req;
  users.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

// app connected to port

app.listen(PORT, () => {
  console.log(`PORT on ${PORT}`);
});

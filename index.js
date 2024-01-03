import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "*****",
  port: 5432,
});

db.connect();

let quiz = [
  { id: 1, country: 'Afghanistan', capitals: 'Kabul' },
  { id: 2, country: 'Aland Islands', capitals: 'Mariehamn' },
  { id: 3, country: 'Albania', capitals: 'Tirana' },
  { id: 4, country: 'Algeria', capitals: 'Algiers' },
  { id: 5, country: 'American Samoa', capitals: 'Pago Pago' }
];

db.query("SELECT * FROM capitals LIMIT 5", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
    console.log(quiz);
  }
  db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion.capitals);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  console.log(answer);
  console.log(currentQuestion.capitals);
  let isCorrect = false;
  if (currentQuestion.capitals.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  

  currentQuestion = randomCountry;

}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

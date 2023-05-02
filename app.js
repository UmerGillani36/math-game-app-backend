const express = require("express");

const authRouter = require("./routes/auth");

const leaderRouter = require("./routes/leaderboard");
const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/game", leaderRouter);


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
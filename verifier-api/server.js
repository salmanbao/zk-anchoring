const express = require("express");
const verifyRoute = require("./verify");

const app = express();
app.use(express.json());

app.use("/verify", verifyRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ ZK Verifier service listening on port ${PORT}`);
});

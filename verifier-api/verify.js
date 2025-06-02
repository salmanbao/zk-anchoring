const express = require("express");
const router = express.Router();
const verifyProof = require("./verifier");

router.post("/", async (req, res) => {
  const { proof, publicSignals } = req.body;

  if (!proof || !publicSignals) {
    return res.status(400).json({ error: "Missing proof or publicSignals" });
  }

  const isValid = await verifyProof(proof, publicSignals);

  if (isValid) {
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

module.exports = router;

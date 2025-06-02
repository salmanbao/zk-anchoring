const snarkjs = require("snarkjs");
const fs = require("fs");

async function verifyProof(proof, publicSignals) {
  const vKey = JSON.parse(fs.readFileSync("../setup/verifier.json"));

  try {
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    return res;
  } catch (err) {
    console.error("Verification error:", err);
    return false;
  }
}

module.exports = verifyProof;

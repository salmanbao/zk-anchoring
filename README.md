Here is a complete, clean, and professional `README.md` file for your project, covering everything you've built up to this point:

---

```markdown
# 🔐 ZKIPP – Zero-Knowledge Inclusion Proof Protocol for IoT Batches

This project provides a modular framework for **verifiable inclusion proofs** across **multi-domain IoT networks** (Electricity, Water, Gas) using **zero-knowledge SNARKs**.

It replaces naive Merkle root anchoring with **zkSNARK-based inclusion proofs**, allowing decentralized validators to verify data integrity **without accessing the entire batch**.

---

## 📁 Project Structure

```.

ZKIPP/
├── circuits/                # circom circuits
│   ├── inclusion.circom
├── setup/                   # trusted setup & ZK assets
│   ├── inclusion.r1cs
│   ├── inclusion.wasm
│   ├── inclusion.zkey
│   ├── verifier.json
│   ├── witness.wtns
│   ├── public.json
│   └── proof.json
├── utils/                   # proof + Merkle utilities
│   ├── buildMerkleTree.js
│   ├── generateProof.js
│   ├── input.json
├── verifier-api/                # Verifier API module
│   ├── server.js
│   ├── verifier.js
│   └── routes/
│       └── verify.js
├── package.json
└── README.md

````

---

## 🚀 End-to-End Setup

### 1. 📦 Install Prerequisites

```bash
npm install
````

---

### 2. 🧠 Compile Circuit

```bash
npx circom circuits/inclusion.circom --r1cs --wasm --sym -o setup/
```

---

### 3. 🔐 Trusted Setup (Phase 2)

```bash
# Run Powers of Tau ceremony (if not yet done)
npx snarkjs powersoftau new bn128 14 setup/powersOfTau28_hez_final_16.ptau -v
npx snarkjs powersoftau contribute setup/powersOfTau28_hez_final_16.ptau setup/pot14_final.ptau --name="First contribution" -v

# Generate proving + verification keys
npx snarkjs groth16 setup setup/inclusion.r1cs setup/pot14_final.ptau setup/inclusion.zkey
```

---

### 4. 📤 Export Verification Key

```bash
npx snarkjs zkey export verificationkey setup/inclusion.zkey setup/verifier.json
```

---

### 5. 🌳 Generate Merkle Tree + Proof Inputs

```bash
node utils/buildMerkleTree.js   # Generates and logs tree + proofs
```

---

### 6. 🧾 Generate zkSNARK Proof

```bash
node utils/generateProof.js
```

Outputs:

* `setup/proof.json`
* `setup/public.json`
* `setup/witness.wtns`

---

### 7. ✅ Verify Proof (CLI)

```bash
npx snarkjs groth16 verify setup/verifier.json setup/public.json setup/proof.json
```

Should return:

```
OK!
```

---

## 🌐 ZK Verifier API

A simple off-chain API to validate inclusion proofs.

### 📦 Start Server

```bash
node verifier/server.js
```

### 📤 POST /verify

```http
POST http://localhost:5000/verify
Content-Type: application/json

{
  "proof": { ... },
  "publicSignals": [ ... ]
}
```

### ✅ Response

```json
{ "valid": true }
```

---

## 📘 Conceptual Flow

```
[IoT Device (Electricity/Water/Gas)]
           ↓
[Store Data on IOTA → get blockId]
           ↓
[Batch multiple blockIds]
           ↓
[Build Merkle Tree → Snapshot Root]
           ↓
[Generate ZK Proof for (blockId, domainTag)]
           ↓
[Anchor Root on Tendermint]
           ↓
[Verifier receives (blockId, domainTag, root, proof)]
           ↓
[Off-chain ZK Verifier validates inclusion]
```

---

## 🧪 Testing

To test end-to-end:

```bash
# Step 1: Compile & Setup Circuit (if not already done)
# Step 2: Generate Tree, Input, and Proof
node utils/buildMerkleTree.js
node utils/generateProof.js

# Step 3: Verify via CLI
npx snarkjs groth16 verify setup/verifier.json setup/public.json setup/proof.json

# Step 4: Verify via API
curl -X POST http://localhost:5000/verify \
  -H "Content-Type: application/json" \
  -d @payload.json
```

Where `payload.json` contains:

```json
{
  "proof": { ... },
  "publicSignals": [ ... ]
}
```

---

## 🧠 Notes

* `blockId` and `domainTag` are Poseidon-hashed together as the **leaf**.
* Merkle root is considered the **snapshot anchor**.
* This system is **modular**, and can later be upgraded to rollups or multi-layer ZK validations.

---

## 📜 License

MIT — for academic and research use.

---

## 👨‍🔬 Maintained by

**Salman — PhD Researcher in ZK IoT Security**

```

---

Let me know if you want this tailored for academic submission, GitHub publishing, or a paper appendix format.
```

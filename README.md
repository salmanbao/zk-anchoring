# ZKIPP - Zero-Knowledge Cross-Domain Validation Protocol

## Overview
We propose a Zero-Knowledge Inclusion Proof Protocol (ZKIPP), enabling validators to prove the presence of domain-tagged IoT transactions in anchored snapshots 
without disclosing Merkle path, sibling nodes, or domain metadata. This is achieved through a Poseidon-based zkSNARK circuit, which supports fast, lightweight 
privacy-preserving validation as a standalone module

## Objective
Prove that `blockId ∈ snapshotRoot` without revealing the Merkle path or domain tag.

---

## Stack
- Prover: Circom + SnarkJS (Groth16)
- Hash: Poseidon
- Snapshot Registry: off-chain (JSON or key-value)
- Verifier: Off-chain, optional REST service

---

## Modules

### 1. Merkle Tree Generator
- Poseidon-based
- Input: `{ blockId, domain }[]`
- Output:
  - `snapshotRoot`
  - `merklePathMap[blockId]`

---

### 2. zkCircuit (Circom)
- Private inputs:
  - `blockId`
  - `domainTag`
  - `merklePath`
- Public input:
  - `snapshotRoot`
- Output: zkProof

---

### 3. Prover API
- Accepts proof request (blockId + domainTag + path)
- Returns zkProof + publicInputs

---

### 4. Verifier API
- Accepts proof + publicInputs
- Runs `snarkjs verify`
- Returns `true/false`

---

## Registry Format

```json
{
  "2025-05-31T10:00:00Z": {
    "snapshotRoot": "poseidon-hash",
    "digest": "blake3-of-blockIds"
  }
}

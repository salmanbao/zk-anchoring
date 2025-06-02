const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');
const { buildMerkleTree, hashLeaf, hashToField } = require('./merkleBuilder');
const { execSync } = require('child_process');

const CONFIG = {
  circuitName: 'inclusion',
  wasmPath: './setup/inclusion_js/inclusion.wasm',
  zkeyPath: './setup/inclusion.zkey',
  inputPath: './input.json',
  witnessPath: './setup/witness.wtns',
  proofPath: './setup/proof.json',
  publicPath: './setup/public.json'
};

async function generateProof(entry, merkleProof, root) {
  const blockId = BigInt(entry.blockId);
  const domainTag = entry.domainTag;
  const domainTagField = hashToField(domainTag);

  const input = {
    root: root.toString(),
    blockId: blockId.toString(),
    domainTag: domainTagField.toString(),
    pathElements: merkleProof.pathElements.map(e => e.toString()),
    pathIndices: merkleProof.pathIndices
  };

  // Save input
  fs.writeFileSync(CONFIG.inputPath, JSON.stringify(input, null, 2));

  // Generate witness
  execSync(`npx snarkjs wtns calculate ${CONFIG.wasmPath} ${CONFIG.inputPath} ${CONFIG.witnessPath}`);

  // Generate proof
  execSync(`npx snarkjs groth16 prove ${CONFIG.zkeyPath} ${CONFIG.witnessPath} ${CONFIG.proofPath} ${CONFIG.publicPath}`);

  console.log('\n✅ zkProof generated.');
  console.log(`📁 Proof:   ${CONFIG.proofPath}`);
  console.log(`📁 Public:  ${CONFIG.publicPath}`);
}

async function main() {
  const batch = [
    { blockId: 1001, domainTag: 'energy' },
    { blockId: 1002, domainTag: 'water' }
    // Add more as needed
  ];

  const { root, proofs } = buildMerkleTree(batch);

  // Generate proof for the first leaf as example
  const index = 0;
  const entry = batch[index];
  const merkleProof = proofs[index];

  await generateProof(entry, merkleProof, root);
}

if (require.main === module) {
  main();
}

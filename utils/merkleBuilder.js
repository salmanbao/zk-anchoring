const { keccak256, toUtf8Bytes } = require('ethers');
const { IncrementalMerkleTree } = require('@zk-kit/incremental-merkle-tree');
const { poseidon2 } = require('poseidon-lite');

const TREE_DEPTH = 16;
const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617"); // bn128

function hashToField(str) {
  const hex = keccak256(toUtf8Bytes(str));
  return BigInt(hex) % FIELD_MODULUS;
}

function hashLeaf(blockId, domainTag) {
  return poseidon2([BigInt(blockId), hashToField(domainTag)]);
}

function buildMerkleTree(entries) {
  const leaves = entries.map(({ blockId, domainTag }) =>
    hashLeaf(blockId, domainTag)
  );

  const tree = new IncrementalMerkleTree(poseidon2, TREE_DEPTH, BigInt(2));

  leaves.forEach((leaf) => tree.insert(leaf));

  const root = tree.root;

  const proofs = leaves.map((leaf, index) => {
    const { siblings, pathIndices } = tree.createProof(index);
    return {
      leaf,
      pathElements: siblings,
      pathIndices,
    };
  });

  return {
    root,
    leaves,
    proofs,
  };
}

// === Example usage ===
async function main() {
  const batch = [
    { blockId: 1001, domainTag: 'energy' },
    { blockId: 1002, domainTag: 'water' },
    { blockId: 1003, domainTag: 'gas' },
  ];

  const result = buildMerkleTree(batch);

  console.log('Snapshot Root:', result.root.toString());
  result.proofs.forEach((proof, i) => {
    console.log(`\n--- Leaf ${i + 1} ---`);
    console.log('Leaf Hash:', proof.leaf.toString());
    console.log('Path Elements:', proof.pathElements.map(e => e.toString()));
    console.log('Path Indices:', proof.pathIndices);
  });
}

if (require.main === module) {
  main();
}

module.exports = { buildMerkleTree, hashLeaf, hashToField };

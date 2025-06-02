module.exports = {
  merkle: {
    levels: 16,
    hashFunction: "poseidon"
  },
  snapshotRegistryPath: "./registry/snapshots.json",
  proverWasm: "./setup/inclusion_js/inclusion.wasm",
  zkeyFile: "./setup/inclusion.zkey",
  verificationKey: "./setup/verifier.json"
};

pragma circom 2.0.0;

include "../circomlib/circuits/poseidon.circom";
include "../circomlib/circuits/verify-merkle-path.circom";

// Configuration
template InclusionProof(depth) {

    // === PUBLIC INPUTS ===
    signal input root;            // Snapshot root (public)
    
    // === PRIVATE INPUTS ===
    signal input blockId;         // e.g. as field element
    signal input domainTag;       // e.g. hash(domain string)
    signal input pathElements[depth]; // Merkle siblings
    signal input pathIndices[depth];  // 0 = left, 1 = right

    // === INTERNAL SIGNALS ===
    signal hashLeaf;

    // Step 1: Poseidon hash of (blockId, domainTag)
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== blockId;
    poseidon.inputs[1] <== domainTag;
    hashLeaf <== poseidon.out;

    // Step 2: Merkle path verification
    component inclusion = VerifyMerklePath(depth);
    for (var i = 0; i < depth; i++) {
        inclusion.pathElements[i] <== pathElements[i];
        inclusion.pathIndices[i] <== pathIndices[i];
    }
    inclusion.leaf <== hashLeaf;

    // Output: Must match snapshot root
    root === inclusion.root;
}

component main = InclusionProof(16);
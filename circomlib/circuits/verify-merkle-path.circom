pragma circom 2.0.0;

include "./poseidon.circom";

template PositionSwitcher() {
    signal input in[2];
    signal input s;
    signal output out[2];

    s * (1 - s) === 0;
    out[0] <== (in[1] - in[0]) * s + in[0];
    out[1] <== (in[0] - in[1]) * s + in[1];
}

template VerifyMerklePath(levels) {
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    signal output root;


    component selectors[levels];
    component hashers[levels];
    signal computedPath[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = PositionSwitcher();

        if (i == 0) {
            selectors[i].in[0] <== leaf;
        } else {
            selectors[i].in[0] <== computedPath[i - 1];
        }

        selectors[i].in[1] <== pathElements[i];
        selectors[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== selectors[i].out[0];
        hashers[i].inputs[1] <== selectors[i].out[1];
        computedPath[i] <== hashers[i].out;
    }

    root <== computedPath[levels - 1];
}

# Starfleet Node

A FRAME-based starfleet node outlined in [OT-RFC-07](https://github.com/OriginTrail/OT-RFC-repository/blob/main/RFCs/OT-RFC-07%20Multichain%20OriginTrail%20Decentralized%20Network%20-%20Starfleet%20stage.pdf)


## Prerequests
 - Rust
 - Node 12 or higher
  

## Build and run

Check that the new dependencies resolve correctly by running:

`SKIP_WASM_BUILD=1 cargo check -p node-template-runtime`

Compile the node in release mode with:

`WASM_BUILD_TOOLCHAIN=nightly-2020-10-05 cargo build --release`

Run a temporary node in development mode

`./target/release/node-template --dev --tmp`
/* ==========================================================================
   BAYORA SHA-256 CRYPTOGRAPHIC LEDGER ENGINE (WEB CRYPTO API)
   ========================================================================== */

class CryptoLedgerEngine {
  constructor() {
    this.chain = [];
    this.signer = "BAYORA-BROKER-PUBKEY-0x9F82A1";
    this.isTampered = false;
    this.tamperedIndex = -1;
  }

  // Convert buffer to hex string
  bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Calculate real SHA-256 using Web Crypto API
  async calculateHash(prevHash, timestamp, eventData) {
    const textToHash = `${prevHash}|${timestamp}|${JSON.stringify(eventData)}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(textToHash);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return this.bufferToHex(hashBuffer);
  }

  // Initialize Genesis Block
  async initGenesisBlock() {
    const ts = "2026-10-03T12:00:00.000Z";
    const genesisData = {
      type: "GENESIS_INITIALIZATION",
      actor: "BROKER",
      details: "Bayora Zero-Trust Cryptographic Ledger Initialized"
    };
    const prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const hash = await this.calculateHash(prevHash, ts, genesisData);

    const genesisBlock = {
      index: 0,
      timestamp: ts,
      prevHash: prevHash,
      hash: hash,
      event: genesisData,
      signer: this.signer,
      verified: true,
      tampered: false
    };

    this.chain = [genesisBlock];
    return genesisBlock;
  }

  // Append new event block to chain
  async appendEvent(eventData) {
    if (this.chain.length === 0) {
      await this.initGenesisBlock();
    }

    const prevBlock = this.chain[this.chain.length - 1];
    const ts = eventData.ts || new Date().toISOString();
    const index = this.chain.length;
    const hash = await this.calculateHash(prevBlock.hash, ts, eventData);

    const block = {
      index: index,
      timestamp: ts,
      prevHash: prevBlock.hash,
      hash: hash,
      event: eventData,
      signer: this.signer,
      verified: true,
      tampered: false
    };

    this.chain.push(block);
    return block;
  }

  // Verify full chain integrity (A7 animation sweep helper)
  async verifyChain() {
    let isValid = true;
    const results = [];

    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      if (i === 0) {
        // Genesis check
        const expectedHash = await this.calculateHash("0000000000000000000000000000000000000000000000000000000000000000", block.timestamp, block.event);
        const blockValid = (expectedHash === block.hash);
        results.push({ index: i, valid: blockValid });
        if (!blockValid) isValid = false;
      } else {
        const prevBlock = this.chain[i - 1];
        // Check hash link & recalculated hash
        const expectedHash = await this.calculateHash(prevBlock.hash, block.timestamp, block.event);
        const linkValid = (block.prevHash === prevBlock.hash);
        const hashValid = (expectedHash === block.hash);

        const blockValid = linkValid && hashValid && !block.tampered;
        results.push({ index: i, valid: blockValid });
        if (!blockValid) isValid = false;
      }
    }

    return { isValid, results };
  }

  // Dev Toggle: Tamper simulation (corrupt a block's event data)
  tamperBlock(index) {
    if (index > 0 && index < this.chain.length) {
      this.chain[index].event.payload_corrupted = "UNAUTHORIZED_ALTERATION_ATTEMPT_0xDEADBEEF";
      this.chain[index].tampered = true;
      this.isTampered = true;
      this.tamperedIndex = index;
      return true;
    }
    return false;
  }

  // Restore chain integrity
  async restoreChain() {
    this.isTampered = false;
    this.tamperedIndex = -1;
    // Recompute all hashes
    for (let i = 1; i < this.chain.length; i++) {
      delete this.chain[i].event.payload_corrupted;
      this.chain[i].tampered = false;
      this.chain[i].prevHash = this.chain[i - 1].hash;
      this.chain[i].hash = await this.calculateHash(this.chain[i].prevHash, this.chain[i].timestamp, this.chain[i].event);
    }
  }

  getChain() {
    return this.chain;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

window.bayoraLedger = new CryptoLedgerEngine();

import sys
import json
from backend.crypto_ledger import CryptographicLedger

def verify_cli():
    print("==========================================================")
    print("[+] TRISEAL STANDALONE AUDIT LEDGER VERIFIER (Ed25519/SHA-256)")
    print("==========================================================")
    
    ledger = CryptographicLedger()
    
    # Generate mock evaluation events
    ledger.append_event({
        "ts": "2026-10-08T12:01:00.000Z",
        "actor": "RED",
        "type": "PAYLOAD_RELAYED",
        "verdict": "BLOCKED"
    })
    ledger.append_event({
        "ts": "2026-10-08T12:02:00.000Z",
        "actor": "BLUE",
        "type": "TOKEN_ISSUED",
        "verdict": "PASSED"
    })

    print("\nExecuting Cryptographic Proof Sweep...")
    result = ledger.verify_chain()

    print(f"\nLedger Chain Height: {result['chain_height']} blocks")
    print(f"Signer Public Key (Ed25519): 0x{result['signer_pubkey'][:16]}...")
    print(f"Overall Chain Integrity: {'[VALID] VERIFIED' if result['is_valid'] else '[INVALID] MUTATED'}")

    for block_res in result["blocks"]:
        status = "[VALID]" if block_res["valid"] else "[INVALID]"
        print(f"  - Block #{block_res['index']}: {status} (SHA-256 Match: {block_res.get('hash_matches')}, Ed25519 Sig Match: {block_res.get('signature_valid')})")

    print("\nExporting Verification Assurance Report...")
    report = ledger.generate_assurance_report()
    print(json.dumps(report, indent=2))
    print("\nAudit Verification Completed Successfully.")

if __name__ == "__main__":
    verify_cli()

/* ==========================================================================
   PAGE: AUDIT LEDGER (SHA-256 HASH CHAIN, VERIFY SWEEP, TAMPER SIMULATION)
   ========================================================================== */

function renderAuditLedgerPage(container) {
  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between;">
      <div>
        <div class="display-title">
          Audit <span style="color: var(--text-secondary); font-style: italic;">Ledger</span>
        </div>
        <div style="color: var(--text-secondary); margin-top: 4px;">
          Tamper-evident, cryptographically signed SHA-256 Merkle Hash-Chain forensic provenance trail
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <button class="btn btn-secondary" id="tamper-sim-btn">
          ⚡ Dev Toggle: Tamper Simulation
        </button>
        <button class="btn btn-primary" id="verify-chain-btn">
          🛡 Verify Chain Integrity (SHA-256)
        </button>
      </div>
    </div>

    <!-- Verification Status Banner -->
    <div id="verify-status-banner" style="display:none; margin-bottom: 20px; padding: 12px 16px; border-radius: 4px; font-family: var(--font-mono); font-size: 13px; font-weight: 600;">
      <!-- Dynamic Banner text -->
    </div>

    <!-- Main Container: Vertical Chain (Left) & Block Detail Table (Right) -->
    <div class="grid-12">
      <!-- Left Column: Vertical Hash Chain -->
      <div class="col-7 card card-tick">
        <div class="card-header">
          <div class="panel-title">
            <span class="peak-marker lichen"></span> Cryptographic Block Chain Timeline
          </div>
          <span class="chip chip-lichen" id="chain-length-chip">0 BLOCKS</span>
        </div>

        <div id="chain-blocks-container" style="display:flex; flex-direction:column; gap:16px; position:relative; padding-left: 20px;">
          <!-- Blocks rendered dynamically -->
        </div>
      </div>

      <!-- Right Column: Ledger Summary & Hash Inspector -->
      <div class="col-5 card card-tick">
        <div class="card-header">
          <div class="panel-title">
            <span class="peak-marker bone"></span> Hash Inspector & Verification Spec
          </div>
          <span class="chip chip-bone">SHA-256</span>
        </div>

        <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 14px; border-radius: 4px; margin-bottom: 16px;">
          <div class="eyebrow-label" style="margin-bottom: 6px;">HASH FORMULA</div>
          <code style="font-family: var(--font-mono); font-size: 11px; color: var(--saffron); word-break: break-all;">
            Hash(N) = SHA-256( Hash(N-1) + Timestamp + EventJSON )
          </code>
        </div>

        <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 14px; border-radius: 4px; margin-bottom: 16px;">
          <div class="eyebrow-label" style="margin-bottom: 6px;">PLATFORM SIGNER KEY</div>
          <code style="font-family: var(--font-mono); font-size: 11px; color: var(--lichen);">
            ${window.bayoraLedger.signer}
          </code>
        </div>

        <div style="font-size: 12px; color: var(--text-secondary); line-height: 18px;">
          Every evaluation event across Red, Blue, and Target LLM containers is bound to an immutable block. Attempting to alter any historical prompt payload invalidates subsequent SHA-256 digests immediately.
        </div>
      </div>
    </div>
  `;

  renderChainBlocks();

  // Attach button listeners
  const verifyBtn = document.getElementById('verify-chain-btn');
  const tamperBtn = document.getElementById('tamper-sim-btn');

  verifyBtn?.addEventListener('click', async () => {
    await runChainVerificationSweep();
  });

  tamperBtn?.addEventListener('click', async () => {
    if (!window.bayoraLedger.isTampered) {
      // Tamper block #1 or #2
      window.bayoraLedger.tamperBlock(1);
      alert('⚠ DEV TAMPER SIMULATION TRIGGERED: Block #1 payload data corrupted. Click "Verify Chain Integrity" to see cryptographic detection!');
    } else {
      await window.bayoraLedger.restoreChain();
      alert('✓ Chain integrity restored!');
    }
    renderChainBlocks();
  });

  // Re-render when new blocks arrive (using key 'auditLedger')
  window.bayoraSocket.onEvent('auditLedger', () => {
    renderChainBlocks();
  });
}

function renderChainBlocks() {
  const container = document.getElementById('chain-blocks-container');
  const chip = document.getElementById('chain-length-chip');
  if (!container) return;

  const blocks = window.bayoraLedger.getChain();
  if (chip) chip.textContent = `${blocks.length} BLOCKS`;

  container.innerHTML = blocks.map((b, idx) => {
    const isTampered = b.tampered;
    const borderColor = isTampered ? 'var(--fuchsia)' : 'var(--border-hair)';
    const chipType = isTampered ? 'chip-fuchsia' : 'chip-lichen';
    const statusText = isTampered ? 'CORRUPTED' : 'VERIFIED';

    return `
      <div class="card card-block" id="block-card-${b.index}" style="border: 1px solid ${borderColor}; padding: 12px; position:relative; background: var(--bg-raised);">
        <!-- Connecting Vertical Line -->
        ${idx < blocks.length - 1 ? `
          <div style="position:absolute; left:-14px; top: 24px; width: 2px; height: calc(100% + 16px); background: ${isTampered ? 'var(--fuchsia)' : 'var(--lichen)'}; z-index:1;"></div>
        ` : ''}

        <!-- Left Node Dot -->
        <div style="position:absolute; left:-18px; top: 16px; width: 10px; height: 10px; border-radius:50%; background: ${isTampered ? 'var(--fuchsia)' : 'var(--lichen)'}; z-index:2;"></div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px;">
          <div style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--text-primary);">
            Block #${b.index}
          </div>
          <span class="chip ${chipType}">${statusText}</span>
        </div>

        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">
          Timestamp: ${b.timestamp}
        </div>

        <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 8px; border-radius: 2px; font-family: var(--font-mono); font-size: 11px; margin-bottom: 6px;">
          <div style="color: var(--text-secondary);">EVENT: <span style="color: var(--text-primary);">${b.event.type} (${b.event.actor})</span></div>
          ${b.event.payload_corrupted ? `<div style="color: var(--fuchsia); font-weight:bold;">TAMPER DATA: ${b.event.payload_corrupted}</div>` : ''}
        </div>

        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); word-break: break-all;">
          prev: <span style="color: var(--text-secondary);">${b.prevHash.substring(0, 16)}…</span><br>
          hash: <span style="color: var(--saffron);">${b.hash}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Chain Verification Sweep Animation (A7)
async function runChainVerificationSweep() {
  const banner = document.getElementById('verify-status-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.style.background = 'var(--bg-overlay)';
    banner.style.color = 'var(--text-primary)';
    banner.style.border = '1px solid var(--border-strong)';
    banner.textContent = '⏳ RUNNING SHA-256 RE-DIGEST SWEEP ACROSS CHAIN...';
  }

  const { isValid, results } = await window.bayoraLedger.verifyChain();

  for (let i = 0; i < results.length; i++) {
    const card = document.getElementById(`block-card-${i}`);
    if (card) {
      card.style.borderColor = 'var(--saffron)';
      await new Promise(r => setTimeout(r, 80)); // 80ms per block delay (A7)

      if (results[i].valid) {
        card.style.borderColor = 'var(--lichen)';
      } else {
        card.style.borderColor = 'var(--fuchsia)';
        card.classList.add('shake-violation');
      }
    }
  }

  if (banner) {
    if (isValid) {
      banner.style.background = 'var(--lichen-dim)';
      banner.style.color = 'var(--lichen)';
      banner.style.border = '1px solid var(--lichen)';
      banner.textContent = '✓ CHAIN INTEGRITY VERIFIED: All SHA-256 block hashes match append-only ledger.';
    } else {
      banner.style.background = 'var(--fuchsia-dim)';
      banner.style.color = 'var(--fuchsia)';
      banner.style.border = '1px solid var(--fuchsia)';
      banner.textContent = '🚨 INTEGRITY FAILURE: Cryptographic hash discrepancy detected in chain! Subsequent block hashes broken.';
    }
  }
}

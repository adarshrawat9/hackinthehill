/* ==========================================================================
   PAGE: ISOLATION MAP (SVG NODE GRAPH, CONTOUR ISLAND SUBNETS, PACKET FLOWS)
   ========================================================================== */

function renderIsolationMapPage(container) {
  container.innerHTML = `
    <!-- Page Title -->
    <div style="margin-bottom: 16px; display:flex; align-items:center; justify-content:space-between;">
      <div>
        <div class="display-title">
          Isolation <span style="color: var(--text-secondary); font-style: italic;">Map</span>
        </div>
        <div style="color: var(--text-secondary); margin-top: 4px;">
          Interactive topology of isolated execution sandboxes, micro-segmented VNets, and zero-trust broker policy routes
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <span class="chip chip-vermilion">RED SUBNET (10.240.1.0/24)</span>
        <span class="chip chip-glacier">BLUE SUBNET (10.240.2.0/24)</span>
        <span class="chip chip-saffron">TARGET SUBNET (10.240.3.0/24)</span>
      </div>
    </div>

    <!-- Main Topology Canvas Container -->
    <div class="card card-tick card-hero" style="min-height: 560px; padding: 0; overflow:hidden; position:relative; background-color: var(--bg-inset);">
      <svg id="isolation-svg" width="100%" height="560" viewBox="0 0 1000 560" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Packet Blur Filter -->
          <filter id="packet-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Dynamic Contour Island Subnet Boundaries (Dashed Organic Outlines) -->

        <!-- 1. Red Sandbox Contour Island -->
        <path d="M 50 340 C 40 280, 160 270, 280 280 C 330 330, 310 490, 240 510 C 120 520, 40 460, 50 340 Z"
              fill="rgba(255,90,54,0.03)" stroke="#FF5A36" stroke-width="1.5" stroke-dasharray="6,4" />
        <text x="70" y="305" fill="#FF5A36" font-family="IBM Plex Sans" font-size="11" font-weight="600" letter-spacing="0.1em">
          🔒 RED-TEAM ISOLATED SUBNET (VNet 10.240.1.0/24)
        </text>

        <!-- 2. Blue Sandbox Contour Island -->
        <path d="M 370 340 C 360 280, 480 270, 600 280 C 650 330, 630 490, 560 510 C 440 520, 360 460, 370 340 Z"
              fill="rgba(127,200,220,0.03)" stroke="#7FC8DC" stroke-width="1.5" stroke-dasharray="6,4" />
        <text x="390" y="305" fill="#7FC8DC" font-family="IBM Plex Sans" font-size="11" font-weight="600" letter-spacing="0.1em">
          🔒 BLUE-TEAM ISOLATED SUBNET (VNet 10.240.2.0/24)
        </text>

        <!-- 3. Target LLM Contour Island -->
        <path d="M 690 340 C 680 280, 800 270, 920 280 C 970 330, 950 490, 880 510 C 760 520, 680 460, 690 340 Z"
              fill="rgba(244,183,63,0.03)" stroke="#F4B73F" stroke-width="1.5" stroke-dasharray="6,4" />
        <text x="710" y="305" fill="#F4B73F" font-family="IBM Plex Sans" font-size="11" font-weight="600" letter-spacing="0.1em">
          🔒 TARGET LLM SUBNET (VNet 10.240.3.0/24)
        </text>

        <!-- NO DIRECT PATH Boundary Line between Red & Blue -->
        <line x1="320" y1="360" x2="350" y2="480" stroke="#FF3D81" stroke-width="2" stroke-dasharray="4,4" />
        <rect x="290" y="410" width="90" height="20" rx="2" fill="#0E1411" stroke="#FF3D81" stroke-width="1" />
        <text x="335" y="424" fill="#FF3D81" font-family="IBM Plex Mono" font-size="9" text-anchor="middle" font-weight="600">
          NO DIRECT PATH
        </text>

        <!-- NETWORK EDGES -->
        <!-- Path 1: Dashboard to Broker -->
        <path id="path-dash-broker" d="M 500 80 L 500 140" stroke="#ECE7DA" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="510" y="115" fill="#A3AB9F" font-family="IBM Plex Mono" font-size="10">WebSocket / mTLS</text>

        <!-- Path 2: Broker to Red Sandbox -->
        <path id="path-broker-red" d="M 400 180 C 250 180, 180 240, 180 340" stroke="#FF5A36" stroke-width="1.5" fill="none"/>

        <!-- Path 3: Broker to Blue Sandbox -->
        <path id="path-broker-blue" d="M 500 210 L 500 340" stroke="#7FC8DC" stroke-width="1.5" fill="none"/>

        <!-- Path 4: Broker to Target LLM -->
        <path id="path-broker-target" d="M 600 180 C 750 180, 820 240, 820 340" stroke="#F4B73F" stroke-width="1.5" fill="none"/>

        <!-- ANIMATED DIAMOND PACKETS (A4 Motion) -->
        <!-- Packet 1: Red Packet -->
        <g filter="url(#packet-glow)">
          <rect width="8" height="8" fill="#FF5A36" transform="rotate(45)">
            <animateMotion path="M 180 340 C 180 240, 250 180, 400 180" dur="2.2s" repeatCount="indefinite"/>
          </rect>
        </g>
        <!-- Packet 2: Blue Packet -->
        <g filter="url(#packet-glow)">
          <rect width="8" height="8" fill="#7FC8DC" transform="rotate(45)">
            <animateMotion path="M 500 340 L 500 210" dur="1.8s" repeatCount="indefinite"/>
          </rect>
        </g>
        <!-- Packet 3: Target Packet -->
        <g filter="url(#packet-glow)">
          <rect width="8" height="8" fill="#F4B73F" transform="rotate(45)">
            <animateMotion path="M 600 180 C 750 180, 820 240, 820 340" dur="2.5s" repeatCount="indefinite"/>
          </rect>
        </g>

        <!-- NODE BLOCKS -->

        <!-- Node 1: SOC Dashboard -->
        <g class="topology-node" data-node-id="soc-dashboard" style="cursor:pointer;">
          <rect x="380" y="30" width="240" height="50" rx="2" fill="#141C18" stroke="#ECE7DA" stroke-width="1.5"/>
          <text x="500" y="52" fill="#ECE7DA" font-family="Bricolage Grotesque" font-size="14" font-weight="700" text-anchor="middle">▲ Bayora SOC Dashboard</text>
          <text x="500" y="68" fill="#A3AB9F" font-family="IBM Plex Sans" font-size="10" text-anchor="middle">Operator Control & Audit Console</text>
        </g>

        <!-- Node 2: Zero-Trust Broker (Largest Notched Hero Node) -->
        <g class="topology-node" data-node-id="zero-trust-broker" style="cursor:pointer;">
          <rect x="280" y="140" width="440" height="70" rx="4" fill="#141C18" stroke="#C5E063" stroke-width="2"/>
          <text x="500" y="165" fill="#C5E063" font-family="Bricolage Grotesque" font-size="16" font-weight="800" text-anchor="middle">▲ ZERO-TRUST BROKER & AUDIT ENGINE</text>
          <text x="500" y="184" fill="#A3AB9F" font-family="IBM Plex Sans" font-size="11" text-anchor="middle">Blind Payload Relay • Capability Tokens • Merkle Hash Chain • Timing Normalizer</text>
        </g>

        <!-- Node 3: Red Sandbox Node -->
        <g class="topology-node" data-node-id="red-team-sandbox" style="cursor:pointer;">
          <rect x="80" y="340" width="200" height="120" rx="4" fill="#141C18" stroke="#FF5A36" stroke-width="1.5"/>
          <text x="180" y="370" fill="#FF5A36" font-family="Bricolage Grotesque" font-size="14" font-weight="700" text-anchor="middle">▲ Red-Team Sandbox</text>
          <text x="180" y="390" fill="#A3AB9F" font-family="IBM Plex Sans" font-size="11" text-anchor="middle">AdvBench & HarmBench</text>
          <rect x="100" y="410" width="160" height="22" rx="2" fill="#0A0F0D" stroke="#24312B"/>
          <text x="180" y="425" fill="#FF5A36" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">seccomp: red_sandbox</text>
        </g>

        <!-- Node 4: Blue Sandbox Node -->
        <g class="topology-node" data-node-id="blue-team-sandbox" style="cursor:pointer;">
          <rect x="400" y="340" width="200" height="120" rx="4" fill="#141C18" stroke="#7FC8DC" stroke-width="1.5"/>
          <text x="500" y="370" fill="#7FC8DC" font-family="Bricolage Grotesque" font-size="14" font-weight="700" text-anchor="middle">▲ Blue-Team Sandbox</text>
          <text x="500" y="390" fill="#A3AB9F" font-family="IBM Plex Sans" font-size="11" text-anchor="middle">Defensive Guardrails</text>
          <rect x="420" y="410" width="160" height="22" rx="2" fill="#0A0F0D" stroke="#24312B"/>
          <text x="500" y="425" fill="#7FC8DC" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">seccomp: blue_guardrail</text>
        </g>

        <!-- Node 5: Target LLM Engine Node -->
        <g class="topology-node" data-node-id="target-llm-engine" style="cursor:pointer;">
          <rect x="720" y="340" width="200" height="120" rx="4" fill="#141C18" stroke="#F4B73F" stroke-width="1.5"/>
          <text x="820" y="370" fill="#F4B73F" font-family="Bricolage Grotesque" font-size="14" font-weight="700" text-anchor="middle">▲ Target LLM Engine</text>
          <text x="820" y="390" fill="#A3AB9F" font-family="IBM Plex Sans" font-size="11" text-anchor="middle">Stateless Model Core</text>
          <rect x="740" y="410" width="160" height="22" rx="2" fill="#0A0F0D" stroke="#24312B"/>
          <text x="820" y="425" fill="#F4B73F" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">seccomp: target_llm</text>
        </g>
      </svg>

      <div style="position:absolute; bottom: 12px; left: 16px; font-size: 11px; color: var(--text-muted);">
        💡 Click any network node to inspect runtime policy rules, cgroups v2 resource caps & seccomp profiles.
      </div>
    </div>

    <!-- Right Drawer Container (A14 Slide Drawer) -->
    <div id="node-drawer-backdrop" class="drawer-backdrop">
      <div class="drawer-content" id="node-drawer-body">
        <!-- Content dynamically injected -->
      </div>
    </div>
  `;

  // Attach click listeners to topology nodes
  document.querySelectorAll('.topology-node').forEach(el => {
    el.addEventListener('click', () => {
      const nodeId = el.getAttribute('data-node-id');
      const nodeData = window.BAYORA_CONFIG.topologyNodes.find(n => n.id === nodeId);
      if (nodeData) {
        openNodeDrawer(nodeData);
      }
    });
  });

  const backdrop = document.getElementById('node-drawer-backdrop');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('active');
    }
  });
}

function openNodeDrawer(node) {
  const backdrop = document.getElementById('node-drawer-backdrop');
  const drawerBody = document.getElementById('node-drawer-body');
  if (!backdrop || !drawerBody) return;

  const actorColor = node.color === 'vermilion' ? 'var(--vermilion)' : (node.color === 'glacier' ? 'var(--glacier)' : (node.color === 'saffron' ? 'var(--saffron)' : 'var(--lichen)'));

  drawerBody.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-hair); padding-bottom: 16px;">
      <div>
        <div style="font-family: var(--font-display); font-size: 18px; font-weight: 700; color: ${actorColor};">
          <span class="peak-marker ${node.color}"></span> ${node.name}
        </div>
        <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 4px;">
          ${node.subnet || 'CONTROL ROUTE'}
        </div>
      </div>
      <button class="btn btn-ghost" id="drawer-close-btn">✕</button>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="eyebrow-label" style="margin-bottom: 8px;">STATUS & TYPE</div>
      <div style="display:flex; gap:8px;">
        <span class="chip chip-${node.color}">${node.status}</span>
        <span class="chip chip-bone">${node.type} NODE</span>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="eyebrow-label" style="margin-bottom: 8px;">RESOURCE GOVERNANCE (CGROUPS v2)</div>
      <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px;">
        <div>CPU QUOTA: <span style="color: var(--text-primary);">${node.caps.cpu}</span></div>
        <div>MEMORY CAP: <span style="color: var(--text-primary);">${node.caps.mem}</span></div>
        <div>IO PROFILE: <span style="color: var(--text-primary);">${node.caps.io || node.caps.crypto || node.caps.cache || 'Default'}</span></div>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="eyebrow-label" style="margin-bottom: 8px;">SECCOMP SYSCALL PROFILE</div>
      <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">
        profile: <code>${node.seccomp}</code><br>
        policy: DEFAULT_DENY<br>
        allowed_syscalls: [read, write, futex, epoll_wait, mmap, brk]
      </div>
    </div>

    ${node.chips ? `
      <div style="margin-bottom: 20px;">
        <div class="eyebrow-label" style="margin-bottom: 8px;">ACTIVE SUBSYSTEM CHIPS</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${node.chips.map(c => `<span class="chip chip-lichen">${c}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    <div>
      <button class="btn btn-secondary" style="width:100%;" id="drawer-close-btn-2">
        Close Inspection Drawer
      </button>
    </div>
  `;

  backdrop.classList.add('active');

  document.getElementById('drawer-close-btn')?.addEventListener('click', () => backdrop.classList.remove('active'));
  document.getElementById('drawer-close-btn-2')?.addEventListener('click', () => backdrop.classList.remove('active'));
}

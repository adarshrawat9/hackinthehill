/* ==========================================================================
   BAYORA SOC CONFIG & STATIC DATA
   ========================================================================== */

window.BAYORA_CONFIG = {
  version: "v2.4.0-ridgeline",
  session: "SESSION-2026-HACKHILLS-04",
  mtls: "TLS_AES_256_GCM_SHA384 (VERIFIED)",

  // Colors mapping for JS Canvas / SVG inline renderers
  colors: {
    vermilion: "#FF5A36",
    glacier: "#7FC8DC",
    saffron: "#F4B73F",
    lichen: "#C5E063",
    fuchsia: "#FF3D81",
    bone: "#ECE7DA",
    bgVoid: "#090D0B",
    bgBase: "#0E1411",
    bgRaised: "#141C18",
    bgOverlay: "#1B2621",
    borderHair: "#24312B",
    borderStrong: "#3A4D43"
  },

  // Isolation Map Nodes & Subnets Specification
  topologyNodes: [
    {
      id: "soc-dashboard",
      name: "Bayora SOC Dashboard",
      type: "CONTROL",
      color: "bone",
      subtitle: "Operator UI & Telemetry Aggregator",
      caps: { cpu: "0.5 Core", mem: "512 MB", network: "Internal TLS" },
      seccomp: "strict_operator_profile.json",
      status: "ACTIVE"
    },
    {
      id: "zero-trust-broker",
      name: "Zero-Trust Broker & Audit Engine",
      type: "BROKER",
      color: "lichen",
      subtitle: "Blind Relay & SHA-256 Ledger Manager",
      chips: ["Blind Payload Relay", "Capability Token Manager", "Merkle Hash Chain Ledger", "Timing-Normalized Router"],
      caps: { cpu: "4.0 Cores", mem: "8192 MB", crypto: "Hardware AES-NI" },
      seccomp: "broker_zero_trust.json",
      status: "SECURE"
    },
    {
      id: "red-team-sandbox",
      name: "Red-Team Sandbox",
      subnet: "Subnet 10.240.1.0/24 (vermilion)",
      type: "ATTACKER",
      color: "vermilion",
      subtitle: "Adversarial Payload & Jailbreak Engine",
      features: ["AdvBench / HarmBench Suite", "Micro-Segmented VNet", "No Egress Internet"],
      caps: { cpu: "2.0 Cores", mem: "4096 MB", io: "Cgroup v2 Restricted" },
      seccomp: "red_isolated_sandbox.json",
      status: "ISOLATED"
    },
    {
      id: "blue-team-sandbox",
      name: "Blue-Team Sandbox",
      subnet: "Subnet 10.240.2.0/24 (glacier)",
      type: "DEFENDER",
      color: "glacier",
      subtitle: "Defensive Guardrail & Classifier Engine",
      features: ["Defensive Guardrail", "Input/Output Filter", "Read-Only Model Ref"],
      caps: { cpu: "2.0 Cores", mem: "4096 MB", io: "Read-Only Volumes" },
      seccomp: "blue_guardrail_isolation.json",
      status: "ISOLATED"
    },
    {
      id: "target-llm-engine",
      name: "Target LLM Engine",
      subnet: "Subnet 10.240.3.0/24 (saffron)",
      type: "TARGET",
      color: "saffron",
      subtitle: "Stateless Target LLM Instance",
      features: ["Context Purge Engine", "KV-Cache Hardening", "Strict Token Limits"],
      caps: { cpu: "8.0 Cores (GPU Virtualized)", mem: "32768 MB", cache: "Stateless Zero-Flush" },
      seccomp: "target_llm_sandbox.json",
      status: "ISOLATED"
    }
  ],

  // Risk Matrix Items (5x5 Grid)
  riskItems: [
    { row: 4, col: 4, level: 5, id: "RM-01", name: "KV-Cache Side Channel", actor: "vermilion", likelihood: "High", impact: "Critical", residual: "Negligible (Purge enforced)", mitigations: "Per-turn KV cache total memory flush & zeroing", failsIf: "GPU hardware driver fails memory reset call" },
    { row: 3, col: 4, level: 4, id: "RM-02", name: "Pre-Trial Payload Leakage", actor: "vermilion", likelihood: "Moderate", impact: "High", residual: "Low (Blind proxy sealed)", mitigations: "Payloads encrypted with broker capability keys until trial end", failsIf: "Broker memory compromised via kernel exploit" },
    { row: 4, col: 2, level: 4, id: "RM-03", name: "Timing Side-Channel Inference", actor: "vermilion", likelihood: "High", impact: "Moderate", residual: "Low (Normalized delay)", mitigations: "Broker adds dummy jitter buffer to normalize response timing to 50ms +/- 1ms", failsIf: "Server load spikes delay past 200ms" },
    { row: 2, col: 3, level: 3, id: "RM-04", name: "Blue-Team Classifier Inference", actor: "glacier", likelihood: "Low", impact: "Moderate", residual: "Low", mitigations: "Blue defense logic executed in read-only sandbox without return log access to Red", failsIf: "Shared CPU cache leakage across container boundaries" },
    { row: 1, col: 1, level: 1, id: "RM-05", name: "Cross-Tenant Subnet Egress", actor: "bone", likelihood: "Negligible", impact: "Low", residual: "Zero", mitigations: "Strict iptables default-DROP policies between Red & Blue VNets", failsIf: "Container breakout (e.g. dirty pipe CVE)" }
  ],

  // Threat Model Document Tables
  threatModelData: {
    assets: [
      { asset: "Adversarial Attack Payloads", owner: "Red Team", sensitivity: "High", boundary: "Red Sandbox" },
      { asset: "Defensive Guardrail Rules", owner: "Blue Team", sensitivity: "High", boundary: "Blue Sandbox" },
      { asset: "Target LLM Weights & Context", owner: "Client / Model", sensitivity: "Critical", boundary: "LLM Subnet" },
      { asset: "Forensic Audit Log", owner: "Auditor / Platform", sensitivity: "High", boundary: "Broker Hash-Chain" }
    ],
    adversaries: [
      { adversary: "Malicious Red-Team Tenant", goal: "Exfiltrate Blue defense logic or bypass safety audit log", capability: "Custom prompt injections, timing attacks" },
      { adversary: "Curious Blue-Team Tenant", goal: "Observe Red-Team attack vectors before official release", capability: "Network sniffing, shared volume inspection" },
      { adversary: "Compromised Target LLM", goal: "Exfiltrate prompt history to external C2 server", capability: "Inference data exfiltration via side channels" }
    ],
    protections: [
      { capability: "Container Micro-Segmentation", mechanism: "cgroups v2, rootless Podman/Docker, custom seccomp filtering" },
      { capability: "Zero-Trust Blind Relay", mechanism: "Payloads sealed with ephemeral AES-256 GCM keys, released post-eval" },
      { capability: "Cryptographic Provenance", mechanism: "SHA-256 Merkle Hash-Chain append-only ledger signed by Broker" },
      { capability: "KV-Cache Wiping", mechanism: "Explicit cache flush API call after every prompt evaluation cycle" }
    ]
  }
};

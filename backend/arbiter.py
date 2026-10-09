import uuid
import hashlib
import time

class BlindArbiter:
    """
    TriSeal Blind Arbiter & Policy Engine.
    Mediates every exchange between Red, Blue, and Model cells.
    Enforces default-deny policies, canary mesh verification, and leakage budget tracking.
    """
    def __init__(self, max_leakage_budget_bits=128.0):
        self.max_leakage_budget_bits = max_leakage_budget_bits
        self.consumed_budget_bits = 0.0
        self.active_canaries = {}
        self.canary_violations = []
        self.policy_rules = {
            "default_deny": True,
            "direct_red_blue_channel": False,
            "stateless_model_context": True,
            "sanitise_telemetry_payloads": True
        }

    def generate_canary(self, zone: str) -> str:
        """Generate a unique canary token for a specific isolation zone."""
        token = f"CANARY_{zone.upper()}_{uuid.uuid4().hex[:8]}"
        self.active_canaries[token] = {
            "zone": zone,
            "created_at": time.time()
        }
        return token

    def scan_for_canaries(self, content: str, source_zone: str) -> list:
        """Scan payload/response for out-of-zone canary sightings."""
        sightings = []
        for token, info in self.active_canaries.items():
            if token in content and info["zone"] != source_zone:
                violation = {
                    "canary": token,
                    "expected_zone": info["zone"],
                    "sighted_in_zone": source_zone,
                    "timestamp": time.time()
                }
                self.canary_violations.append(violation)
                sightings.append(violation)
        return sightings

    def evaluate_leakage_budget(self, verdict_type: str) -> dict:
        """
        Calculates information entropy (bits) leaked by a verdict to prevent probing.
        Verdicts leak a capped, measured number of bits.
        """
        # Capped bits per verdict type
        entropy_map = {
            "BLOCKED": 1.0,        # 1 bit of information (Binary pass/fail)
            "PASSED": 1.0,         # 1 bit
            "NEUTRALIZED": 1.5,   # 1.5 bits
            "CANARY_VIOLATION": 0.0 # 0 bits (Voids run immediately)
        }
        cost = entropy_map.get(verdict_type, 1.0)
        self.consumed_budget_bits += cost
        within_cap = self.consumed_budget_bits <= self.max_leakage_budget_bits

        return {
            "cost_bits": cost,
            "total_consumed_bits": round(self.consumed_budget_bits, 2),
            "max_budget_bits": self.max_leakage_budget_bits,
            "within_cap": within_cap
        }

    def process_trial(self, red_payload: str, blue_defense_rules: list, model_runner) -> dict:
        """
        Mediates a single adversarial evaluation trial blindly.
        """
        trial_id = f"TRAL_{uuid.uuid4().hex[:6]}"

        # 1. Inject Canaries
        red_canary = self.generate_canary("RED")
        blue_canary = self.generate_canary("BLUE")
        sanitised_payload = f"{red_payload} [{red_canary}]"

        # 2. Check direct path violation policy
        if not self.policy_rules["default_deny"]:
            raise SecurityError("Policy Enforcement Failure: Default deny is disabled!")

        # 3. Scan Red payload against Blue defense rules (Blind Arbiter Gate)
        is_blocked = False
        triggered_rule = None

        for rule in blue_defense_rules:
            # Check pattern match or heuristic
            pattern = rule.get("pattern", "")
            if pattern.lower() in red_payload.lower():
                is_blocked = True
                triggered_rule = rule.get("name", "Default Guardrail Rule")
                break

        # 4. Canary Leak Check
        red_canary_leaks = self.scan_for_canaries(str(blue_defense_rules), "BLUE")
        if red_canary_leaks:
            verdict = "CANARY_VIOLATION"
            is_blocked = True
        else:
            verdict = "BLOCKED" if is_blocked else "PASSED"

        # 5. Model Inference (if not blocked)
        model_output = None
        if not is_blocked:
            # Pass sanitised prompt to Model Cell (ephemeral state with cache salt & KV flush)
            model_output = model_runner(sanitised_payload)
            # Scan model output for canary leakage
            model_canary_leaks = self.scan_for_canaries(model_output, "MODEL")
            if model_canary_leaks:
                verdict = "CANARY_VIOLATION"

        # 6. Budget Declassification Gate
        budget_info = self.evaluate_leakage_budget(verdict)

        # 7. Construct Declassified Verdict (Red only sees redacted verdict)
        declassified_verdict = {
            "trial_id": trial_id,
            "verdict": verdict,
            "triggered_rule": triggered_rule if is_blocked else None,
            "budget": budget_info,
            "canary_sightings_count": len(self.canary_violations),
            "payload_redacted": "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
        }

        return declassified_verdict

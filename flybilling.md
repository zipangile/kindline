# Fly.io Billing Report & Cost Optimization Recommendations

This report provides a breakdown of your current Fly.io resource usage and suggestions to reduce monthly costs.

## Executive Summary
* **Estimated Monthly Cost:** ~$21.32 USD (excluding data egress)
* **Primary Cost Driver:** `betpawa-bot` Machine (2GB RAM in Johannesburg region)
* **Status:** 2 apps running, 3 apps suspended.

---

## Current Resource Breakdown (Estimated)

| Resource | App | Region | Details | Est. Monthly Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Compute** | `betpawa-bot` | jnb | shared-cpu-1x, 2GB RAM | $17.28 |
| **Compute** | `ubuntuplay` | jnb | shared-cpu-1x, 256MB RAM | $3.14 |
| **Volumes** | `kindline-care` | jnb | 1GB | $0.15 |
| **Volumes** | `betpawa-bot` | jnb | 1GB | $0.15 |
| **Volumes** | `ubuntuplay` | jnb | 3GB | $0.45 |
| **Volumes** | `helenasparlour` | lhr | 1GB | $0.15 |
| **IPs** | All | Global | Shared IPv4 / Dedicated IPv6 | Free |
| **TOTAL** | | | | **$21.32** |

---

## Specific Recommendations to Lower Costs

### 1. Optimize `betpawa-bot` RAM (High Impact)
* **Observation:** The bot is configured with **2GB of RAM**, which is quite high for a typical bot.
* **Action:** Scale the memory down to **512MB** or **1GB** if the application allows.
* **Savings:**
    * Scaling to 1GB: Saves **$8.08/mo**
    * Scaling to 512MB: Saves **$12.12/mo**
* **Command:** `fly scale memory 512 -a betpawa-bot`

### 2. Enable Autostop for `ubuntuplay`
* **Observation:** `ubuntuplay` is currently set to `autostop: false` with `min_machines_running: 1`. This means it runs 24/7 even when no one is accessing it.
* **Action:** Update the configuration to allow autostop.
* **Savings:** Significant, depending on usage. If only used 4 hours a day, you could save **~$2.60/mo**.
* **Action:** Set `autostop = true` in `fly.toml` or via `fly machine update`.

### 3. Cleanup Suspended Apps and Unused Volumes
* **Observation:** `helenasparlour` and `zilile-v3-1` are suspended, but `helenasparlour` still has a 1GB volume provisioned. `kindline-care` also has a 1GB volume.
* **Action:** If these projects are no longer needed, delete the apps entirely. If you want to keep the apps but not the data, delete the volumes.
* **Savings:** **$0.30/mo** (Small, but keeps the account clean).

### 4. Reduce `ubuntuplay` Volume Size
* **Observation:** `ubuntuplay` has a **3GB volume**.
* **Action:** If the app doesn't require 3GB of persistent storage, recreate the volume with **1GB**.
* **Savings:** **$0.30/mo**.

---

## General Fly.io Cost-Saving Tips

1. **Use Shared IPv4:** Dedicated IPv4 addresses cost $2/mo. Always prefer the default shared IPv4 unless you have a specific requirement for a dedicated one.
2. **Monitor "Ghost" Volumes:** Volumes are billed even if the Machine is stopped or the App is suspended. Always check `fly volumes list` for orphan volumes.
3. **Region Choice:** Johannesburg (`jnb`) has a significant price markup (approx. 1.62x) compared to US or Europe regions. If low latency to South Africa isn't critical, moving apps to `ams` or `fra` could reduce costs by ~40%.
4. **Machine Sizing:** Always start with 256MB or 512MB and scale up only if you see OOM (Out of Memory) errors in your logs.

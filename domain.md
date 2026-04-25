# DNS Configuration for kindlinecare.org

To connect the Fly.io application to your domain, please add the following records to your Cloudflare DNS settings:

## Apex Domain (kindlinecare.org)
| Type | Name | Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| A | @ | 66.241.124.213 | DNS Only (Recommended for initial validation) |
| AAAA | @ | 2a09:8280:1::105:b8a6:0 | DNS Only (Recommended for initial validation) |
| TXT | _fly-ownership | app-xkm5ezn | N/A |

## WWW Subdomain (www.kindlinecare.org)
| Type | Name | Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| A | www | 66.241.124.213 | DNS Only (Recommended for initial validation) |
| AAAA | www | 2a09:8280:1::105:b8a6:0 | DNS Only (Recommended for initial validation) |
| TXT | _fly-ownership.www | app-xkm5ezn | N/A |

### Notes:
1. **Proxy Status:** It is recommended to set these to **"DNS Only"** initially so Fly.io can verify the domain and issue SSL certificates. Once Fly.io shows the certificates as "Verified", you can enable the Cloudflare Proxy (Orange Cloud) if desired.
2. **ACME Challenge:** If Fly.io struggles to verify the domain via the A/AAAA records, you can also add these CNAME records:
   - Name: `_acme-challenge.kindlinecare.org`, Content: `kindlinecare.org.xkm5ezn.flydns.net`
   - Name: `_acme-challenge.www.kindlinecare.org`, Content: `www.kindlinecare.org.xkm5ezn.flydns.net`

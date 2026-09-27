# KNOWN ISSUES & LIMITATIONS

```text
STATUS: ACTIVE TRACKER
Last Updated: 2026-09-27
```

---

### Active Issues

| Issue ID | Severity | Component | Description | Impact | Current Workaround / Mitigation | Status |
|---|---|---|---|---|---|---|
| `ISSUE-001` | Low | Backend Vision | Color histogram alone is illumination sensitive in extreme lighting | Highly saturated or dark backgrounds can skew color matching score | HSV conversion and structural dHash weighting dampens color sensitivity | MITIGATED |
| `ISSUE-002` | Low | Database | Supabase cloud credentials may not be configured in fresh local clones | Database connection falls back to local SQLite/mock seed repository | Repository layer auto-detects presence of Supabase keys and seamlessly initializes seed memory store if keys are unset | MITIGATED |

---

### Resolved Issues
*(None yet - initial scaffold phase)*

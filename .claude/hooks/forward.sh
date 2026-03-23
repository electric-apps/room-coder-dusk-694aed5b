#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/694aed5b-6371-4af7-bd19-437a83b91423/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 6beedc2792a6e1b1e079bbdd1dd93e5bb5e11a1af473806e9799b45b3d69ab63" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0
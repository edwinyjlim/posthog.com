---
title: Linking Hubspot as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
---

The Hubspot connector can link contacts, companies, deals, emails, meetings, quotes, and tickets to PostHog.

To link Hubspot:

1. Go to the [Data pipeline page](https://us.posthog.com/pipeline/sources) and the sources tab in PostHog
2. Click **New source** and select Hubspot
3. Select the Hubspot account you want to link and click **Connect app**
4. *Optional:* Add a prefix to your table names
5. Select the tables you want to import (incremental/append syncs are not supported for HubSpot tables.)
6. Click **Import**

The data warehouse then starts syncing your Hubspot data. You can see details, progress, and rows synced in the [data pipeline sources tab](https://us.posthog.com/pipeline/sources).

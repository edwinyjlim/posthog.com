---
title: Linking Google Ads as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
beta: true
---

You can sync data from Google Ads reports by configuring it as a source in PostHog. The supported reports that can be synced include Ad, AdStats, AdGroup, AdGroupStats, Campaign, CampaignStats, Keyword, KeywordStats, Video, and VideoStats, as they are described [here](https://cloud.google.com/bigquery/docs/google-ads-transformation). Additional reports will be added based on user feedback we receive via our [in-app support form](https://us.posthog.com/#panel=support%3Afeedback%3Adata_warehouse%3Alow%3Atrue).

## Requirements
- The [Google Ads customer ID](https://support.google.com/google-ads/answer/1704344) of the account you are trying to sync to Posthog.
- Administrator access to the Google Ads account you want to sync. If you use manager accounts then this is often enough to connect. An manager account is an Ads account type that enables you to manage several Ads accounts under a single login – [see here for more on Google Ads manager accounts](https://support.google.com/google-ads/answer/6139186).

![Location of the Google Ads Customer ID](https://res.cloudinary.com/dmukukwp6/image/upload/2024_10_31_at_15_15_51_a7a003008c.png)


## Configuring PostHog

Connect PostHog to your Google Ads account using a Google account. The Google account must have administrator access to your Google Ads account.


1. In PostHog, go to the **[Data pipelines](https://us.posthog.com/pipeline/sources)** tab.
2. Open the **+ New** drop-down menu in the top-right and select **Source**.
3. Find Google Ads in the sources list and click **Link**.
4. Enter the **Google Ads customer ID** of the Google Ads account you want to sync.
5. Select an existing Google Ads account, or create a new integration
6. (Optional) Add a prefix for the table name.

---
title: Send PostHog person data to Gleap
templateId:
    - template-gleap
---

import Requirements from "../_snippets/requirements.mdx"
import FeedbackQuestions from "../_snippets/feedback-questions.mdx"
import PostHogMaintained from "../_snippets/posthog-maintained.mdx"

<Requirements />

You'll also need access to the relevant Gleap account.

## Installation

1. In PostHog, click the [Data pipeline](https://us.posthog.com/pipeline/overview) tab in the left sidebar.
2. Click the [Destinations](https://us.posthog.com/pipeline/destinations?search=gleap) tab.
3. Search for **Gleap** and click **+ Create**.
4. Add your Gleap access token at the configuration step.
5. Press **Create & Enable** and watch your 'Contacts' list get populated in Gleap!

<HideOnCDPIndex>

## Configuration

<TemplateParameters />

## FAQ

### Is the source code for this destination available?

PostHog is open-source and so are all the destination on the platform. The [source code](https://github.com/PostHog/posthog/blob/master/posthog/cdp/templates/gleap/template_gleap.py) is available on GitHub.

<PostHogMaintained />

<FeedbackQuestions />

</HideOnCDPIndex>
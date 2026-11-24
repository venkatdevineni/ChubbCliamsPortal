# AI Working Journal (starter — update with your actual process)

The assessment asks for a running journal of AI prompts, accepted suggestions, challenged/overridden decisions, and reasoning. This file is a starter note describing the initial generated baseline; it is not a claim that these entries represent your complete personal process. Add dated entries while you work.


## Initial generated baseline

- **Prompt/task:** Generate a runnable Angular frontend and .NET mock REST backend based on the assessment requirements: two user types in one Angular application, claim submission and tracking, staff queue/review/status progression, and workload indicators.
- **Accepted:** Standalone Angular root component for a quick, small assessment MVP; service boundary for API calls; separate claimant/staff views with a demo role toggle; mock REST backend; seeded claims; basic status update actions; dashboard metrics and queue filters.
- **Reasoning:** These features cover the most important end-to-end workflows within the time guidance and let the walkthrough demonstrate both user journeys.
- **Trade-off / challenged area:** The API uses in-memory state and an event queue to simulate Kafka-style events, not real database persistence or Kafka. This is intentionally a mock and should be described accurately during the walkthrough.
- **Next validation by candidate:** Install dependencies, run the app, inspect code, test happy paths and failure cases, correct any build/runtime issues, and add a real journal entry for each material AI prompt and decision.

## Candidate entries

_Add dated entries here as you actually use AI, including prompt, suggestion, what you accepted/rejected, and why._

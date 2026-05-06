# AI Lead Generation Dashboard

AI Lead Generation Dashboard capture leads through contact forms, uses AI to
qualify, summarize and prioritize follow-ups, and shows everything in a clean
dashboard.

## 🧠 Data Model

The system is built around two core entities:

* `leads`: raw user input
* `lead_analysis`: AI-generated insights

### Lead

Represents a raw lead submitted via form.

```ts
Lead {
  id: string

  name: string
  email: string
  message: string

  status: "new" | "contacted" | "closed"

  created_at: timestamp
}
```

### LeadAnalysis

Represents AI-generated analysis of a lead.

```ts
LeadAnalysis {
  id: string
  lead_id: string  // FK -> Lead.id

  score: number          // 0–100
  label: "cold" | "warm" | "hot"

  intent_summary: string
  suggested_action: string

  raw_response: string   // full AI output
  model: string         

  created_at: timestamp
}
```

## 🔗 Relationships

* A `Lead` can have **0 or 1 analysis** (MVP assumption)
* `LeadAnalysis.lead_id` references `Lead.id`

## 🔄 Lifecycle

### 1. Lead Created

* User submits form
* Record inserted into `leads`
* Status = `"new"`

### 2. AI Processing (async)

* Triggered after lead creation
* Sends `message` to AI
* Stores result in `lead_analysis`

### 3. Dashboard Usage

* List view `leads`
* Detail view `leads + lead_analysis`

### 4. Status Updates

* User updates `status`
* No AI re-run (MVP)

## ⚠️ Constraints (important)

* AI analysis is **eventually consistent**
* A lead may exist **without analysis temporarily**
* UI must handle loading / missing analysis

## 🧠 AI Output Contract

The AI must ALWAYS return structured JSON:

```json
{
  "score": 0-100,
  "label": "cold" | "warm" | "hot",
  "intent_summary": "string",
  "suggested_action": "string"
}
```

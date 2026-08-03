# Website Monitoring

A Node.js based website monitoring system using Playwright for automated checks, with SQLite for storing test definitions, executions, results, and failure incidents.

## Current Status

The project currently supports:

* Running Playwright monitoring tests
* Registering monitored tests in a SQLite database
* Recording individual test executions
* Tracking failures as incidents
* Grouping repeated failures into a single incident
* Resolving failures when tests recover

---

## Architecture Overview

```
Playwright Tests
        |
        ↓
Custom Reporter
        |
        ↓
SQLite Database
        |
        ├── Test Definitions
        |
        ├── Test Executions
        |
        ├── Test Results
        |
        └── Failure Incidents
```

---

# Database Structure

## brands

Stores monitored brands.

Example:

```
Tailor Made
```

Fields:

* `id`
* `name`
* `slug`
* `created_at`

---

## sites

Stores websites belonging to brands.

Example:

```
TM Store
https://store.tailormade.uk
```

Fields:

* `id`
* `brand_id`
* `name`
* `url`
* `environment`
* `active`
* `created_at`

---

## categories

Groups tests by purpose.

Examples:

* Core
* Ecommerce

Fields:

* `id`
* `name`
* `description`

---

## tests

Stores registered monitoring tests.

Example:

```
tm-checkout-flow
```

Fields:

* `id`
* `site_id`
* `category_id`
* `name`
* `file`
* `type`
* `enabled`
* `schedule`
* `created_at`

The `file` field maps a database test to its Playwright spec file.

Example:

```
tests/tm-store/uptime.spec.js
```

---

## test_executions

Represents a single monitoring run.

Examples:

* Manual run
* Scheduled run

Fields:

* `id`
* `started_at`
* `completed_at`
* `trigger`
* `status`

---

## test_results

Stores every individual test attempt.

Each execution creates a result.

Example:

```
Execution 1
    |
    └── tm-checkout-flow
            failed
```

Fields:

* `id`
* `execution_id`
* `test_id`
* `status`
* `duration`
* `error`
* `screenshot`
* `video`
* `started_at`
* `completed_at`

This table is used for historical reporting such as:

* uptime percentage
* success rate
* response times
* trends

---

## failures

Stores failure incidents.

Unlike `test_results`, this does not store every failure attempt.

Repeated failures are grouped together.

Example:

```
Checkout flow failing

Started:
10:00

Occurrences:
12

Resolved:
NULL
```

Fields:

* `id`
* `test_result_id`
* `error_message`
* `stack_trace`
* `screenshot`
* `video`
* `occurrences`
* `created_at`
* `last_seen`
* `resolved_at`

---

# Failure Lifecycle

## New Failure

A failed test with no existing open incident creates a failure:

```
test_results
      |
      ↓
failures
```

Example:

```
failures

id: 1
occurrences: 1
resolved_at: NULL
```

---

## Repeated Failure

If the same test fails again:

* A new `test_results` row is created
* Existing failure occurrence count increases
* No new failure row is created

Example:

```
test_results

1 failed
2 failed
3 failed


failures

id | occurrences
----------------
1  | 3
```

---

## Recovery

When the test passes:

```
resolved_at = current timestamp
```

The incident is closed.

---

# Reporter Flow

The custom Playwright reporter:

## onBegin()

Creates a new execution:

```javascript
createExecution('manual')
```

---

## onTestEnd()

For every completed test:

1. Find matching database test:

```javascript
findByName(test.title, relativeFile)
```

2. Save result:

```javascript
saveResult()
```

3. Handle failures:

* create new failure
* update existing failure
* resolve recovered failures

---

## onEnd()

Completes the execution:

```javascript
completeExecution()
```

---

# Project Structure

Current structure:

```
src
├── db
│   ├── database.js
│   ├── migrate.js
│   ├── seed.js
│   └── queries
│       ├── executions.js
│       ├── failures.js
│       ├── results.js
│       └── tests.js
│
├── reporting
│   └── testReporter.js
│
└── utils
    └── formatters.js

tests
└── tm-store
    └── uptime.spec.js
```

---

# Running Locally

Install dependencies:

```bash
npm install
```

Create database:

```bash
npm run migrate
```

Seed development data:

```bash
node src/db/seed.js
```

Run monitoring tests:

```bash
npm test
```

---

# Current Limitations / Next Steps

## Scheduling

Currently:

* Tests are manually triggered

Future:

* Scheduler service
* Cron based execution
* Dynamic schedules from database

---

## Test Runner Mapping

Currently:

* Tests are mapped by:

  * test name
  * spec file

Future:

* Additional metadata
* Dynamic test discovery

---

## Reporting Dashboard

Future:

* Uptime percentages
* Failure history
* Site health overview
* Response time graphs
* Screenshots/videos on failure

---

## WordPress Integration

Planned:

* WordPress manages monitoring configuration
* Node service executes tests
* Results exposed via API
* Dashboard displays monitoring status

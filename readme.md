# Website Monitoring

A Node.js based website monitoring system using Playwright for automated checks, with SQLite for storing test definitions, executions, results, and failure incidents.

Configuration can be received from external systems through an authenticated API and synced into the database.

## Current Status

The project currently supports:

* Running Playwright monitoring tests
* Registering monitored sites and tests in SQLite
* Recording individual test executions
* Recording test results and execution history
* Tracking failures as incidents
* Grouping repeated failures into a single incident
* Resolving failures when tests recover
* Capturing failure screenshots and videos
* Sending email notifications for new failure incidents
* Receiving monitoring configuration through an authenticated API
* Syncing sites, categories, and tests from external configuration
* Running scheduled monitoring checks through a background worker

---

# Architecture Overview


Scheduled Worker
|
↓
Playwright Runner
|
↓
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


External Configuration
|
↓
Monitoring API
|
↓
Configuration Sync
|
↓
SQLite Database


---

# Database Structure

The application uses SQLite for persistence.

Database files and setup scripts are stored separately from application code:

database/
├── monitoring.sqlite
├── migrate.js
└── seed.js


Runtime database access is handled through:

src/db/
├── database.js
└── queries/


---

## sites

Stores monitored websites.

Example:

TM Store
https://store.tailormade.uk


Fields:

* `id`
* `brand_id`
* `name`
* `slug`
* `url`
* `environment`
* `active`
* `created_at`

The `slug` field provides a stable identifier for external configuration syncing.

---

## categories

Groups tests by purpose.

Examples:

* Core
* Ecommerce

Fields:

* `id`
* `name`
* `slug`
* `description`

The `slug` field provides a stable identifier for external configuration syncing.

---

## tests

Stores registered monitoring tests.

Example:

tm-checkout-flow


Fields:

* `id`
* `site_id`
* `category_id`
* `name`
* `slug`
* `file`
* `type`
* `enabled`
* `schedule`
* `next_run_at`
* `created_at`

The `file` field maps a database test to its Playwright spec file.

Example:

tests/tm-store/uptime.spec.js


The `slug` field provides a stable identifier for external configuration syncing.

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

Execution 1
|
└── tm-checkout-flow
failed


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

This table provides historical reporting data such as:

* uptime percentage
* success rate
* response times
* failure trends

---

## failures

Stores failure incidents.

Unlike `test_results`, this does not store every failure attempt.

Repeated failures are grouped into a single incident.

Example:

Checkout flow failing

Started:
10:00

Occurrences:
12

Resolved:
NULL


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

A failed test with no existing open incident creates a failure incident:

test_results
|
↓
failures


A notification is then sent.

Example:

failures

id: 1
occurrences: 1
resolved_at: NULL


---

## Repeated Failure

If the same test continues failing:

* A new `test_results` row is created
* The existing failure occurrence count is increased
* No duplicate failure incident is created
* No additional notification is sent

Example:

test_results

1 failed
2 failed
3 failed

failures

id | occurrences

1 | 3

---

## Recovery

When the test passes:


resolved_at = current timestamp


The incident is closed.

---

# Failure Notifications

Failure notifications are handled through the notification service:

src/services/notifications/
├── EmailService.js
└── FailureNotification.js


The notification flow is:


Failed Test
|
↓
Reporter
|
↓
Create Failure Incident
|
↓
Queue Notification
|
↓
Reporter onEnd()
|
↓
Send Email


Notifications are handled during the reporter completion phase to ensure Playwright waits for asynchronous email delivery.

---

# Reporter Flow

The custom Playwright reporter is responsible for converting Playwright results into monitoring records.

## onBegin()

Creates a new execution:

```javascript
createExecution('manual')
onTestEnd()

For every completed test:

Find matching database test
Capture failure evidence if required
Save test result:
saveResult()
Handle failure lifecycle:
Create new failure incident
Update existing failures
Resolve recovered failures
onEnd()

Completes the execution:

completeExecution()

Also sends any queued failure notifications.

Worker Execution

The monitoring worker checks for tests that are due to run based on their schedule.

The flow is:

Worker
|
↓
Find due tests
|
↓
Run Playwright test
|
↓
Custom Reporter
|
↓
Store execution results

Scheduled tests are identified using:

enabled
schedule
next_run_at
Test Execution Flow

A scheduled execution follows this process:

Worker checks for due tests:
next_run_at <= current time
Worker starts the Playwright runner.
Playwright executes the test file defined in the database.

Example:

tests/tm-store/uptime.spec.js
Reporter records:
Execution
Result
Failure incident (if required)
Notification
Project Structure

Current structure:

website-monitoring/

├── database/
│   ├── monitoring.sqlite
│   ├── migrate.js
│   └── seed.js
│
├── src/
│   ├── run.js
│   ├── server.js
│   │
│   ├── api/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── config.js
│   │       └── tests.js
│   │
│   ├── db/
│   │   ├── database.js
│   │   └── queries/
│   │       ├── executions.js
│   │       ├── failures.js
│   │       ├── results.js
│   │       ├── sites.js
│   │       ├── categories.js
│   │       └── tests.js
│   │
│   ├── reporting/
│   │   └── TestReporter.js
│   │
│   ├── runner/
│   │   └── testRunner.js
│   │
│   ├── services/
│   │   ├── availableTests.js
│   │   ├── configSync.js
│   │   └── notifications/
│   │       ├── EmailService.js
│   │       └── FailureNotification.js
│   │
│   ├── utils/
│   │   ├── failureFiles.js
│   │   ├── formatters.js
│   │   └── schedule.js
│   │
│   └── worker/
│       ├── index.js
│       └── worker.js
│
└── tests/
    ├── failures/
    │   ├── screenshots/
    │   └── videos/
    │
    └── tm-store/
        └── uptime.spec.js
Running Locally

Install dependencies:

npm install

Reset development database:

npm run db:reset

Run monitoring tests:

npm test

Start API:

npm run server

Start monitoring worker:

npm run worker

Main changes are documentation only — no behaviour assumptions beyond what you now have working. I also deliberately avoided adding future ideas (dashboards, uptime reports, etc.) as if they already exist.
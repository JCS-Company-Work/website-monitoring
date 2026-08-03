# Website Monitoring

A Node.js based website monitoring system using Playwright for automated checks, with SQLite for storing test definitions, executions, results, and failure incidents.

Configuration can be received from external systems through an authenticated API and synced into the database.

## Current Status

The project currently supports:

* Running Playwright monitoring tests
* Registering monitored tests in a SQLite database
* Recording individual test executions
* Tracking failures as incidents
* Grouping repeated failures into a single incident
* Resolving failures when tests recover
* Receiving monitoring configuration through an authenticated API
* Syncing sites, categories, and tests from external configuration

---

## Architecture Overview


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

## brands

Stores monitored brands.

Example:


Tailor Made


Fields:

* `id`
* `name`
* `slug`
* `created_at`

---

## sites

Stores websites belonging to brands.

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

# Configuration API

The monitoring service exposes an authenticated API endpoint for receiving monitoring configuration.

Endpoint:


POST /api/config


Requests are authenticated using an API key.

The configuration sync process currently supports:

* Sites
* Categories
* Tests

The intended flow is:


WordPress
|
↓
Monitoring API
|
↓
Configuration Sync
|
↓
SQLite Database


WordPress will become the source of truth for monitoring configuration, including test definitions and schedules.

---

# Failure Lifecycle

## New Failure

A failed test with no existing open incident creates a failure:


test_results
|
↓
failures


Example:


failures

id: 1
occurrences: 1
resolved_at: NULL


---

## Repeated Failure

If the same test fails again:

* A new `test_results` row is created
* Existing failure occurrence count increases
* No new failure row is created

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

# Reporter Flow

The custom Playwright reporter:

## onBegin()

Creates a new execution:

```javascript
createExecution('manual')
onTestEnd()

For every completed test:

Find matching database test:
findByName(test.title, relativeFile)
Save result:
saveResult()
Handle failures:
create new failure
update existing failure
resolve recovered failures
onEnd()

Completes the execution:

completeExecution()
Project Structure

Current structure:

src
├── api
│   ├── middleware
│   │   └── auth.js
│   └── routes
│       └── config.js
│
├── services
│   └── configSync.js
│
├── db
│   ├── database.js
│   ├── migrate.js
│   ├── seed.js
│   └── queries
│       ├── executions.js
│       ├── failures.js
│       ├── results.js
│       ├── sites.js
│       ├── categories.js
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
Running Locally

Install dependencies:

npm install

Reset development database:

npm run db:reset

Run monitoring tests:

npm test

Start API:

npm run server
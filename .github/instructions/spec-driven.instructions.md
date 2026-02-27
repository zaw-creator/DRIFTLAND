---
description: 'Specification-Driven Workflow v1 provides a structured approach to software development, ensuring that requirements are clearly defined, designs are meticulously planned, and implementations are thoroughly documented and validated.'
applyTo: '**'
---
# Spec Driven Workflow v1

**Specification-Driven Workflow:**
Bridge the gap between requirements and implementation.

**Maintain these artifacts at all times:**

- **`requirements.md`**: User stories and acceptance criteria in structured EARS notation.
- **`design.md`**: Technical architecture, sequence diagrams, implementation considerations.
- **`tasks.md`**: Detailed, trackable implementation plan.

## Universal Documentation Framework

**Documentation Rule:**
Use the detailed templates as the **primary source of truth** for all documentation.

**Summary formats:**
Use only for concise artifacts such as changelogs and pull request descriptions.

### Detailed Documentation Templates

#### Action Documentation Template (All Steps/Executions/Tests)

```bash
### [TYPE] - [ACTION] - [TIMESTAMP]
**Objective**: [Goal being accomplished]
**Context**: [Current state, requirements, and reference to prior steps]
**Decision**: [Approach chosen and rationale, referencing the Decision Record if applicable]
**Execution**: [Steps taken with parameters and commands used. For code, include file paths.]
**Output**: [Complete and unabridged results, logs, command outputs, and metrics]
**Validation**: [Success verification method and results. If failed, include a remediation plan.]
**Next**: [Automatic continuation plan to the next specific action]
```

#### Decision Record Template (All Decisions)

```bash
### Decision - [TIMESTAMP]
**Decision**: [What was decided]
**Context**: [Situation requiring decision and data driving it]
**Options**: [Alternatives evaluated with brief pros and cons]
**Rationale**: [Why the selected option is superior, with trade-offs explicitly stated]
**Impact**: [Anticipated consequences for implementation, maintainability, and performance]
**Review**: [Conditions or schedule for reassessing this decision]
```

### Summary Formats (for Reporting)

#### Streamlined Action Log

For generating concise changelogs. Each log entry is derived from a full Action Document.

`[TYPE][TIMESTAMP] Goal: [X] → Action: [Y] → Result: [Z] → Next: [W]`

#### Compressed Decision Record

For use in pull request summaries or executive summaries.

`Decision: [X] | Rationale: [Y] | Impact: [Z] | Review: [Date]`


## Execution Workflow (6-Phase Loop)

**Never skip any step. Use consistent terminology. Reduce ambiguity.**

### **Phase 1: ANALYZE**

## Step 1. Check the current branch
Check the current Git branch, and abort this entire process if there are any uncommitted, unstaged, or untracked files in the working directory. Tell the user to commit or stash changes before proceeding, and DO NOT GO ANY FURTHER.

## Step 2. Parse the arguments **Find the Objective:**
From `$ARGUMENTS`, extract:

1. `feature_title`  
   - A short, human readable title in Title Case.  
   - Example: "Card Component for Dashboard Stats".

2. `feature_slug`  
   - A git safe slug.  
   - Rules:  
     - Lowercase 
     - Kebab-case 
     - Only `a-z`, `0-9` and `-`  
     - Replace spaces and punctuation with `-`  
     - Collapse multiple `-` into one  
     - Trim `-` from start and end  
     - Maximum length 40 characters  
   - Example: `card-component` or `card-component-dashboard`.

3. `branch_name`  
   - Format: `claude/feature/<feature_slug>`  
   - Example: `claude/feature/card-component`.
If you cannot infer a sensible `feature_title` and `feature_slug`, ask the user to clarify instead of guessing.

## Step 3. Switch to a new Git branch
Before making any content, switch to a new Git branch using the `branch_name` derived from the `$ARGUMENTS`. If the branch name is already taken, then append a version number to it: e.g. `claude/feature/card-component-01`

## Step 4. Study the problem and define requirements
- Understand the problem.
- Analyze the existing system.
- Produce a clear, testable set of requirements.
- Think about the possible solutions and their implications.

**Checklist of Step 4**

- [ ] Read all provided code, documentation, tests, and logs.
      - Document file inventory, summaries, and initial analysis results.
- [ ] Define requirements in **EARS Notation**:
      - Transform feature requests into structured, testable requirements.
      - Format: `WHEN [a condition or event], THE SYSTEM SHALL [expected behavior]`
- [ ] Identify dependencies and constraints.
      - Document a dependency graph with risks and mitigation strategies.
- [ ] Map data flows and interactions.
      - Document system interaction diagrams and data models.
- [ ] Catalog edge cases and failures.
      - Document a comprehensive edge case matrix and potential failure points.
- [ ] Assess confidence.
      - Generate a **Confidence Score (0-100%)** based on clarity of requirements, complexity, and problem scope.
      - Document the score and its rationale.

## Step 5. Draft the spec content
Create a markdown spec document that Plan mode can use directly and save it in the _specs folder using the `feature_slug`. Use the structure as defined as reference in the spec template file here: @_specs/template.md. 
- Do not add technical implementation details such as code examples.

## Step 6. Final output to the user
After the file is saved, respond to the user with a short summary in this exact format:
Branch: <branch_name>
Spec file: specs/<feature_slug>.md
Title: <feature_title>

**Critical Constraint:**

- **Do not proceed until all requirements are clear and documented.**
- **Do not add technical implementation details such as code examples**
- **Do not repeat the full spec in the chat output unless the user explicitly asks to see it. The main goal is to save the spec file and report where it lives and what branch name to use.**
- **Use the defined templates for all documentation to maintain consistency and completeness.**

### **Phase 2: DESIGN**
**Objective:**
- You are helping to spin up a new feature spec for this application, from a short idea provided in the user input below. Always adhere to any rules or requirements set out in any CLAUDE.md files when responding.
**Checklist:**
 - [ ] **Define adaptive execution strategy based on Confidence Score:**
  - **High Confidence (>85%)**
    - Draft a comprehensive, step-by-step implementation plan.
    - Skip proof-of-concept steps.
    - Proceed with full, automated implementation.
    - Maintain standard comprehensive documentation.
  - **Medium Confidence (66–85%)**
    - Prioritize a **Proof-of-Concept (PoC)** or **Minimum Viable Product (MVP)**.
    - Define clear success criteria for PoC/MVP.
    - Build and validate PoC/MVP first, then expand plan incrementally.
    - Document PoC/MVP goals, execution, and validation results.
  - **Low Confidence (<66%)**
    - Dedicate first phase to research and knowledge-building.
    - Use semantic search and analyze similar implementations.
    - Synthesize findings into a research document.
    - Re-run ANALYZE phase after research.
    - Escalate only if confidence remains low.
- [ ] **Create technical design document in folder `_designs`:**
Create a Document technical design that Plan mode can used directly and in save it in the `_design` folder using the`feature_slug`. Used the following structure as defined:
  - **Architecture:** High-level overview of components and interactions.
  - **Data Flow:** Diagrams and descriptions.
  - **Interfaces:** API contracts, schemas, public-facing function signatures.
  - **Data Models:** Data structures and database schemas.
  - **Sequence Diagrams:** Step-by-step interactions for key use cases.
  - **UML Diagrams:** Class diagrams, component diagrams, or other relevant UML artifacts.
- [ ] **Identify technical dependencies and integration points:**
      - Document a dependency graph with integration points, risks, and mitigation strategies.
- [ ] **Document error handling:**
  - Create an error matrix with procedures and expected responses.
- [ ] **Define unit testing strategy.**
      - Identify critical components and edge cases for testing.
      - Document test cases and expected outcomes.

**Critical Constraint:**

- **Do not proceed to implementation until design and plan are complete and validated.**
- **Always maintain comprehensive documentation of design decisions and implementation plans.**
- **Ensure all documentation is clear, detailed, and directly usable for implementation and validation.**
- **Use the defined templates for all documentation to maintain consistency and completeness.**


### **Phase 3: IMPLEMENT**

**Objective:**

- Write production-quality code according to the design and plan.

**Checklist:**

- [ ] Code in small, testable increments.
      - Document each increment with code changes, results, and test links.
- [ ] Implement from dependencies upward.
      - Document resolution order, justification, and verification.
- [ ] Follow conventions.
      - Document adherence and any deviations with a Decision Record.
- [ ] Add meaningful comments.
      - Focus on intent ("why"), not mechanics ("what").
- [ ] Create files as planned.
      - Document file creation log.
- [ ] Update task status in real time.

**Critical Constraint:**

- **Do not merge or deploy code until all implementation steps are documented and tested.**

### **Phase 4: VALIDATE**

**Objective:**

- Verify that implementation meets all requirements and quality standards.

**Checklist:**

- [ ] Execute automated tests.
      - Document outputs, logs, and coverage reports.
      - For failures, document root cause analysis and remediation.
- [ ] Perform manual verification if necessary.
      - Document procedures, checklists, and results.
- [ ] Test edge cases and errors.
      - Document results and evidence of correct error handling.
- [ ] Verify performance.
      - Document metrics and profile critical sections.
- [ ] Log execution traces.
      - Document path analysis and runtime behavior.

**Critical Constraint:**

- **Do not proceed until all validation steps are complete and all issues are resolved.**

### **Phase 5: REFLECT**

**Objective:**

- Improve codebase, update documentation, and analyze performance.

**Checklist:**

- [ ] Refactor for maintainability.
      - Document decisions, before/after comparisons, and impact.
- [ ] Update all project documentation.
      - Ensure all READMEs, diagrams, and comments are current.
- [ ] Identify potential improvements.
      - Document backlog with prioritization.
- [ ] Validate success criteria.
      - Document final verification matrix.
- [ ] Perform meta-analysis.
      - Reflect on efficiency, tool usage, and protocol adherence.
- [ ] Auto-create technical debt issues.
      - Document inventory and remediation plans.

**Critical Constraint:**

- **Do not close the phase until all documentation and improvement actions are logged.**

### **Phase 6: HANDOFF**

**Objective:**

- Package work for review and deployment, and transition to next task.

**Checklist:**

- [ ] Generate executive summary.
      - Use **Compressed Decision Record** format.
- [ ] Prepare pull request (if applicable):
    1. Executive summary.
    2. Changelog from **Streamlined Action Log**.
    3. Links to validation artifacts and Decision Records.
    4. Links to final `requirements.md`, `design.md`, and `tasks.md`.
- [ ] Finalize workspace.
      - Archive intermediate files, logs, and temporary artifacts to `.agent_work/`.
- [ ] Continue to next task.
      - Document transition or completion.

**Critical Constraint:**

- **Do not consider the task complete until all handoff steps are finished and documented.**

## Troubleshooting & Retry Protocol

**If you encounter errors, ambiguities, or blockers:**

**Checklist:**

1. **Re-analyze**:
   - Revisit the ANALYZE phase.
   - Confirm all requirements and constraints are clear and complete.
2. **Re-design**:
   - Revisit the DESIGN phase.
   - Update technical design, plans, or dependencies as needed.
3. **Re-plan**:
   - Adjust the implementation plan in `tasks.md` to address new findings.
4. **Retry execution**:
   - Re-execute failed steps with corrected parameters or logic.
5. **Escalate**:
   - If the issue persists after retries, follow the escalation protocol.

**Critical Constraint:**

- **Never proceed with unresolved errors or ambiguities. Always document troubleshooting steps and outcomes.**

## Technical Debt Management (Automated)

### Identification & Documentation

- **Code Quality**: Continuously assess code quality during implementation using static analysis.
- **Shortcuts**: Explicitly record all speed-over-quality decisions with their consequences in a Decision Record.
- **Workspace**: Monitor for organizational drift and naming inconsistencies.
- **Documentation**: Track incomplete, outdated, or missing documentation.

### Auto-Issue Creation Template

```text
**Title**: [Technical Debt] - [Brief Description]
**Priority**: [High/Medium/Low based on business impact and remediation cost]
**Location**: [File paths and line numbers]
**Reason**: [Why the debt was incurred, linking to a Decision Record if available]
**Impact**: [Current and future consequences (e.g., slows development, increases bug risk)]
**Remediation**: [Specific, actionable resolution steps]
**Effort**: [Estimate for resolution (e.g., T-shirt size: S, M, L)]
```

### Remediation (Auto-Prioritized)

- Risk-based prioritization with dependency analysis.
- Effort estimation to aid in future planning.
- Propose migration strategies for large refactoring efforts.

## Quality Assurance (Automated)

### Continuous Monitoring

- **Static Analysis**: Linting for code style, quality, security vulnerabilities, and architectural rule adherence.
- **Dynamic Analysis**: Monitor runtime behavior and performance in a staging environment.
- **Documentation**: Automated checks for documentation completeness and accuracy (e.g., linking, format).

### Quality Metrics (Auto-Tracked)

- Code coverage percentage and gap analysis.
- Cyclomatic complexity score per function/method.
- Maintainability index assessment.
- Technical debt ratio (e.g., estimated remediation time vs. development time).
- Documentation coverage percentage (e.g., public methods with comments).

## EARS Notation Reference

**EARS (Easy Approach to Requirements Syntax)** - Standard format for requirements:

- **Ubiquitous**: `THE SYSTEM SHALL [expected behavior]`
- **Event-driven**: `WHEN [trigger event] THE SYSTEM SHALL [expected behavior]`
- **State-driven**: `WHILE [in specific state] THE SYSTEM SHALL [expected behavior]`
- **Unwanted behavior**: `IF [unwanted condition] THEN THE SYSTEM SHALL [required response]`
- **Optional**: `WHERE [feature is included] THE SYSTEM SHALL [expected behavior]`
- **Complex**: Combinations of the above patterns for sophisticated requirements

Each requirement must be:

- **Testable**: Can be verified through automated or manual testing
- **Unambiguous**: Single interpretation possible
- **Necessary**: Contributes to the system's purpose
- **Feasible**: Can be implemented within constraints
- **Traceable**: Linked to user needs and design elements
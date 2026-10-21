# Licensing and Clean-Room Risk Assessment

## 1. Repository Licence Findings

An automated and manual inspection was conducted on both public reference repositories and their GitHub metadata:

1. **Frontend Repository**: `https://github.com/jokerhutt/ludolang`
   - **Repository License File**: None found (no `LICENSE`, `LICENSE.md`, `LICENSE.txt`, or `COPYING`).
   - **Package Manifest (`package.json`)**: No `"license"` field specified.
   - **GitHub API Metadata (`/repos/jokerhutt/ludolang`)**: `"license": null`.

2. **Backend Repository**: `https://github.com/jokerhutt/ludolang-backend`
   - **Repository License File**: None found (no `LICENSE`, `LICENSE.md`, `LICENSE.txt`, or `COPYING`).
   - **Build Manifest (`pom.xml`)**: No `<licenses>` block configured.
   - **GitHub API Metadata (`/repos/jokerhutt/ludolang-backend`)**: `"license": null`.

---

## 2. Legal Implications & Risk Level

Under international copyright treaties (the Berne Convention) and standard platform terms (GitHub Terms of Service):
- When a software repository does not declare an open-source licence, **all rights are reserved by the original copyright holder**.
- No third party receives permission to copy, adapt, translate, distribute, compile, or incorporate any portion of the source code, user interface designs, text copy, graphic assets, or sound files into another project.
- **Risk Level**: High if any direct code or verbatim structure is used. Zero if clean-room methodology is strictly observed.

---

## 3. Clean-Room Methodology Applied

To completely eliminate legal exposure, strict clean-room engineering rules have been enforced:

1. **Isolation of Reference Materials**:
   - Both repositories were cloned into a temporary isolated scratch location (`/tmp/ref-research/`) outside our project directory.
   - None of their files, scripts, or assets were placed inside or near our codebase.
   - The scratch folder is deleted immediately upon completion of the research session.
   - Their dependencies were never installed, and their applications were never executed.

2. **Zero Code or Verbatim Reproduction**:
   - No code, type definitions, function implementations, variable names, database scripts, or stylesheets are copied or translated line-by-line.
   - No graphic assets, audio files, icons, or text copy from the reference projects are utilized.

3. **Conceptual Abstraction Only**:
   - Analysis is restricted exclusively to understanding behavioral concepts, structural patterns, algorithmic rules, domain mechanics, and architectural trade-offs.
   - All analytical summaries, diagrams, and recommendations are authored in 100% original language.

4. **Independent Specification Boundary**:
   - The architectural specification (`clean-room-spec.md`) is written as a vendor-neutral, implementation-independent requirements document.
   - It contains no references to the analyzed repositories or their internal identifiers.
   - Future implementation work must rely solely on `clean-room-spec.md`, maintaining an uncompromised clean-room development chain.

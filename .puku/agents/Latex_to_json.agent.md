---
description: 'Converts LaTeX machine documentation to JSON for the Southern Machines website. Use this agent when user pastes LaTeX content and wants to create a machine entry JSON file.'
tools: ["read_file", "create_file", "replace_string_in_file", "list_dir", "file_search"]
instructions: |
  ## Agent Instructions

  When the user pastes LaTeX content and asks to convert it to JSON:

  1. **Acknowledge**: Say "Running LaTeX to JSON agent..."

  2. **Parse the LaTeX**:
     - Find machine name (from \title or first \section)
     - Extract brand name
     - Find purpose/applications sections
     - Extract technical specifications from tables
     - Find parts list with part IDs
     - Extract maintenance codes if present
     - Find working principles
     - Extract sequence/flow steps
     - Find resources and notes

  3. **Create JSON file** at `src/content/machines/[slug].json`

  4. **Populate all schema fields**:
     - title, subtitle, brand, category
     - machineImage: "" (empty)
     - reportDownloadUrl: "" (empty)
     - publishedDate: current date ISO format
     - purposeAndApplication: { purpose, applications[], industry }
     - overviewDescription
     - classificationTable[]
     - technicalSpecs[]
     - workingPrinciples[]
     - sequenceFlow[]
     - partsList[]
     - gaugePartsCrossReference[]
     - maintenance[]
     - resources[]
     - finalNotes[]

  5. **Save and confirm** the file was created successfully.

input: |
  LaTeX document content pasted by the user

output: |
  JSON file saved to src/content/machines/[machine-slug].json

examples:
  - user: "convert this LaTeX to JSON"
    context: "User has pasted LaTeX content"
    action: "Parse LaTeX and create JSON file"
  - user: "create machine entry from this"
    context: "User has pasted machine documentation"
    action: "Extract data and create JSON at src/content/machines/"
---
# Brother DA-927A LaTeX → JSON Agent

This agent reads a LaTeX technical report about an industrial sewing machine and converts it into a JSON file matching the Southern Machines website schema.

## How to Use

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Configure OpenAI API
Create a `.env` file in this directory:
```
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o  # or gpt-4o-mini for faster/cheaper
```

### Step 3: Prepare Your LaTeX File
Place your LaTeX `.tex` file in the `input/` folder (e.g., `input/brother-da-927a.tex`)

### Step 4: Run the Agent
```bash
python latex_to_json_agent.py brother-da-927a.tex
```

The output JSON will be saved to:
```
src/content/machines/brother-da-927a.json
```

The agent will automatically:
- Parse the LaTeX document
- Extract all machine data (specs, parts, maintenance, etc.)
- Format it according to the website schema
- Open an editor for you to verify and make any adjustments
- Save the final JSON

### Step 5: Verify the Output
The agent will display the generated JSON and ask for confirmation. You can:
- Accept the output → saves to `src/content/machines/`
- Edit inline → opens editor for modifications
- Regenerate → asks AI to fix specific issues

---

## Command Line Options

```bash
python latex_to_json_agent.py <input_file> [options]

Arguments:
  input_file              Path to LaTeX .tex file

Options:
  --output, -o            Output JSON file path (default: auto-generated from filename)
  --schema, -s            Use custom schema file (default: schema_reference.json)
  --model                 OpenAI model to use (default: gpt-4o)
  --temperature           AI temperature 0-1 (default: 0.3, lower = more precise)
  --dry-run               Parse and show output without saving
  --interactive, -i       Interactive editing mode (default: True)
  --verbose, -v           Show detailed progress
```

---

## Examples

### Basic usage:
```bash
python latex_to_json_agent.py input/juki-ams-210en.tex
```

### With custom output path:
```bash
python latex_to_json_agent.py input/zoje-zj8000e.tex -o output/custom-machine.json
```

### Non-interactive (for CI/CD pipelines):
```bash
python latex_to_json_agent.py input/brother-da-927a.tex --interactive=false --dry-run
```

---

## Project Structure

```
latex-to-json-agent/
├── latex_to_json_agent.py     # Main agent script (all-in-one)
├── schema_reference.json      # Reference schema template
├── .env.example               # Environment variable template
├── requirements.txt           # Python dependencies
├── setup.py                   # Package setup
├── example_usage.py          # Usage examples
├── input/                     # Place LaTeX files here
│   └── .gitkeep
├── output/                    # Generated JSON files go here
│   └── .gitkeep
└── README.md
```

**Note:** This agent is designed as a single Python file for simplicity. It includes:
- `LatexDocumentParser` - Parses LaTeX documents
- `SchemaMapper` - Maps content to JSON schema
- `AIEnhancer` - Uses OpenAI for enhanced parsing
- `LatexToJSONAgent` - Main orchestrator class

---

## API Keys

You need an OpenAI API key to use this agent. Get one at: https://platform.openai.com/api-keys

The agent uses GPT-4o for high-quality parsing and schema adherence. You can also use:
- `gpt-4o-mini` - Faster and cheaper, good for straightforward documents
- `gpt-4-turbo` - More capable for complex LaTeX structures

---

## Troubleshooting

### LaTeX file not parsing correctly?
- Check that your LaTeX uses standard section commands (`\section{}`, `\subsection{}`)
- Tables should use `booktabs` or clear column delimiters
- Lists should use `itemize` or `enumerate`

### JSON output missing sections?
- The agent will warn you about missing expected sections
- You can manually add them via the interactive editor

### Rate limit errors?
- Add `OPENAI_MAX_RETRIES=3` to `.env`
- The agent includes automatic retry logic

---

## For Website Integration

After generating a JSON file, the website will automatically:
1. Detect the new machine on the next TinaCMS commit
2. Show it on the homepage machine listing
3. Create a dynamic machine detail page at `/machines/[slug]`

No manual code changes needed!
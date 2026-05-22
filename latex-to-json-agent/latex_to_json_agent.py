#!/usr/bin/env python3
"""
LaTeX to JSON Agent for Southern Machines Website
Converts industrial sewing machine LaTeX documentation into website-ready JSON
"""

import os
import sys
import json
import re
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from dotenv import load_dotenv

# Third-party imports
try:
    import latex2json
    from latex2json.parser import LatexParser
except ImportError:
    print("Installing latex2json...")
    os.system("pip install latex2json")
    import latex2json
    from latex2json.parser import LatexParser

try:
    from openai import OpenAI
except ImportError:
    print("Installing openai...")
    os.system("pip install openai")
    from openai import OpenAI


# =============================================================================
# SCHEMA REFERENCE
# =============================================================================

MACHINE_SCHEMA = {
    "title": "",
    "subtitle": "",
    "brand": "",
    "category": "",
    "machineImage": "",
    "reportDownloadUrl": "",
    "publishedDate": "",
    "purposeAndApplication": {
        "purpose": "",
        "applications": [],
        "industry": ""
    },
    "overviewDescription": "",
    "classificationTable": [],
    "technicalSpecs": [],
    "workingPrinciples": [],
    "sequenceFlow": [],
    "partsList": [],
    "maintenance": [],
    "resources": [],
    "finalNotes": ""
}


# =============================================================================
# PROMPT TEMPLATES
# =============================================================================

LATEX_TO_JSON_PROMPT = """You are a technical documentation specialist for industrial sewing machines.
Convert the following LaTeX machine documentation into a properly formatted JSON file.

## TASK
Read the provided LaTeX document about the machine and extract ALL information into the JSON schema below.

## JSON SCHEMA
{{schema}}

## RULES
1. Extract EVERYTHING from the LaTeX — do not skip any content
2. Use double quotes for all JSON strings
3. Use the same field names as the schema exactly
4. For empty fields that have no data, use an empty string "" or empty array []
5. All arrays should use objects/records, not primitive strings
6. dates should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.000Z)
7. Machine image and report download URL should be empty strings "" initially

## OUTPUT FORMAT
Return ONLY valid JSON — no markdown code blocks, no explanations, just the JSON object.

## MACHINE DATA
{latex_content}
"""


SECTION_EXTRACTION_PROMPT = """Extract structured data from this machine documentation LaTeX section.
For each key, provide the extracted value.

Section: {section_name}
Content: {content}

Return JSON with:
{{
  "extracted_data": {{...relevant fields...}},
  "confidence": "high/medium/low",
  "missing_fields": [...fields that should be here but aren't...]
}}
"""


VALIDATION_PROMPT = """Validate this machine JSON against the schema.
If valid, return: {{"valid": true, "message": "OK"}}
If invalid, return: {{"valid": false, "errors": [...list of issues...], "fixes": [...suggested fixes...]}}

Schema: {schema}
JSON: {json}
"""


# =============================================================================
# LATEX PARSER
# =============================================================================

class LatexDocumentParser:
    """Parse LaTeX documents and extract machine information"""
    
    def __init__(self, latex_content: str):
        self.raw_content = latex_content
        self.sections = {}
        self.tables = []
        self.lists = []
        
    def parse(self) -> Dict[str, Any]:
        """Main parsing method - extracts all sections and content"""
        self._extract_sections()
        self._extract_tables()
        self._extract_lists()
        return self._build_document_structure()
    
    def _extract_sections(self):
        """Extract LaTeX sections using regex patterns"""
        # Match \section{title}, \subsection{title}, etc.
        section_pattern = r'\\(section|subsection|subsubsection){([^}]+)}'
        
        # Split content by sections
        content = self.raw_content
        matches = list(re.finditer(section_pattern, content))
        
        for i, match in enumerate(matches):
            section_type = match.group(1)
            section_title = match.group(2).strip()
            
            # Get content between this section and the next
            start = match.end()
            if i + 1 < len(matches):
                end = matches[i + 1].start()
            else:
                end = len(content)
            
            section_content = content[start:end].strip()
            
            # Clean up LaTeX commands but preserve structure
            cleaned_content = self._clean_latex_content(section_content)
            
            self.sections[section_title] = {
                'type': section_type,
                'content': cleaned_content
            }
    
    def _clean_latex_content(self, content: str) -> str:
        """Remove LaTeX formatting while preserving structure"""
        # Remove comments
        content = re.sub(r'%.*$', '', content, flags=re.MULTILINE)
        
        # Remove optional arguments like [htbp]
        content = re.sub(r'\[([^\]]*)\]', '', content)
        
        # Keep structure: itemize/enumerate items, table content, etc.
        # Replace \item with markers
        content = re.sub(r'\\item\s*', 'ITEM: ', content)
        
        # Keep \\ for line breaks
        content = re.sub(r'\\\\', ' BRK ', content)
        
        # Remove common formatting commands
        latex_commands = [
            r'\\textbf', r'\\textit', r'\\texttt', r'\\emph',
            r'\\textsf', r'\\small', r'\\large', r'\\textbf',
            r'\\centering', r'\\raggedright', r'\\hline',
            r'\\cline', r'\\toprule', r'\\midrule', r'\\bottomrule',
            r'\\begin', r'\\end', r'\\hline', r'\\cline'
        ]
        for cmd in latex_commands:
            content = re.sub(cmd, '', content)
        
        # Remove remaining braces
        content = re.sub(r'[{}]', '', content)
        
        # Clean up whitespace
        content = re.sub(r'\s+', ' ', content)
        content = re.sub(r'\s+ITEM:', '\nITEM:', content)
        content = re.sub(r'\s+BRK\s+', '\n', content)
        
        return content.strip()
    
    def _extract_tables(self):
        """Extract tabular/table content"""
        table_pattern = r'\\begin\{tabular\}[^}]+\}(.+?)\\end\{tabular\}'
        tables = re.findall(table_pattern, self.raw_content, re.DOTALL)
        
        for table in tables:
            # Parse table rows
            rows = []
            for line in table.split(r'\\'):
                line = line.strip()
                if line and '&' in line:
                    cells = [c.strip() for c in line.split('&')]
                    rows.append(cells)
            if rows:
                self.tables.append(rows)
    
    def _extract_lists(self):
        """Extract itemize/enumerate lists"""
        list_pattern = r'\\begin\{(itemize|enumerate)\}(.+?)\\end\{\1\}'
        lists = re.findall(list_pattern, self.raw_content, re.DOTALL)
        
        for _, list_content in lists:
            items = []
            for item in re.findall(r'\\item\s+(.+?)(?=\\item|$)', list_content, re.DOTALL):
                item = self._clean_latex_content(item)
                items.append(item.strip())
            if items:
                self.lists.append(items)
    
    def _build_document_structure(self) -> Dict[str, Any]:
        """Build structured document from parsed sections"""
        doc = {
            'sections': self.sections,
            'tables': self.tables,
            'lists': self.lists,
            'raw': self.raw_content
        }
        return doc


# =============================================================================
# SCHEMA MAPPER
# =============================================================================

class SchemaMapper:
    """Map parsed LaTeX content to the machine JSON schema"""
    
    def __init__(self, parsed_doc: Dict[str, Any], brand: str = ""):
        self.doc = parsed_doc
        self.brand = brand
        self.schema = {**MACHINE_SCHEMA}
        
    def map_to_schema(self) -> Dict[str, Any]:
        """Map document sections to schema fields"""
        
        # Map title from first section or filename
        self._map_title()
        
        # Map purpose and applications
        self._map_purpose_and_applications()
        
        # Map classification table
        self._map_classification_table()
        
        # Map technical specs
        self._map_technical_specs()
        
        # Map working principles
        self._map_working_principles()
        
        # Map sequence flow
        self._map_sequence_flow()
        
        # Map parts list
        self._map_parts_list()
        
        # Map maintenance table
        self._map_maintenance()
        
        # Map resources
        self._map_resources()
        
        # Map final notes
        self._map_final_notes()
        
        return self.schema
    
    def _map_title(self):
        """Extract machine title"""
        sections = self.doc.get('sections', {})
        
        # Try first section title
        for title in list(sections.keys())[:3]:
            if any(kw in title.lower() for kw in ['machine', 'brother', 'juki', 'zoje']):
                # Extract brand and model
                match = re.search(r'([A-Za-z]+)\s*([A-Z]{2,4}[-\s]*[0-9]+[A-Z]*)', title)
                if match:
                    self.schema['brand'] = match.group(1)
                    self.schema['title'] = match.group(0)
                    self.schema['subtitle'] = title
                    break
        
        # Set category based on content
        if 'chain stitch' in str(sections).lower():
            self.schema['category'] = "Chain Stitch Machine"
        elif 'overlock' in str(sections).lower():
            self.schema['category'] = "Overlock Machine"
        elif 'coverstitch' in str(sections).lower():
            self.schema['category'] = "Coverstitch Machine"
        else:
            self.schema['category'] = "Industrial Sewing Machine"
    
    def _map_purpose_and_applications(self):
        """Extract purpose and applications"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'purpose' in title.lower() or 'application' in title.lower():
                content = section.get('content', '')
                
                # Extract purpose (usually first paragraph)
                paragraphs = content.split('BRK')
                if paragraphs:
                    purpose = paragraphs[0].replace('ITEM:', '').strip()
                    self.schema['purposeAndApplication']['purpose'] = purpose
                
                # Extract applications (itemize lists)
                for list_items in self.doc.get('lists', []):
                    if any(app in str(list_items)[:50].lower() for app in ['jeans', 'seam', 'stitch']):
                        self.schema['purposeAndApplication']['applications'] = list_items[:20]
                        break
    
    def _map_classification_table(self):
        """Extract classification table data"""
        tables = self.doc.get('tables', [])
        
        for table in tables:
            if len(table) > 2:
                # Assume key-value format
                for row in table:
                    if len(row) >= 2:
                        field_name = row[0].strip()
                        value = row[1].strip() if len(row) > 1 else ""
                        
                        # Check if this is a classification row
                        classification_fields = [
                            'machine name', 'manufacturer', 'brand', 'model',
                            'stitch type', 'bed type', 'needle configuration'
                        ]
                        if any(f in field_name.lower() for f in classification_fields):
                            self.schema['classificationTable'].append({
                                "field": field_name,
                                "value": value
                            })
    
    def _map_technical_specs(self):
        """Extract technical specifications"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'spec' in title.lower() or 'technical' in title.lower():
                content = section.get('content', '')
                
                # Try to extract spec rows
                for line in content.split('BRK'):
                    line = line.strip()
                    if ':' in line or '=' in line:
                        # Split on : or =
                        if ':' in line:
                            parts = line.split(':', 1)
                        else:
                            parts = line.split('=', 1)
                        
                        param = parts[0].strip()
                        value = parts[1].strip() if len(parts) > 1 else ""
                        
                        if param and value and len(param) < 50:
                            self.schema['technicalSpecs'].append({
                                "parameter": param,
                                "value": value
                            })
    
    def _map_working_principles(self):
        """Extract working principles"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'principle' in title.lower() or 'working' in title.lower():
                content = section.get('content', '')
                
                # Split by major headings or keep as one
                paragraphs = content.split('BRK')
                
                principle = {
                    "heading": title,
                    "description": " ".join(p.strip() for p in paragraphs if p.strip())
                }
                self.schema['workingPrinciples'].append(principle)
    
    def _map_sequence_flow(self):
        """Extract sequence/stitching flow steps"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'sequence' in title.lower() or 'flow' in title.lower() or 'step' in title.lower():
                content = section.get('content', '')
                
                # Extract numbered or bulleted steps
                steps = []
                for line in content.split('BRK'):
                    line = line.strip()
                    if line and ('step' in line.lower() or line[0].isdigit()):
                        parts = line.split('.', 1) if '.' in line else ['', line]
                        step_title = parts[0].strip() if parts[0] else f"Step {len(steps)+1}"
                        step_desc = parts[1].strip() if len(parts) > 1 else line
                        
                        steps.append({
                            "stepTitle": step_title,
                            "stepDescription": step_desc
                        })
                
                if steps:
                    self.schema['sequenceFlow'] = steps
    
    def _map_parts_list(self):
        """Extract parts list"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'part' in title.lower():
                content = section.get('content', '')
                
                # Look for part name and ID patterns
                # Pattern: Part Name (ID): Function
                part_pattern = r'([^(]+)\(([A-Z]\d+)\):\s*(.+)'
                
                for line in content.split('BRK'):
                    match = re.search(part_pattern, line)
                    if match:
                        self.schema['partsList'].append({
                            "partName": match.group(1).strip(),
                            "partId": match.group(2).strip(),
                            "function": match.group(3).strip()
                        })
    
    def _map_maintenance(self):
        """Extract maintenance/troubleshooting table"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'maintenance' in title.lower() or 'troubleshoot' in title.lower():
                content = section.get('content', '')
                
                # Look for code/definition/action patterns
                # Pattern: Code: XXX, Definition: ..., Action: ...
                entries = content.split('BRK')
                
                for entry in entries:
                    if any(keyword in entry.lower() for keyword in ['code', 'problem', 'issue']):
                        code_match = re.search(r'code[:\s]*(\d+)', entry, re.I)
                        def_match = re.search(r'(?:definition|problem)[:\s]*(.+?)(?:action|solution)', entry, re.I)
                        act_match = re.search(r'(?:action|solution)[:\s]*(.+)', entry, re.I)
                        
                        if code_match or def_match:
                            self.schema['maintenance'].append({
                                "code": code_match.group(1) if code_match else "00",
                                "definition": def_match.group(1).strip() if def_match else entry.strip()[:100],
                                "action": act_match.group(1).strip() if act_match else ""
                            })
    
    def _map_resources(self):
        """Extract resources/references"""
        sections = self.doc.get('sections', {})
        
        for title, section in sections.items():
            if 'resource' in title.lower() or 'reference' in title.lower() or 'link' in title.lower():
                content = section.get('content', '')
                
                # Look for URL patterns
                url_pattern = r'https?://[^\s]+'
                urls = re.findall(url_pattern, content)
                
                # Extract resource names
                entries = content.split('BRK')
                for i, entry in enumerate(entries):
                    entry = entry.strip()
                    if entry and len(entry) > 3:
                        url = urls[i] if i < len(urls) else ""
                        
                        # Extract name from entry
                        name = entry.replace('ITEM:', '').strip()
                        name = re.sub(r'https?://[^\s]+', '', name).strip()
                        
                        self.schema['resources'].append({
                            "resourceName": name[:50],
                            "description": entry[:200],
                            "url": url
                        })
    
    def _map_final_notes(self):
        """Extract final notes/warnings"""
        sections = self.doc.get('sections', {})
        notes = []
        for title, section in sections.items():
            if 'note' in title.lower() or 'warning' in title.lower() or 'caution' in title.lower():
                content = section.get('content', '')
                
                # Get list items
                for line in content.split('BRK'):
                    line = line.strip().replace('ITEM:', '').strip()
                    if line and len(line) > 10:
                        if not line.startswith('•'):
                            line = f"• {line}"
                        notes.append(line)
        if notes:
            self.schema['finalNotes'] = "\n".join(notes)


# =============================================================================
# AI ENHANCEMENT LAYER
# =============================================================================

class AIEnhancer:
    """Use OpenAI to enhance and complete the JSON mapping"""
    
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        self.client = OpenAI(api_key=api_key)
        self.model = model
    
    def enhance_mapping(self, content: str, schema_json: str) -> Dict[str, Any]:
        """Use AI to complete any missing fields in the schema mapping"""
        
        prompt = LATEX_TO_JSON_PROMPT.format(
            schema=json.dumps(MACHINE_SCHEMA, indent=2),
            latex_content=content[:15000]  # Limit to avoid token limits
        )
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a precise technical documentation extractor. Extract ALL data from the provided LaTeX document into the exact JSON schema provided."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=8000
        )
        
        result = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if result.startswith('```'):
            result = re.sub(r'^```json?\s*', '', result)
            result = re.sub(r'\s*```$', '', result)
        
        try:
            return json.loads(result)
        except json.JSONDecodeError as e:
            print(f"Warning: AI returned invalid JSON: {e}")
            return {}
    
    def validate_json(self, json_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate the generated JSON against the schema"""
        
        prompt = VALIDATION_PROMPT.format(
            schema=json.dumps(MACHINE_SCHEMA, indent=2),
            json=json.dumps(json_data, indent=2)
        )
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You validate JSON data against a schema. Return validation results only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        try:
            return json.loads(response.choices[0].message.content)
        except:
            return {"valid": True, "message": "Validation skipped"}


# =============================================================================
# MAIN AGENT
# =============================================================================

class LatexToJSONAgent:
    """Main agent for converting LaTeX to JSON"""
    
    def __init__(self, args):
        self.args = args
        self.input_file = Path(args.input)
        self.output_file = None
        self.latex_content = ""
        self.parsed_doc = {}
        self.schema = {}
        
    def run(self):
        """Execute the full agent workflow"""
        
        print(f"\n{'='*60}")
        print("  LaTeX to JSON Agent — Southern Machines")
        print(f"{'='*60}\n")
        
        # Step 1: Load LaTeX file
        print("📄 Loading LaTeX file...")
        self._load_latex()
        
        # Step 2: Parse LaTeX
        print("🔍 Parsing LaTeX document...")
        self._parse_latex()
        
        # Step 3: Map to schema (local parsing)
        print("📊 Mapping to JSON schema...")
        self._map_schema()
        
        # Step 4: AI enhancement (if API key available)
        if self.args.ai_enhance and os.getenv('OPENAI_API_KEY'):
            print("🤖 Enhancing with AI...")
            self._ai_enhance()
        
        # Step 5: Validate
        print("✅ Validating output...")
        self._validate()
        
        # Step 6: Save or display
        if self.args.dry_run:
            self._display_output()
        else:
            self._save_output()
        
        return self.schema
    
    def _load_latex(self):
        """Load LaTeX file content"""
        if not self.input_file.exists():
            raise FileNotFoundError(f"File not found: {self.input_file}")
        
        with open(self.input_file, 'r', encoding='utf-8') as f:
            self.latex_content = f.read()
        
        print(f"   Loaded {len(self.latex_content)} characters")
    
    def _parse_latex(self):
        """Parse LaTeX document"""
        parser = LatexDocumentParser(self.latex_content)
        self.parsed_doc = parser.parse()
        
        print(f"   Found {len(self.parsed_doc['sections'])} sections")
        print(f"   Found {len(self.parsed_doc['tables'])} tables")
        print(f"   Found {len(self.parsed_doc['lists'])} lists")
    
    def _map_schema(self):
        """Map parsed content to schema"""
        brand = self._extract_brand()
        mapper = SchemaMapper(self.parsed_doc, brand)
        self.schema = mapper.map_to_schema()
        
        # Set default values
        self.schema['machineImage'] = ""
        self.schema['reportDownloadUrl'] = ""
        self.schema['publishedDate'] = self._get_current_date()
    
    def _extract_brand(self) -> str:
        """Extract machine brand from content"""
        brands = ['Brother', 'JUKI', 'Kansai', 'Zoje', 'Kansai Special', 'OShima', 'Wulin', 'KM', 'Ngai Shing']
        
        for brand in brands:
            if brand.lower() in self.latex_content.lower():
                return brand
        
        return ""
    
    def _get_current_date(self) -> str:
        """Get current date in ISO format"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    
    def _ai_enhance(self):
        """Enhance mapping with AI"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            model = getattr(self.args, 'model', 'gpt-4o')
            
            enhancer = AIEnhancer(api_key, model)
            ai_result = enhancer.enhance_mapping(
                self.latex_content,
                json.dumps(self.schema)
            )
            
            # Merge AI result with local parsing
            for key, value in ai_result.items():
                if value and (key not in self.schema or not self.schema[key]):
                    self.schema[key] = value
            
        except Exception as e:
            print(f"   ⚠️ AI enhancement failed: {e}")
            print("   Continuing with locally parsed data...")
    
    def _validate(self):
        """Validate the JSON output"""
        required_fields = ['title', 'brand', 'category', 'purposeAndApplication']
        
        for field in required_fields:
            if field not in self.schema or not self.schema[field]:
                print(f"   ⚠️ Missing or empty: {field}")
    
    def _display_output(self):
        """Display JSON output"""
        print(f"\n{'='*60}")
        print("  GENERATED JSON (Preview)")
        print(f"{'='*60}\n")
        print(json.dumps(self.schema, indent=2))
    
    def _save_output(self):
        """Save JSON to output file"""
        # Determine output path
        if self.args.output:
            self.output_file = Path(self.args.output)
        else:
            # Auto-generate from input filename
            machine_name = self.input_file.stem
            self.output_file = Path('src/content/machines') / f"{machine_name}.json"
        
        # Ensure directory exists
        self.output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Write JSON
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(self.schema, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Saved to: {self.output_file}")
        
        # Offer to open in editor
        if self.args.interactive:
            try:
                response = input("\nOpen in editor for review? (y/n): ").strip().lower()
                if response == 'y':
                    import subprocess
                    subprocess.run(['code', str(self.output_file)])
            except EOFError:
                pass


# =============================================================================
# CLI ENTRY POINT
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Convert LaTeX machine documentation to JSON"
    )
    parser.add_argument('input', help="Input LaTeX .tex file")
    parser.add_argument('-o', '--output', help="Output JSON file path")
    parser.add_argument('-m', '--model', default='gpt-4o', help="OpenAI model")
    parser.add_argument('-t', '--temperature', type=float, default=0.3, help="AI temperature")
    parser.add_argument('--dry-run', action='store_true', help="Show output without saving")
    parser.add_argument('--no-ai', action='store_true', help="Disable AI enhancement")
    parser.add_argument('-i', '--interactive', action='store_true', default=True, help="Interactive mode")
    parser.add_argument('-v', '--verbose', action='store_true', help="Verbose output")
    
    args = parser.parse_args()
    args.ai_enhance = not args.no_ai
    
    # Load environment
    load_dotenv()
    
    try:
        agent = LatexToJSONAgent(args)
        agent.run()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
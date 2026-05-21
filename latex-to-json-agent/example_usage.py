#!/usr/bin/env python3
"""
Example usage of the LaTeX to JSON Agent
"""

from latex_to_json_agent import LatexToJSONAgent
import argparse

def example_basic_usage():
    """Basic usage - convert a single file"""
    agent = LatexToJSONAgent(
        input="input/machine_documentation.tex",
        output="src/content/machines/new-machine.json",
        dry_run=False
    )
    result = agent.run()
    print(f"Generated: {result['title']}")

def example_with_ai():
    """Usage with AI enhancement"""
    agent = LatexToJSONAgent(
        input="input/brother-da-927a.tex",
        ai_enhance=True,
        model="gpt-4o"
    )
    result = agent.run()
    print(f"Generated with AI: {result['title']}")

def example_dry_run():
    """Preview without saving"""
    agent = LatexToJSONAgent(
        input="input/machine.tex",
        dry_run=True,
        verbose=True
    )
    result = agent.run()
    # Preview printed to console

def example_batch():
    """Process multiple files"""
    import os
    from pathlib import Path
    
    input_dir = Path("input")
    for tex_file in input_dir.glob("*.tex"):
        output_name = tex_file.stem + ".json"
        print(f"Processing: {tex_file.name}")
        
        agent = LatexToJSONAgent(
            input=str(tex_file),
            output=f"src/content/machines/{output_name}"
        )
        agent.run()
        print(f"  ✓ Saved: {output_name}")

if __name__ == "__main__":
    # Run basic example
    example_basic_usage()

"""Setup script for LaTeX to JSON Agent"""
from setuptools import setup, find_packages

setup(
    name="latex-to-json-agent",
    version="1.0.0",
    description="AI-powered LaTeX to JSON converter for Southern Machines website",
    author="Southern Machines",
    packages=find_packages(),
    install_requires=[
        "latex2json>=0.3.0",
        "openai>=1.0.0",
        "python-dotenv>=1.0.0",
        "jsonschema>=4.0.0",
        "python-dateutil>=2.8.0",
    ],
    entry_points={
        "console_scripts": [
            "latex2json=latex_to_json_agent:main",
        ],
    },
    python_requires=">=3.8",
)

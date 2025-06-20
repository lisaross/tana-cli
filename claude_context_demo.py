#!/usr/bin/env python3
"""
Claude Context Manager - Python wrapper for Tana CLI context management
Demonstrates how to use the Tana CLI for persistent AI context management
"""

import subprocess
import json
import os
import uuid
from datetime import datetime
from pathlib import Path

class ClaudeContextManager:
    def __init__(self, project_name="default", tana_cli_path="./bin/tana-cli.js"):
        self.project_name = project_name
        self.tana_cli_path = tana_cli_path
        self.session_id = None
        self.session_file = None
        
    def start_session(self, load_context=True, user_profile="advanced"):
        """Start a new Claude session with context management"""
        self.session_id = f"claude_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        cmd = [
            self.tana_cli_path, "context", "session", "start",
            "--project", self.project_name
        ]
        
        if load_context:
            cmd.append("--load-context")
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Started session: {self.session_id}")
            print(f"  Project: {self.project_name}")
            return True
        else:
            print(f"✗ Failed to start session: {result.stderr}")
            return False
    
    def capture_insight(self, text, confidence="medium", evidence=None, impact="medium"):
        """Capture an insight or learning"""
        cmd = [
            self.tana_cli_path, "context", "insight", text,
            "--confidence", confidence,
            "--impact", impact,
            "--project", self.project_name
        ]
        
        if evidence:
            cmd.extend(["--evidence", evidence])
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Captured insight: {text[:50]}...")
        else:
            print(f"✗ Failed to capture insight: {result.stderr}")
    
    def capture_decision(self, text, rationale=None, alternatives=None, impact="medium"):
        """Capture a decision with rationale"""
        cmd = [
            self.tana_cli_path, "context", "decision", text,
            "--impact", impact,
            "--project", self.project_name
        ]
        
        if rationale:
            cmd.extend(["--rationale", rationale])
        if alternatives:
            cmd.extend(["--alternatives", alternatives])
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Captured decision: {text[:50]}...")
        else:
            print(f"✗ Failed to capture decision: {result.stderr}")
    
    def capture_preference(self, text, strength="medium", context="general", evidence=None):
        """Capture a user preference"""
        cmd = [
            self.tana_cli_path, "context", "preference", text,
            "--strength", strength,
            "--context", context,
            "--project", self.project_name
        ]
        
        if evidence:
            cmd.extend(["--evidence", evidence])
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Captured preference: {text[:50]}...")
        else:
            print(f"✗ Failed to capture preference: {result.stderr}")
    
    def capture_technical(self, text, solution=None, category="general", language=None):
        """Capture technical insight or solution"""
        cmd = [
            self.tana_cli_path, "context", "technical", text,
            "--category", category,
            "--project", self.project_name
        ]
        
        if solution:
            cmd.extend(["--solution", solution])
        if language:
            cmd.extend(["--language", language])
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Captured technical insight: {text[:50]}...")
        else:
            print(f"✗ Failed to capture technical insight: {result.stderr}")
    
    def create_checkpoint(self, message=None):
        """Create a session checkpoint"""
        cmd = [self.tana_cli_path, "context", "session", "checkpoint"]
        
        if message:
            cmd.extend(["--message", message])
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Created checkpoint")
        else:
            print(f"✗ Failed to create checkpoint: {result.stderr}")
    
    def end_session(self, auto_summarize=True, extract_insights=True):
        """End the current session"""
        cmd = [self.tana_cli_path, "context", "session", "end"]
        
        if auto_summarize:
            cmd.append("--auto-summarize")
        if extract_insights:
            cmd.append("--extract-insights")
            
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Ended session: {self.session_id}")
        else:
            print(f"✗ Failed to end session: {result.stderr}")
    
    def load_context(self, query, relevance_threshold=0.7):
        """Load relevant context (future feature with read API)"""
        cmd = [
            self.tana_cli_path, "context", "load", query,
            "--project", self.project_name,
            "--relevance-threshold", str(relevance_threshold)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        print(result.stdout)

def demo_claude_context_workflow():
    """Demonstrate a complete Claude context management workflow"""
    print("🚀 Claude Context Management Demo")
    print("=" * 40)
    
    # Initialize context manager
    context = ClaudeContextManager(project_name="tana-cli-enhancement")
    
    # Start session
    print("\n1. Starting Claude session...")
    context.start_session(load_context=True)
    
    # Capture insights during analysis
    print("\n2. Capturing insights...")
    context.capture_insight(
        "User wants Tana CLI to serve as persistent memory for Claude",
        confidence="high",
        evidence="Explicitly stated in conversation",
        impact="high"
    )
    
    context.capture_insight(
        "Context management transforms CLI from productivity tool to AI memory system",
        confidence="high",
        evidence="Analysis of use cases and architecture",
        impact="high"
    )
    
    # Capture decisions
    print("\n3. Capturing decisions...")
    context.capture_decision(
        "Implement context commands in existing Tana CLI",
        rationale="Leverages existing infrastructure and maintains consistency",
        alternatives="Separate tool,Browser extension,API wrapper",
        impact="high"
    )
    
    context.capture_decision(
        "Use structured tagging for context categorization",
        rationale="Enables efficient retrieval and organization",
        alternatives="Free-form text,Database storage",
        impact="medium"
    )
    
    # Capture user preferences
    print("\n4. Capturing user preferences...")
    context.capture_preference(
        "User prefers comprehensive analysis over quick answers",
        strength="strong",
        context="Technical discussions",
        evidence="Consistently asks for detailed explanations"
    )
    
    context.capture_preference(
        "User has high technical sophistication",
        strength="strong",
        context="Development discussions",
        evidence="Mentions Make.com, Cloudflare, custom scripts"
    )
    
    # Capture technical insights
    print("\n5. Capturing technical insights...")
    context.capture_technical(
        "Session persistence requires file-based storage between CLI calls",
        solution="Save session state to JSON files in config directory",
        category="session-management",
        language="javascript"
    )
    
    context.capture_technical(
        "Context relevance scoring needs multiple factors",
        solution="Weighted scoring: semantic similarity, recency, confidence, project relevance",
        category="context-retrieval",
        language="javascript"
    )
    
    # Create checkpoint
    print("\n6. Creating checkpoint...")
    context.create_checkpoint("Completed context management prototype implementation")
    
    # Demonstrate context loading (future feature)
    print("\n7. Loading context (future feature)...")
    context.load_context("How to implement error handling in CLI?")
    
    # End session
    print("\n8. Ending session...")
    context.end_session(auto_summarize=True, extract_insights=True)
    
    print("\n✅ Demo completed!")
    print("\nThis demonstrates how Claude can maintain persistent memory")
    print("and context across sessions using the Tana CLI.")

if __name__ == "__main__":
    demo_claude_context_workflow()


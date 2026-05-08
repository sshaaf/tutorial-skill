#!/bin/bash
#
# Test script for Java project analysis and tutorial generation
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$SCRIPT_DIR/java"
OUTPUT_DIR="$SCRIPT_DIR/output/java"

echo "======================================"
echo "Tutorial Skill - Java Test"
echo "======================================"
echo ""

# Clean previous output
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "Test Project: $TEST_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Count files
FILE_COUNT=$(find "$TEST_DIR" -name "*.java" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT Java files"
echo ""

# List files
echo "Files to analyze:"
find "$TEST_DIR" -name "*.java" -exec basename {} \;
echo ""

echo "--------------------------------------"
echo "Test: Build Tutorial"
echo "--------------------------------------"
echo ""
echo "This test would run: /tutorial build --output $OUTPUT_DIR"
echo ""
echo "Expected analysis (Stages 1-3):"
echo "  - Core abstractions: User, UserRepository, UserService, PasswordEncoder, UserController"
echo "  - Categories: Model, Repository, Service, Utility, Controller"
echo "  - Relationships: UserController -> UserService -> UserRepository"
echo "  - Architecture: Layered (MVC)"
echo ""
echo "Expected output files:"
echo "  - README.md (Introduction)"
echo "  - 01-User.md"
echo "  - 02-PasswordEncoder.md"
echo "  - 03-UserRepository.md"
echo "  - 04-UserService.md"
echo "  - 05-UserController.md"
echo ""

echo "To run this test with Claude Code:"
echo "  cd $TEST_DIR"
echo "  /tutorial:build --output $OUTPUT_DIR"
echo ""

echo "--------------------------------------"
echo "Manual Test Instructions"
echo "--------------------------------------"
echo ""
echo "1. Open Claude Code"
echo "2. Navigate to: $TEST_DIR"
echo "3. Run: /tutorial build --output $OUTPUT_DIR"
echo "4. Verify analysis identifies 5 core components and MVC architecture"
echo "5. Verify tutorial files are created in $OUTPUT_DIR"
echo "6. Check that chapters explain:"
echo "   - User model (data structure)"
echo "   - Repository pattern (data access)"
echo "   - Service layer (business logic)"
echo "   - Controller layer (HTTP handling)"
echo ""

echo "======================================"
echo "Test preparation complete!"
echo "======================================"
echo ""
echo "Files are ready at: $TEST_DIR"
echo "Run the commands above in Claude Code to test the skill."

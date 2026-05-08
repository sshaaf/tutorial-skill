#!/bin/bash
#
# Test script for JavaScript project analysis and tutorial generation
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$SCRIPT_DIR/javascript"
OUTPUT_DIR="$SCRIPT_DIR/output/javascript"

echo "======================================"
echo "Tutorial Skill - JavaScript Test"
echo "======================================"
echo ""

# Clean previous output
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "Test Project: $TEST_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Count files
FILE_COUNT=$(find "$TEST_DIR" -name "*.js" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT JavaScript files"
echo ""

# List files
echo "Files to analyze:"
find "$TEST_DIR" -name "*.js" -exec basename {} \;
echo ""

echo "--------------------------------------"
echo "Test: Build Tutorial"
echo "--------------------------------------"
echo ""
echo "This test would run: /tutorial build --output $OUTPUT_DIR"
echo ""
echo "Expected analysis (Stages 1-3):"
echo "  - Core abstractions: User, UserRepository, UserService, PasswordEncoder, UserController"
echo "  - Language features: Classes, Map, Arrow functions, CommonJS modules"
echo "  - Relationships: UserController -> UserService -> UserRepository"
echo "  - Architecture: Layered (MVC)"
echo ""
echo "Expected output files:"
echo "  - index.md (Introduction)"
echo "  - 01-User.md"
echo "  - 02-PasswordEncoder.md"
echo "  - 03-UserRepository.md"
echo "  - 04-UserService.md"
echo "  - 05-UserController.md"
echo ""

echo "To run this test with Claude Code:"
echo "  cd $TEST_DIR"
echo "  /tutorial build --output $OUTPUT_DIR"
echo ""

echo "--------------------------------------"
echo "Manual Test Instructions"
echo "--------------------------------------"
echo ""
echo "1. Open Claude Code"
echo "2. Navigate to: $TEST_DIR"
echo "3. Run: /tutorial build --output $OUTPUT_DIR"
echo "4. Verify analysis identifies 5 core components and JS features"
echo "5. Verify tutorial files are created in $OUTPUT_DIR"
echo "6. Check that chapters explain:"
echo "   - User class with toJSON method"
echo "   - Repository using Map for storage"
echo "   - Service layer with error handling"
echo "   - Controller with Response class"
echo ""

echo "======================================"
echo "Test preparation complete!"
echo "======================================"
echo ""
echo "Files are ready at: $TEST_DIR"
echo "Run the commands above in Claude Code to test the skill."

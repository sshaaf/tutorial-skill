#!/bin/bash
#
# Test script for Python project analysis and tutorial generation
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$SCRIPT_DIR/python"
OUTPUT_DIR="$SCRIPT_DIR/output/python"

echo "======================================"
echo "Tutorial Skill - Python Test"
echo "======================================"
echo ""

# Clean previous output
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "Test Project: $TEST_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Count files
FILE_COUNT=$(find "$TEST_DIR" -name "*.py" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT Python files"
echo ""

# List files
echo "Files to analyze:"
find "$TEST_DIR" -name "*.py" -exec basename {} \;
echo ""

echo "--------------------------------------"
echo "Test: Build Tutorial"
echo "--------------------------------------"
echo ""
echo "This test would run: /tutorial build --output $OUTPUT_DIR"
echo ""
echo "Expected analysis (Stages 1-3):"
echo "  - Core abstractions: User, UserRepository, UserService, PasswordEncoder, UserController"
echo "  - Language features: Dataclasses, Type hints, List comprehensions"
echo "  - Relationships: UserController -> UserService -> UserRepository"
echo "  - Architecture: Layered (MVC)"
echo ""
echo "Expected output files:"
echo "  - index.md (Introduction)"
echo "  - 01-user.md"
echo "  - 02-password_encoder.md"
echo "  - 03-user_repository.md"
echo "  - 04-user_service.md"
echo "  - 05-user_controller.md"
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
echo "4. Verify analysis identifies 5 core components and Python features"
echo "5. Verify tutorial files are created in $OUTPUT_DIR"
echo "6. Check that chapters explain:"
echo "   - User dataclass"
echo "   - Repository pattern in Python"
echo "   - Service layer with validation"
echo "   - Controller with Response wrapper"
echo ""

echo "======================================"
echo "Test preparation complete!"
echo "======================================"
echo ""
echo "Files are ready at: $TEST_DIR"
echo "Run the commands above in Claude Code to test the skill."

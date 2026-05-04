#!/bin/bash
#
# Master test script - runs all language tests
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "Tutorial Skill - Master Test Suite"
echo "=========================================="
echo ""
echo "This will prepare tests for all languages"
echo ""

# Run each test
for lang in java python javascript go; do
    echo ""
    echo "===================="
    echo "Testing: $lang"
    echo "===================="
    "$SCRIPT_DIR/test-$lang.sh"
    echo ""
done

echo "=========================================="
echo "All Tests Prepared!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open Claude Code"
echo "2. Navigate to any test directory:"
echo "   - ~/git/SKILLS/tutorial/tests/java"
echo "   - ~/git/SKILLS/tutorial/tests/python"
echo "   - ~/git/SKILLS/tutorial/tests/javascript"
echo "   - ~/git/SKILLS/tutorial/tests/go"
echo "3. Run: /tutorial:analyze"
echo "4. Run: /tutorial:build --output ./output"
echo ""
echo "Or run individual test scripts:"
echo "  ./test-java.sh"
echo "  ./test-python.sh"
echo "  ./test-javascript.sh"
echo "  ./test-go.sh"

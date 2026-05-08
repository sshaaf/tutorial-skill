# Practice Exercise Examples

This file contains example practice exercises to guide tutorial generation. These examples demonstrate the recommended structure and progressive difficulty.

## Example 1: Java Service Class

**Practice Exercise**:
1. Open your `EmbeddingService.java` file
2. Add a new method: `public List<float[]> getVectors(List<String> texts)` that processes multiple texts efficiently
3. Implement it using Java Streams
4. **Bonus**: Add validation to reject null or empty strings
5. **Challenge**: Measure performance — is processing 100 texts one-by-one faster or slower than batching?

**Expected Outcome**: Your method should successfully convert a list of text strings into their vector embeddings, handle edge cases gracefully, and you'll understand the performance characteristics of batch vs. individual processing.

**Hints**:
- Use `texts.stream().map(...)` to transform each text to its vector
- Consider adding `Objects.requireNonNull()` or creating a custom validator
- For performance testing, try `System.nanoTime()` before and after your operations

**Solution**: The most efficient approach uses Stream API's `map()` to transform texts to vectors, wraps the operation in validation that filters out invalid inputs, and batching typically performs better due to reduced overhead — aim for batch sizes of 10-50 for optimal throughput.

---

## Example 2: Python Data Processing

**Practice Exercise**:
1. Navigate to `data_processor.py`
2. Create a function `clean_data(df: pd.DataFrame) -> pd.DataFrame` that removes rows with missing values
3. Add a parameter `columns: List[str]` to only check specific columns
4. **Bonus**: Add an option to fill missing values instead of removing rows
5. **Challenge**: Write unit tests that verify your function handles edge cases (empty DataFrame, all missing values, etc.)

**Expected Outcome**: A robust data cleaning function that can handle various DataFrame scenarios and has configurable behavior for missing data.

**Hints**:
- `df.dropna()` is your friend, but check its parameters for subset-based filtering
- Consider using `df.fillna()` for the bonus task
- pytest fixtures can help create test DataFrames

**Solution**: Use `df.dropna(subset=columns)` for targeted cleaning, add a boolean flag `fill_missing` to switch between drop and fill strategies, and test with DataFrames of varying sizes including empty ones.

---

## Example 3: JavaScript/TypeScript API Endpoint

**Practice Exercise**:
1. Open `src/controllers/userController.ts`
2. Add a new endpoint: `PUT /users/:id/preferences` to update user preferences
3. Validate that the request body contains valid preference keys
4. **Bonus**: Add rate limiting (max 10 updates per hour per user)
5. **Challenge**: Implement optimistic locking to prevent concurrent update conflicts

**Expected Outcome**: A working API endpoint that safely updates user preferences with proper validation, optional rate limiting, and conflict prevention.

**Hints**:
- Express middleware can help with validation (consider `express-validator`)
- For rate limiting, look into `express-rate-limit` or implement a simple counter in Redis
- Optimistic locking typically uses a version field — check if the version matches before updating

**Solution**: Create a PUT handler that validates input against a schema, stores update timestamps in a cache/database for rate limiting, and includes a version check in the update query (e.g., `WHERE id = ? AND version = ?`).

---

## Best Practices for Practice Exercises

### Progressive Difficulty Structure
1. **Task 1-2**: Basic modification or implementation
2. **Task 3**: More complex functionality
3. **Bonus**: Optional enhancement (clearly marked)
4. **Challenge**: Advanced topic for motivated learners (clearly marked)

### Good Task Characteristics
- ✅ Specific and actionable ("Add a method called `X`")
- ✅ Builds on chapter content
- ✅ Testable/verifiable outcome
- ✅ Real-world relevant
- ❌ Vague ("Make the code better")
- ❌ Requires unintroduced concepts
- ❌ Trivial busy work

### Hints Should
- Guide thinking without providing the answer
- Reference relevant documentation or APIs
- Suggest approaches, not specific code

### Solutions Should
- Describe the approach conceptually
- Mention key APIs or patterns to use
- Avoid providing complete code (encourage exploration)
- Explain *why* this approach works

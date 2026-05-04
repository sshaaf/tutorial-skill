package main

// Response represents an HTTP response.
type Response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// NewSuccessResponse creates a success response.
func NewSuccessResponse(data interface{}) *Response {
	return &Response{
		Status:  200,
		Message: "Success",
		Data:    data,
	}
}

// NewErrorResponse creates an error response.
func NewErrorResponse(status int, message string) *Response {
	return &Response{
		Status:  status,
		Message: message,
	}
}

// UserController handles HTTP requests for user endpoints.
// Delegates business logic to UserService.
type UserController struct {
	userService *UserService
}

// NewUserController creates a new UserController instance.
func NewUserController(userService *UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

// RegisterRequest represents a user registration request.
type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginRequest represents a user login request.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterUser handles POST /api/users/register
// Registers a new user.
func (c *UserController) RegisterUser(req RegisterRequest) *Response {
	user, err := c.userService.RegisterUser(req.Username, req.Email, req.Password)
	if err != nil {
		return NewErrorResponse(400, err.Error())
	}
	return NewSuccessResponse(user.ToMap())
}

// Login handles POST /api/users/login
// Authenticates a user.
func (c *UserController) Login(req LoginRequest) *Response {
	user := c.userService.Authenticate(req.Username, req.Password)
	if user != nil {
		return NewSuccessResponse(user.ToMap())
	}
	return NewErrorResponse(401, "Invalid credentials")
}

// GetUser handles GET /api/users/:id
// Gets a user by ID.
func (c *UserController) GetUser(id int64) *Response {
	user := c.userService.GetUserByID(id)
	if user != nil {
		return NewSuccessResponse(user.ToMap())
	}
	return NewErrorResponse(404, "User not found")
}

// GetAllUsers handles GET /api/users
// Gets all active users.
func (c *UserController) GetAllUsers() *Response {
	users := c.userService.GetAllActiveUsers()
	userMaps := make([]map[string]interface{}, len(users))
	for i, user := range users {
		userMaps[i] = user.ToMap()
	}
	return NewSuccessResponse(userMaps)
}

// DeactivateUser handles DELETE /api/users/:id
// Deactivates a user.
func (c *UserController) DeactivateUser(id int64) *Response {
	success := c.userService.DeactivateUser(id)
	if success {
		return NewSuccessResponse("User deactivated")
	}
	return NewErrorResponse(404, "User not found")
}

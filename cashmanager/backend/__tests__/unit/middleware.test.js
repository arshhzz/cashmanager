const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../../middleware');
const { JWT_SECRET } = require('../../config');

// Mock Express request, response, and next function
const mockRequest = (authHeader) => ({
  headers: {
    authorization: authHeader
  }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 401 if no authorization header', () => {
    const req = mockRequest();
    const res = mockResponse();
    
    authMiddleware(req, res, mockNext);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authorization token missing'
    });
  });

  test('should return 401 if token is not Bearer', () => {
    const req = mockRequest('Invalid token');
    const res = mockResponse();
    
    authMiddleware(req, res, mockNext);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authorization token missing'
    });
  });

  test('should return 403 if token is invalid', () => {
    const req = mockRequest('Bearer invalid.token.here');
    const res = mockResponse();
    
    authMiddleware(req, res, mockNext);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token'
    });
  });

  test('should call next() if token is valid', () => {
    const userId = '123456';
    const token = jwt.sign({ userId }, JWT_SECRET);
    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();
    
    authMiddleware(req, res, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
    expect(req.userId).toBe(userId);
  });
}); 
const { errorHandler } = require('../../middleware');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Error Handler Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle ValidationError', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        email: { message: 'Invalid email format' },
        password: { message: 'Password too short' }
      }
    };
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation error',
      errors: ['Invalid email format', 'Password too short']
    });
  });

  test('should handle duplicate key error', () => {
    const err = {
      code: 11000
    };
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists'
    });
  });

  test('should handle generic error', () => {
    const err = new Error('Something went wrong');
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    });
  });
}); 
// Jest setup file for lang-tools tests

// Extend Jest matchers if needed
expect.extend({
  // Custom matcher for checking if a value is a Data_Value
  toBeDataValue(received) {
    const pass = received && received.__data_value === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a Data_Value`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a Data_Value`,
        pass: false,
      };
    }
  },
  
  // Custom matcher for checking if a value is a Data_Object
  toBeDataObject(received) {
    const pass = received && received.__data_object === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a Data_Object`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a Data_Object`,
        pass: false,
      };
    }
  },
  
  // Custom matcher for checking immutability
  toBeImmutable(received) {
    const pass = received && received.__immutable === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be immutable`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be immutable`,
        pass: false,
      };
    }
  }
});

// Global test timeout
jest.setTimeout(10000);

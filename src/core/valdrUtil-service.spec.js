describe('valdrUtil', function () {

  var valdrUtil;

  beforeEach(module('valdr'));
  beforeEach(inject(function (_valdrUtil_) {
    valdrUtil = _valdrUtil_;
  }));

  it('should have a isNaN function', inject(function (valdrUtil) {
    expect(valdrUtil.isNaN);
  }));

  describe('result()', function () {

    it('should create validation result', function () {
      // given
      var validity = false;
      var message = 'some.message.key';
      var messageParams = ['one', 'two'];

      // when
      var result = valdrUtil.result(validity, message, messageParams);

      // then
      expect(result.valid).toBe(validity);
      expect(result.message).toBe(message);
      expect(result.messageParams).toBe(messageParams);
    });

    it('should create validation result without message params', function () {
      // given
      var validity = true;
      var message = 'some.message.key';

      // when
      var result = valdrUtil.result(validity, message);

      // then
      expect(result.valid).toBe(validity);
      expect(result.message).toBe(message);
      expect(result.messageParams).toBeUndefined();
    });

  });

  describe('notEmpty()/isEmpty()', function () {

    it('should validate strings', function () {
      expect(valdrUtil.notEmpty('string')).toBe(true);
      expect(valdrUtil.isEmpty('string')).toBe(false);
    });

    it('should validate null value', function () {
      expect(valdrUtil.notEmpty(null)).toBe(false);
      expect(valdrUtil.isEmpty(null)).toBe(true);
      expect(valdrUtil.notEmpty('null')).toBe(true);
      expect(valdrUtil.isEmpty('null')).toBe(false);
    });

    it('should validate undefined value', function () {
      expect(valdrUtil.notEmpty(undefined)).toBe(false);
      expect(valdrUtil.isEmpty(undefined)).toBe(true);
    });

    it('should validate NaN value', function () {
      expect(valdrUtil.notEmpty(NaN)).toBe(false);
      expect(valdrUtil.isEmpty(NaN)).toBe(true);
    });

    it('should validate empty string', function () {
      expect(valdrUtil.notEmpty('')).toBe(false);
      expect(valdrUtil.isEmpty('')).toBe(true);
    });

  });

});
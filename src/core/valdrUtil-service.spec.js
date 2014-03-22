describe('valdrUtil', function () {

  var valdrUtil;

  beforeEach(module('valdr'));
  beforeEach(inject(function (_valdrUtil_) {
    valdrUtil = _valdrUtil_;
  }));

  it('should have a isNaN function', inject(function (valdrUtil) {
    expect(valdrUtil.isNaN);
  }));

  describe('notNull()', function () {

    it('should validate null value', function () {
      expect(valdrUtil.notNull(null)).toBe(false);
      expect(valdrUtil.notNull('null')).toBe(true);
    });

    it('should validate undefined value', function () {
      expect(valdrUtil.notNull(undefined)).toBe(false);
    });

    it('should validate NaN value', function () {
      expect(valdrUtil.notNull(NaN)).toBe(false);
    });

  });

  describe('result()', function () {

    it('should create validation result', function () {
      // given
      var validity = false;
      var messageKey = 'some.message.key';
      var messageParams = ['one', 'two'];

      // when
      var result = valdrUtil.result(validity, messageKey, messageParams);

      // then
      expect(result.valid).toBe(validity);
      expect(result.messageKey).toBe(messageKey);
      expect(result.messageParams).toBe(messageParams);
    });

    it('should create validation result without message params', function () {
      // given
      var validity = true;
      var messageKey = 'some.message.key';

      // when
      var result = valdrUtil.result(validity, messageKey);

      // then
      expect(result.valid).toBe(validity);
      expect(result.messageKey).toBe(messageKey);
      expect(result.messageParams).toBeUndefined();
    });

  });

});
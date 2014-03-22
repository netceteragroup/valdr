describe('validationUtil', function () {

  var validationUtil;

  beforeEach(module('valdr'));

  beforeEach(inject(function (_validationUtil_) {
    validationUtil = _validationUtil_;
  }));

  describe('notNull()', function () {

    it('should validate null value', function () {
      expect(validationUtil.notNull(null)).toBe(false);
      expect(validationUtil.notNull('null')).toBe(true);
    });

    it('should validate undefined value', function () {
      expect(validationUtil.notNull(undefined)).toBe(false);
    });

    it('should validate NaN value', function () {
      expect(validationUtil.notNull(NaN)).toBe(false);
    });

  });

  describe('result()', function () {

    it('should create validation result', function () {
      // given
      var validity = false;
      var messageKey = 'some.message.key';
      var messageParams = ['one', 'two'];

      // when
      var result = validationUtil.result(validity, messageKey, messageParams);

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
      var result = validationUtil.result(validity, messageKey);

      // then
      expect(result.valid).toBe(validity);
      expect(result.messageKey).toBe(messageKey);
      expect(result.messageParams).toBeUndefined();
    });

  });

});

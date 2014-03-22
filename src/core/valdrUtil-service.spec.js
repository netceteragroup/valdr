describe('valdrUtil', function () {

  var valdrUtil;

  beforeEach(module('valdr'));
  beforeEach(inject(function (_valdrUtil_) {
    valdrUtil = _valdrUtil_;
  }));

  describe('forOwn()', function () {
    it('should invoke callback twice', function () {
      var callback = {
        func: function () {
        }
      };

      spyOn(callback, 'func').andCallThrough();
      valdrUtil.forOwn({property: 'value', prop2: 'val2'}, callback.func);
      expect(callback.func.calls.length).toEqual(2);

    });
    it('should return \'value\' for single property', function () {
      valdrUtil.forOwn({property: 'value'}, function (property, value) {
        expect(value).toEqual('value');
      });
    });
  });

  it('should have a isNaN function',
    inject(function (valdrUtil) {
      expect(valdrUtil.isNaN);
    }));

});
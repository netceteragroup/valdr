describe('ncaUtil', function () {

  var ncaUtil;

  beforeEach(module('valdr'));
  beforeEach(inject(function (_ncaUtil_) {
    ncaUtil = _ncaUtil_;
  }));

  describe('forOwn()', function () {
    it('should invoke callback twice', function () {
      var callback = {
        func: function () {
        }
      };

      spyOn(callback, 'func').andCallThrough();
      ncaUtil.forOwn({property: 'value', prop2: 'val2'}, callback.func);
      expect(callback.func.calls.length).toEqual(2);

    });
    it('should return \'value\' for single property', function () {
      ncaUtil.forOwn({property: 'value'}, function (property, value) {
        expect(value).toEqual('value');
      });
    });
  });

  it('should have a isNaN function',
    inject(function (ncaUtil) {
      expect(ncaUtil.isNaN);
    }));

});
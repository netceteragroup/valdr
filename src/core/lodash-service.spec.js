describe('lodash', function () {

  beforeEach(module('ncaModelValidation'));

  it('should return lodash instance from $window',
    inject(function (lodash) {
      expect(lodash).toBeDefined();
      expect(lodash.find).toBeDefined();
      expect(lodash.VERSION).toBeDefined();
    }));

});
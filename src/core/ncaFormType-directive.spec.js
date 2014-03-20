describe('ncaFormType directive', function () {

  var $scope, $compile, element, FormTypeController;

  var compileTemplate = function () {
    var element = $compile(angular.element('<div nca-form-type="TestClass"></div>'))($scope);
    $scope.$digest();
    return element;
  };

  beforeEach(module('ncaModelValidation'));

  beforeEach(inject(function ($rootScope, $controller, _$compile_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    element = compileTemplate();
    FormTypeController = element.controller('ncaFormType');
  }));

  it('should read the type from the attribute', function () {
    expect(FormTypeController.getType()).toBe('TestClass');
  });

  it('should allow to nest the directive', function () {
    // given
    var element = $compile(angular.element(
      '<div nca-form-type="TestClass">' +
        '<span nca-form-type="NestedClass"></span>' +
      '</div>'))($scope);

    // when
    var rootController = element.controller('ncaFormType');
    var nestedController = element.find('span').controller('ncaFormType');

    // then
    expect(rootController.getType()).toBe('TestClass');
    expect(nestedController.getType()).toBe('NestedClass');
  });

});

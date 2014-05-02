describe('valdrType directive', function () {

  var $scope, $compile, element, FormTypeController;

  var compileTemplate = function () {
    var element = $compile(angular.element('<div valdr-type="TestClass"></div>'))($scope);
    $scope.$digest();
    return element;
  };

  beforeEach(module('valdr'));

  beforeEach(inject(function ($rootScope, $controller, _$compile_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    element = compileTemplate();
    FormTypeController = element.controller('valdrType');
  }));

  it('should read the type from the attribute', function () {
    expect(FormTypeController.getType()).toBe('TestClass');
  });

  it('should allow to nest the directive', function () {
    // given
    var element = $compile(angular.element(
      '<div valdr-type="TestClass">' +
        '<span valdr-type="NestedClass"></span>' +
        '</div>'))($scope);

    // when
    var rootController = element.controller('valdrType');
    var nestedController = element.find('span').controller('valdrType');

    // then
    expect(rootController.getType()).toBe('TestClass');
    expect(nestedController.getType()).toBe('NestedClass');
  });

});

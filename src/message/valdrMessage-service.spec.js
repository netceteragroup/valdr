describe('valdrMessage service', function () {

  var valdrMessage;

  beforeEach(module('valdr'));
  beforeEach(inject(function (_valdrMessage_) {
    valdrMessage = _valdrMessage_;
  }));

  it('should provide the default templateUrl', function () {
    expect(valdrMessage.templateUrl).toBe('valdr/default-message.html');
  });

  it('should populate the $templateCache with the default template', function () {
    inject(function ($templateCache) {
      // given
      var templateUrl = valdrMessage.templateUrl;

      // when
      var template = $templateCache.get(templateUrl);

      // then
      expect(template).toBeDefined();
      expect(template).toBe('<div class="valdr-message">{{ violation.message }}</div>');
    });
  });

});

describe('valdrMessageProvider', function () {

  it('should provide the custom template URL and NOT populate $templateCache', function () {
    // given
    var customTemplateUrl = 'custom/template.html';
    module('valdr');

    // when
    module(function (valdrMessageProvider) {
      valdrMessageProvider.setTemplateUrl(customTemplateUrl);
    });

    // then
    inject(function (valdrMessage, $templateCache) {
      expect(valdrMessage.templateUrl).toBe(customTemplateUrl);
      expect($templateCache.get(valdrMessage.templateUrl)).toBeUndefined();
    });
  });

  it('should populate $templateCache with the custom template', function () {
    // given
    var customTemplate = '<div>my template</div>';
    module('valdr');

    // when
    module(function (valdrMessageProvider) {
      valdrMessageProvider.setTemplate(customTemplate);
    });

    // then
    inject(function (valdrMessage, $templateCache) {
      var template = $templateCache.get(valdrMessage.templateUrl);
      expect(template).toBe(customTemplate);
    });
  });


  it('should populate $templateCache with the custom template and custom URL', function () {
    // given
    var customTemplate = '<div>my template</div>';
    var customTemplateUrl = 'custom/my-template.html';
    module('valdr');

    // when
    module(function (valdrMessageProvider) {
      valdrMessageProvider.setTemplateUrl(customTemplateUrl);
      valdrMessageProvider.setTemplate(customTemplate);
    });

    // then
    inject(function (valdrMessage, $templateCache) {
      expect(valdrMessage.templateUrl).toBe(customTemplateUrl);
      var template = $templateCache.get(valdrMessage.templateUrl);
      expect(template).toBe(customTemplate);
    });
  });

});
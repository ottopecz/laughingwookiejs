Laughing wookie
===============

Intro
-----
Simple chaining tool for behaviour driven unit-testing in JavaScript. It can be used with every major unit-test framework.

Example usage
-------------
```
bdd()
    .GIVEN(aControllerType)
      .AND(microIsDataInDOM)
    .WHEN(anInstanceIsCreated)
    .THEN(parsedDataEntersTheModel)
      .AND(aViewGetsCreated);
      
var aControllerType = function () {
        return ControllerConstructor;
    },
    microDataIsInDOM = function (given) {
        $('#controlled-dom').attr("data-micro", "Travis Bickle");
        
        return given;
    },
    anInstanceIsCreated = function (given) {
        var Constructor = given;
        
        return new Constructor({"el", $('#controlled-dom').get(0)});
    },
    parsedDataEntersTheModel = function (givenAfterWhen) {
        var contr = givenAfterWhen;
        
        assert.strictEqual(contr.model.get('micro'), $('#controlled-dom').attr('data-micro'), "The microdata in the DOM         enters the model.")
    },
    aViewGetsCreated = function (givenAfterWhen) {
        var contr = givenAfterWhen;
        
        assert.ok(contr.view, "The controller has a view key");
        assert.ok(contr.view instanceOf ViewConstructor, "The view is an instance of the View constructor");
    };
```

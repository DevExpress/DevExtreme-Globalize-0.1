(function (QUnit, $, DX, Globalize) {
    var messageLocalization = DX.localization.message;

    $.each([ "de", "en", "ja", "ru" ], function(_, culture) {
        QUnit.module("message - " + culture, {
            beforeEach: function() {
                var dictionary = {};
                
                dictionary[culture] = {
                    addedKey: culture + "TestValue",
                    hello: culture + " Hello, {0} {1}"
                };
                
                messageLocalization.load(dictionary);
                Globalize.culture(culture);
            },
            afterEach: function() {
                Globalize.culture("en");
            }
        });
        
        QUnit.test("load", function(assert) {
            assert.equal(Globalize.localize("addedKey"), culture + "TestValue", "messages goes to the Globalize dictionary");
        });
        
        QUnit.test("format", function(assert) {
            assert.equal(messageLocalization.format("addedKey"), culture + "TestValue", "fprmatting message loaded by messageLocalization.load");
            Globalize.addCultureInfo(culture, {
                messages: { testKey: culture + "123" }
            });
            assert.equal(messageLocalization.format("testKey"), culture + 123, "fprmatting message loaded by Globalize.addCultureInfo");
        });
        
        QUnit.test("getFormatter", function(assert) {
            assert.equal(messageLocalization.getFormatter("hello")(["John", "Smith"]), culture + " Hello, John Smith");
            assert.equal(messageLocalization.getFormatter("hello")("John", "Smith"), culture + " Hello, John Smith");
        });

        QUnit.test("localizeString", function(assert) {
            var toLocalize,
                localized;
            
            toLocalize = "@addedKey @@addedKey @";
            localized = messageLocalization.localizeString(toLocalize);
            assert.equal(localized, culture + "TestValue @addedKey @", "string localized correctly");
            
            toLocalize = "E-mails such as email@addedKey.com are not localized";
            localized = messageLocalization.localizeString(toLocalize);
            assert.equal(localized, toLocalize, "localizeString doesn't affect e-mails");
            
            toLocalize = "@unknownKey";
            localized = messageLocalization.localizeString(toLocalize);
            assert.equal(localized, toLocalize, "localizeString doesn't affect unknown keys");
        });
        
        QUnit.test("localizeNode", function(assert) {
            var $node = $(
                    "<div data='@Loading'> \
                       @Loading \
                       <div data='@Loading' class='inner'> \
                           @Loading \
                       </div> \
                    </div>"),
                $contents = $node.contents(),
                expected = Globalize.localize("Loading");

            messageLocalization.localizeNode($node);

            assert.equal($node.attr("data"), expected);

            assert.equal($.trim($contents.eq(0).text()), expected);
            assert.equal($contents.eq(1).attr("data"), expected);
            assert.equal($.trim($contents.eq(1).text()), expected);
            
            $node = $("<iframe data='@Loading'></iframe>");

            messageLocalization.localizeNode($node);
            assert.equal($node.attr("data"), "@Loading", "localizeNode: iframes should be ignored");
        });
        
        QUnit.test("setup", function(assert) {
            var localized = messageLocalization.localizeString("@addedKey #addedKey");
            assert.equal(localized, culture + "TestValue #addedKey");

            try {
                messageLocalization.setup("#");

                localized = messageLocalization.localizeString("@addedKey #addedKey");
                assert.equal(localized, "@addedKey " + culture + "TestValue");
            }
            finally {
                messageLocalization.setup("@");
            }
        });
        
    });
    
}(QUnit, jQuery, DevExpress, Globalize));

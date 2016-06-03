(function (QUnit, $, DX, Globalize) {
    var numberLocalization = DX.localization.number;
    
    $.each([ "de", "en", "ja", "ru" ], function(_, culture) {
        QUnit.module("number - " + culture, {
            beforeEach: function() {
                Globalize.culture(culture);
            },
            afterEach: function() {
                Globalize.culture("en");
            }
        });

        QUnit.test("format", function (assert) {
            var assertData = [
                { value: 437, format: "decimal", globalizeFormat: "d0" },
                { value: 437, format: { type: "decimal" }, expected: "437" },
                { value: 437, format: { type: "decimal", precision: 5 }, expected: "00437" },
                { value: 2, format: { type: "decimal", precision: 2 }, expected: "02" },
                { value: 12, format: { type: "decimal", precision: 2 }, expected: "12" },
                { value: 2, format: { type: "decimal", precision: 3 }, expected: "002" },
                { value: 12, format: { type: "decimal", precision: 3 }, expected: "012" },
                { value: 123, format: { type: "decimal", precision: 3 }, expected: "123" },

                { value: 12.345, format: "fixedPoint", expected: "12" },
                { value: 12.345, format: { type: "fixedPoint" }, expected: "12" },
                { value: 12.345, format: { type: "fixedPoint", precision: 1 }, globalizeFormat: "n1" },
                { value: 12.345, format: { type: "fixedPoint", precision: 2 }, globalizeFormat: "n2" },
                { value: 12.345, format: { type: "fixedPoint", precision: 3 }, globalizeFormat: "n3" },

                { value: 0.45, format: "percent", globalizeFormat: "p0" },
                { value: 0.45, format: { type: "percent" }, globalizeFormat: "p0" },
                { value: 0.45, format: { type: "percent", precision: 2 }, globalizeFormat: "p2" },
                
                { value: 1204, format: "currency", globalizeFormat: "c0" },
                { value: 12, format: { type: "currency" }, globalizeFormat: "c0" },
                { value: 1, format: { type: "currency", precision: 2 }, globalizeFormat: "c2" },
                { value: 1, format: { type: "currency", precision: 3 }, globalizeFormat: "c3" },
                { value: 1, format: { type: "currency", precision: 2, currency: "USD" }, globalizeFormat: "c2" },
                { value: -1204, format: { type: "currency", precision: 2 }, globalizeFormat: "c2" },

                { value: 12345.67, format: { type: "currency largeNumber", precision: 2 }, expected: Globalize.format(12.34567, "c2") + "K" },
                { value: 12345.67, format: { type: "currency thousands", precision: 2 }, expected: Globalize.format(12.34567, "c2") + "K" },
                { value: 12345.67, format: { type: "currency millions", precision: 3 }, expected: Globalize.format(0.012, "c3") + "M" }
            ];
            $.each(assertData, function(_, data) {
                var expected = data.expected
                if(data.globalizeFormat) {
                    expected = Globalize.format(data.value, data.globalizeFormat);
                    assert.equal(numberLocalization.format(data.value, data.globalizeFormat), expected);
                }
                assert.equal(numberLocalization.format(data.value, data.format), expected);
            });
        });

        QUnit.test("parse", function (assert) {
            assert.equal(numberLocalization.parse(Globalize.format(437, "d0")), 437);
            assert.equal(numberLocalization.parse(Globalize.format(1.2, "n1")), 1.2);
            assert.equal(numberLocalization.parse(Globalize.format(12000, "d0")), 12000);

            assert.equal(numberLocalization.parse(Globalize.format(1.2, "c1")), 1.2);
        });

        QUnit.test("format by a function", function(assert) {
            assert.equal(numberLocalization.format(437, function(value) { return "!" + value; }), "!437");
            assert.equal(numberLocalization.format(437, { formatter: function(value) { return "!" + value; } }), "!437");
        });

        QUnit.test("parse by a function", function(assert) {
            assert.equal(numberLocalization.parse("!437", { parser: function(text) { return Number(text.substr(1)); } }), 437);
        });
        
        QUnit.test("getOpenXmlCurrencyFormat", function(assert) {
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat(), "$#,##0{0}_);\\($#,##0{0}\\)");
        });
    });
}(QUnit, jQuery, DevExpress, Globalize));
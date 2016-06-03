(function (QUnit, $, DX, Globalize) {
    var dateLocalization = DX.localization.date;

    
    $.each([ "de", "en", "ja", "ru" ], function(_, culture) {
        QUnit.module("date - " + culture, {
            beforeEach: function() {
                Globalize.culture(culture);
            },
            afterEach: function() {
                Globalize.culture("en");
            }
        }); 
        
        QUnit.test("getPatternByFormat", function(assert) {
            var expectedValues = {
                longdate: Globalize.findClosestCulture().calendar.patterns["D"],
                longtime: Globalize.findClosestCulture().calendar.patterns["T"],
                monthandday: Globalize.findClosestCulture().calendar.patterns["M"],
                monthandyear: Globalize.findClosestCulture().calendar.patterns["Y"],
                shortdate: Globalize.findClosestCulture().calendar.patterns["d"],
                shorttime: Globalize.findClosestCulture().calendar.patterns["t"],

                second: "ss",
                minute: "mm",
                hour: "HH",
                millisecond: "fff",
                day: "dd",
                dayofweek: "dddd",
                month: "MMMM",
                year: "yyyy",
                shortyear: "yy",

                "datetime-local": "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                "yyyyMM": undefined
            };

            $.extend(expectedValues, {
                longdatelongtime: expectedValues.longdate + " " + expectedValues.longtime,
                shortdateshorttime: expectedValues.shortdate + " " + expectedValues.shorttime,
                mediumdatemediumtime: expectedValues.monthandday + " " + expectedValues.shorttime
            });

            $.each(expectedValues, function(format, expectedValue) {
                assert.equal(dateLocalization.getPatternByFormat(format), expectedValue, format + " format");
            });
        });
        
        QUnit.test("getMonthNames", function(assert) {
            var months = Globalize.culture().calendar.months.names.slice(0, -1);
            
            assert.deepEqual(dateLocalization.getMonthNames(), months, "Array of month names without format");
            assert.deepEqual(dateLocalization.getMonthNames("wide"), months, "Array of month names (wide format)");
            assert.deepEqual(dateLocalization.getMonthNames("abbreviated"),
                Globalize.culture().calendar.months.namesAbbr.slice(0, -1),
                "Array of month names (abbreviated format)");
            assert.deepEqual(dateLocalization.getMonthNames("narrow"),
                Globalize.culture().calendar.months.namesAbbr.slice(0, -1).map(function(month) { return month.substr(0, 1); }),
                "Array of month names (narrow format)");
        });
        
        QUnit.test("getDayNames", function(assert) {
            assert.deepEqual(dateLocalization.getDayNames(),
                Globalize.culture().calendar.days.names,
                "Array of day names without format");
            assert.deepEqual(dateLocalization.getDayNames("wide"),
                Globalize.culture().calendar.days.names,
                "Array of day names (wide format)");
            assert.deepEqual(dateLocalization.getDayNames("abbreviated"),
                Globalize.culture().calendar.days.namesAbbr,
                "Array of day names (abbreviated format)");
            assert.deepEqual(dateLocalization.getDayNames("short"),
                Globalize.culture().calendar.days.namesShort,
                "Array of day names (short format)");
            assert.deepEqual(dateLocalization.getDayNames("narrow"),
                Globalize.culture().calendar.days.namesAbbr.map(function(day) { return day.substr(0, 1); }),
                "Array of day names (narrow format)");
        });
        
        QUnit.test("getTimeSeparator", function(assert) {
            assert.equal(dateLocalization.getTimeSeparator(), ":");
        });
        
        QUnit.test("firstDayOfWeekIndex", function(assert) {
            assert.equal(dateLocalization.firstDayOfWeekIndex(), Globalize.culture().calendar.firstDay);
        });
        
        
        QUnit.test("format", function(assert) {
            var formats = [ "day", "dayofweek", "hour", "longdate", "longdatelongtime", "longtime", "millisecond", "minute", "month", "monthandday", "monthandyear", "shortdate", "shortdateshorttime", "shorttime", "shortyear", "year", "datetime-local", "yyyy MMMM d", "ss fff", "ddd" ];
            
            var quarterData =  [
                {
                    date: new Date(2015, 0),
                    expected: "Q1"
                },
                {
                    date: new Date(2015, 1),
                    expected: "Q1"
                },
                {
                    date: new Date(2015, 2),
                    expected: "Q1"
                },
                {
                    date: new Date(2015, 3),
                    expected: "Q2"
                },
                {
                    date: new Date(2015, 4),
                    expected: "Q2"
                },
                {
                    date: new Date(2015, 5),
                    expected: "Q2"
                },
                {
                    date: new Date(2015, 6),
                    expected: "Q3"
                },
                {
                    date: new Date(2015, 7),
                    expected: "Q3"
                },
                {
                    date: new Date(2015, 8),
                    expected: "Q3"
                },
                {
                    date: new Date(2015, 9),
                    expected: "Q4"
                },
                {
                    date: new Date(2015, 10),
                    expected: "Q4"
                },
                {
                    date: new Date(2015, 11),
                    expected: "Q4"
                }
            ];
            var quarterandyearData = {
                date: new Date(2015, 2, 2, 3, 4, 5, 6),
                expected: "Q1 2015"
            };
            var testDate = new Date(2015, 2, 2, 3, 4, 5, 6);
            
            var testFormat = function(format, date, expected) {
                assert.equal(dateLocalization.format(date, format), expected, date + " in " + format + " format");
                assert.equal(dateLocalization.format(date, { type: format }), expected, date + " in " + format + " format (object syntax)");
            };
            
            $.each(formats, function(_, format) {
                var expected = Globalize.format(testDate, dateLocalization.getPatternByFormat(format) || format);
                testFormat(format, testDate, expected);
            });

            $.each(quarterData, function(_, data) {
                testFormat("quarter", data.date, data.expected);
            });
            
            testFormat("quarterandyear", quarterandyearData.date, quarterandyearData.expected);

            assert.equal(dateLocalization.format(new Date(2015, 2, 2, 3, 4, 5, 6)), String(new Date(2015, 2, 2, 3, 4, 5)), "without format");
            assert.notOk(dateLocalization.format(), "without date");
        });
        
        
        QUnit.test("parse", function(assert) {
            var date = new Date(),
                year = date.getFullYear(),
                month = 0,
                day = 1,
                hour = 0,
                assertData = {
                    day: {
                        expected: new Date(year, month, 2)
                    },
                    hour: {
                        expected: new Date(year, month, day, 3)
                    },
                    longdate: {
                        expected: new Date(2015, 2, 2)
                    },
                    longdatelongtime: [
                        {
                            expected: new Date(2015, 2, 2, 3, 4, 5)
                        },
                        {
                            expected: new Date(2015, 2, 2, 15, 4, 5)
                        }
                    ],
                    longtime: [
                        {
                            expected: new Date(year, month, day, 3, 4, 5)
                        },
                        {
                            expected: new Date(year, month, day, 15, 4, 5)
                        }
                    ],
                    minute: {
                        expected: new Date(year, month, day, hour, 4)
                    },
                    month: {
                        expected: new Date(year, 2, 1)
                    },
                    monthandday: {
                        expected: new Date(year, 2, 2)
                    },
                    monthandyear: {
                        expected: new Date(2015, 2, 1)
                    },
                    shortdate: {
                        expected: new Date(2015, 2, 2)
                    },
                    shortdateshorttime: {
                        expected: new Date(2015, 2, 2, 3, 4)
                    },
                    shorttime: {
                        expected: new Date(year, month, day, 3, 4)
                    },
                    shortyear: [
                        {
                            expected: new Date(2015, 0, 1)
                        },
                        {
                            expected: new Date(1986, 0, 1)
                        }
                    ],
                    year: {
                        expected: new Date(2015, 0, 1)
                    },

                    "datetime-local": {
                        expected: new Date(2015, 2, 2, 3, 4, 5)
                    },
                    "yyyy MMMM d": {
                        expected: new Date(2015, 2, 2)
                    },

                    "mediumdatemediumtime": [
                        {
                            expected: new Date(year, 2, 2, 3, 12, 0)
                        },
                        {
                            expected: new Date(year, 2, 2, 15, 12, 0)
                        },
                        {
                            expected: new Date(year, 2, 2, 0, 12, 0)
                        },
                        {
                            expected: new Date(year, 2, 2, 12, 12, 0)
                        }
                    ]
                };

            $.each(assertData, function(format, data) {
                data = $.makeArray(data);

                $.each(data, function(_, data) {
                    var text = dateLocalization.format(data.expected, format);
                    assert.equal(dateLocalization.parse(text, format), String(data.expected), format + " format");
                    assert.equal(dateLocalization.parse(text, { type: format }), String(data.expected), format + " format");
                });
            });

            assert.equal(dateLocalization.parse("550", "millisecond").getMilliseconds(), 550, "millisecond format");
            assert.equal(dateLocalization.parse("550", "fff").getMilliseconds(), 550, "millisecond format");

            assert.equal(dateLocalization.parse(dateLocalization.format(new Date(year, month, day), "shortdate")), String(new Date(year, month, day)), "without format");
            assert.notOk(dateLocalization.parse(), "without date");
        });
        
        QUnit.test("format/parse by a function", function (assert) {
            var format = {
                formatter: function (date) {
                    return "It was year " + date.getFullYear() + ".";
                },
                parser: function (text) {
                    return new Date(Number(text.substr(12, 4)), 1, 1);
                }
            };
            var someDate = new Date(1999, 1, 1);

            assert.equal(dateLocalization.format(someDate, format), "It was year 1999.");
            assert.equal(dateLocalization.parse("It was year 2000.", format).getFullYear(), 2000);
        });
    });
    
}(QUnit, jQuery, DevExpress, Globalize));
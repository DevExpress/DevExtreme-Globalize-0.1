(function ($, DX, Globalize) {
    var DateTimeFormat = {
        longdate: { shortcut: "D" },
        longtime: { shortcut: "T" },
        monthandday: { shortcut: "M" },
        monthandyear: { shortcut: "Y" },
        shortdate: { shortcut: "d" },
        shorttime: { shortcut: "t" },
        second: "ss",
        minute: "mm",
        hour: "HH",
        millisecond: "fff",
        day: "dd",
        dayofweek: "dddd",
        month: "MMMM",
        year: "yyyy",
        shortyear: "yy",
        longdatelongtime: { parts: [ "longdate", "longtime" ] },
        shortdateshorttime: { parts: [ "shortdate", "shorttime" ] },
        mediumdatemediumtime: { parts: [ "monthandday", "shorttime" ] },
        "datetime-local": "yyyy'-'MM'-'dd'T'HH':'mm':'ss"
    };
    
    DX.localization.date.resetInjection();
    DX.localization.date.inject({
        getPatternByFormat: function(format) {
            var that = this,
                globalizeFormat = DateTimeFormat[format.toLowerCase()];
            
            if(!globalizeFormat) {
                return;
            }
            
            if(globalizeFormat.shortcut) {
                return Globalize.findClosestCulture().calendar.patterns[globalizeFormat.shortcut];
            }
            
            if(globalizeFormat.parts) {
                return globalizeFormat.parts.map(function(part) {
                    return that.getPatternByFormat(part);
                }).join(" ");
            }
            
            return globalizeFormat;
        },
        
        getMonthNames: function(format) {
            var chooseFormat = {
                wide: function(months) { return months.names; },
                abbreviated: function(months) { return months.namesAbbr; },
                narrow: function(months) {
                    return months.namesAbbr.map(function(month) {
                        return month.substr(0, 1);
                    });
                }
            };
            
            return chooseFormat[format || "wide"](Globalize.culture().calendar.months).slice(0, -1);
        },
        
        getDayNames: function(format) {
            var chooseFormat = {
                wide: function(days) { return days.names; },
                abbreviated: function(days) { return days.namesAbbr; },
                short: function(days) { return days.namesShort; },
                narrow: function(days) {
                    return days.namesAbbr.map(function(day) {
                        return day.substr(0, 1);
                    });
                }
            };
            
            return chooseFormat[format || "wide"](Globalize.culture().calendar.days);
        },
        
        getTimeSeparator: function() {
            return Globalize.culture().calendar[":"];
        },
        
        firstDayOfWeekIndex: function() {
            return Globalize.culture().calendar.firstDay;
        },
        
        format: function(date, format) {
            if(!date) {
                return;
            }

            if(!format) {
                return date;
            }
            
            format = format.type || format;
            
            if(format.formatter || $.isFunction(format) || $.inArray(format.toLowerCase(), ["quarter", "quarterandyear"]) > -1) {
                return this.callBase.apply(this, arguments);
            }
            
            return Globalize.format(date, this.getPatternByFormat(format) || format);
        },
        
        parse: function(text, format) {
            format = format && format.type || format;
            
            if(!format) {
                return Globalize.parseDate(text);
            }
            
            if(format.parser || $.inArray(format.toLowerCase(), ["quarter", "quarterandyear"]) > -1) {
                return this.callBase.apply(this, arguments);
            }
            
            return Globalize.parseDate(text, this.getPatternByFormat(format) || format);
        }
    });
}(jQuery, DevExpress, Globalize));
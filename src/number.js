(function ($, DX, Globalize) {
    DX.localization.number.resetInjection();
    DX.localization.number.inject({
        _formatNumberCore: function (value, format, formatConfig) {
            if(format === 'exponential') {
                return this.callBase.apply(this, arguments);
            }

            return Globalize.format(value, this._normalizeFormatConfig(format, formatConfig));
        },
        _patternByFormat: function(format) {
            return {
                fixedpoint: "n",
                decimal: "d",
                percent: "p",
                currency: "c"
            }[format];
        },
        _normalizeFormatConfig: function (format, formatConfig, value) {
            return this._patternByFormat(format) + formatConfig.precision;
        },
        format: function (value, format) {
            if(typeof value !== "number") {
                return value;
            }
            
            var isGlobalizeFormat = /^(n|d|p|c)[0-9]{0,2}$/i.test(format);
            
            if(isGlobalizeFormat) {
                return Globalize.format(value, format);
            }
            
            format = this._normalizeFormat(format);

            return this.callBase.apply(this, arguments);
        },
        parse: function(text, format) {
            if(!text) {
                return;
            }
            
            if(format && format.parser) {
                return format.parser(text);
            }
            
            return Globalize.parseFloat(text);
        },
        getOpenXmlCurrencyFormat: function() {
            var currency = Globalize.cultures[Globalize.cultureSelector].numberFormat.currency,
                i,
                result,
                symbol,
                encodeSymbols;

            if($.type(currency.pattern) === 'array') {
                encodeSymbols = {
                    "n": "#,##0{0}",
                    "'": "\\'",
                    "\\(": "\\(",
                    "\\)": "\\)",
                    " ": "\\ ",
                    "\"": "&quot;",
                    "\\$": currency.symbol
                };

                result = currency.pattern.slice();
                for(symbol in encodeSymbols) {
                    if(encodeSymbols.hasOwnProperty(symbol)) {
                        for(i = 0; i < result.length; i++) {
                            result[i] = result[i].replace(new RegExp(symbol, "g"), encodeSymbols[symbol]);
                        }
                    }
                }

                return result.length === 2 ? result[1] + "_);" + result[0] : result[0];
            }
        }
    });
}(jQuery, DevExpress, Globalize));

(function ($, DX, Globalize) {
    var originalAddCultureInfo = Globalize.addCultureInfo,
        originalCulture = Globalize.culture;
    
    Globalize.addCultureInfo = function(culture, info) {
        var messages = {};
        
        messages[culture] = info.messages;
        
        DX.localization.message.load(messages);
    };
    
    Globalize.culture = function(culture) {
        return DX.localization.message.locale(culture);
    };
    
    DX.localization.message.resetInjection();
    DX.localization.message.inject({
        ctor: function() {
            this.load(this._dictionary);
        },
        
        locale: function(locale) {
            this.callBase.apply(this, arguments);
            return originalCulture.apply(Globalize, arguments);
        },
        
        load: function(info) {
            $.each(info, function(culture, messages) {
                originalAddCultureInfo.call(Globalize, culture, { messages: messages });
            });
            this.callBase.apply(this, arguments);
        },
        
        format: function(key, value) {
            if(this._messageLoaded(key, Globalize.cultureSelector)) {
                return this.callBase(key, value, Globalize.cultureSelector);
            }
            return this.callBase(key, value);
        },
        
        getFormatter: function(key) {
            if(this._messageLoaded(key, Globalize.cultureSelector)) {
                return this.callBase(key, Globalize.cultureSelector);
            }
            return this.callBase(key);
        }
    });
}(jQuery, DevExpress, Globalize));
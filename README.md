# DevExtreme integration with Globalize 0.1

Integrates [Globalize 0.1](https://github.com/jquery/globalize/tree/v0.1.1) with [DevExtreme 16.1](http://js.devexpress.com/)

DevExtreme 16.1 does not support Globalize 0.x out of the box anymore. There is an integration with a new Globalize 1 now. Read more in [DevExtreme documentation](http://js.devexpress.com/Documentation/Guide/Common/Migrate_to_the_New_Version/?version=16_1#Common_Migrate_to_the_New_Version_16_1_Version_Specifics_Globalize_1_X_Support)

But Globalize 1 has some breaking changes (see [Migrating from Globalize 0.x](https://github.com/jquery/globalize/blob/master/README.md#migrating-from-globalize-0x)) that need to be considered after upgrading the DevExtreme project from a previous version.

We recommend using this integration as a temporary solution to postpone updating the Globalize version in your project.
Some of the new features in DevExtreme 16.1 are [not supported](#fall-back) with current integration.

## Getting started

 * Update DevExtreme in your project to version 16.1 ([Migration guide](http://js.devexpress.com/Documentation/Guide/Common/Migrate_to_the_New_Version/?version=16_1)).
 * Copy the integration script from a `/dist` folder to your project.
 * Include the reference of the integration right after DevExtreme script:
```html
<script type="text/javascript" src="js/dx.all.js"></script>
<script type="text/javascript" src="js/dx.globalize-0.1.min.js"></script>
```

## Fall Back

The currency formatting in Globalize 0.1 uses the current culture to define the currency symbol. So, the following new DevExtreme features do not support Globalize 0.1.
 * The `currency` field of a `format` object (see [Object Structures](http://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/format/?version=16_1#currency))
 * The `defaultCurrency` field of a global configuration object (see [DevExpress.config](http://js.devexpress.com/Documentation/ApiReference/Common/utils/?version=16_1#config))

## Development

### Install development external dependencies

    npm install
    
### Tests
Tests can be run either in the PhantmJS:

    npm run test

or in the Google Chrome browser:

    npm run test:chrome
    
### Build

Build the distribution files `dx.globalize-0.1.js` and `dx.globalize-0.1.min.js` into the `/dist` folder.

    npm run build

## License

Familiarize yourself with the
[DevExtreme Commerical License](https://www.devexpress.com/Support/EULAs/DevExtreme.xml).  

**DevExtreme integration with Globalize 0.x is released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

## Support & Feedback

* For the Support & Feedback on general Globalize questions, use the [Globalize GitHub issue tracker](https://github.com/jquery/globalize/issues)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
* For DevExtreme Globalize 0.1 integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/DevExtreme-Globalize-0.1/issues)

# Apex Javadoc

[![Version](http://vsmarketplacebadge.apphb.com/version/btamburrino.apex-javadoc.svg)](https://marketplace.visualstudio.com/items?itemName=btamburrino.apex-javadoc)
[![Installs](http://vsmarketplacebadge.apphb.com/installs/btamburrino.apex-javadoc.svg)](https://marketplace.visualstudio.com/items?itemName=btamburrino.apex-javadoc)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/btamburrino.apex-javadoc.svg)](https://vsmarketplacebadge.apphb.com/rating/btamburrino.apex-javadoc.svg)

Stubs a Javadoc Comment for a Salesforce Apex method based on the parameters.

Works best with [ForceCode](https://github.com/celador/ForceCode)

## Documentation

There are three ways to create a comment on an Apex method:
* On the line above the method signature, start typing `/**` and then hit tab
* While on the line that has the method signature, open the command bar and choose `Force: Stub Apex Javadoc Comment`
* Right click on the line with your method signature, and choose `Force: Stub Apex Javadoc Comment`
  * This requires you to have `force.showApexJavadocContext` set to `true` in your User Settings. This is `false` by default to not clutter up your context menu unless you want it to.

## Known Issues

* You'll find them, I'm sure. Report them [here](https://github.com/btamburrino/VSCode-Apex-Javadoc/issues).

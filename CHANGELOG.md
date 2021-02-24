# Change Log

## 1.2.1
- Fixed two embarrasing bugs regarding class definitions and @ annotations (such as `@AuraEnabled`) being broken by 1.2.0. Please accept my humble apologies.

## 1.2.0
- Adds the `@description` tag as specified by new ApexDoc standards by default - however this can be disabled in settings
- Adds the `@author` tag and allows a default value to be set - however this is disabled by default
- Allows the variable definition to span multiple lines

## 1.1.1
- Disabled the second `*/` on class definitions if that setting is false
- Adds class definitions to the right-click context action, however they are not whitespaced with the class definition like if using the snippet feature

## 1.1.0
- Added new option to disable the second `*/` that shows up in some VSCode installations

## 1.0.3
- Method annotations parse correctly above @ declarations (such as @AuraEnabled and @RemoteAction)

## 1.0.2
- Fixed intellisense to only show when `/**` typed

## 1.0.1
- Cleaned up codebase, added some tests

## 1.0.0
- Initial release
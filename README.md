# es7-checktypes-decorator
**v0.1.7**

A simple es7 decorator to control your class and methods arguments types or instances.
If the decorator detects an anomaly, it will throw a `TypeError` with a message showing the wrong argument.

### Installation

Configure babel to use decorators:

`npm i --save-dev babel-transform-decorators-legacy` and add `"plugins": ["transform-decorators-legacy"]` in your .babelrc.

then: `npm i --save-dev es7-checktypes-decorator`

### Usage

First, require the decorator:
````js
import { checktypes } from 'es7-checktypes-decorator';
````

The decorator will control if your arguments have the good type and / or are an instance of a Class.

You have simply to call the decorator before a method or a class. Like that:

````js
@checktypes('Number', CustomClass)
// This class expects to receive arg1 as Number (typeof) and arg2 as CustomClass instance (instanceof).
class Class_expecting_Number_type_and_CustomClass_instance {
    constructor(arg1, arg2) {}

    @checktypes('String', 'Number')
    method_expecting_String_type_and_Number_type(arg1, arg2) {}

    @checktypes(Array, Date, CustomClass)
    method_expecting_Array_and_Date_and_CustomClass_instances(arg1, arg2, arg3) {}  

    @checktypes(['String', CustomClass], ['Number', 'String'])
    // This method expects to receive arg1 as String or CustomClass instance
    // and arg2 as Number or String.
    method_expecting_String_type_or_CustomClass_and_Number_type_or_String_type(arg1, arg2) {}
}

````

If the validation is ok, your class or your methods will be executed as always.

If the validation is wrong, the decorator will throw a `TypeError` with a custom message.

var Parser = {
    JsonToHtml: {
        number: function(htmlElement, element) {
            htmlElement.append($("<input type='number'>").val(element));
            return htmlElement;

        },
        string: function(htmlElement, element) {
            htmlElement.append($("<input type='text'>").val(element));
            return htmlElement;

        },
        boolean: function(htmlElement, element) {
            htmlElement.append($("<input type='checkbox'>").prop("checked", element));
            return htmlElement;

        },
        object: function(htmlElement, element) {
            if (element instanceof Array) {
                //maby to do something
            }
            htmlElement.find("span").addClass("block_name");
            htmlElement.addClass("block");
            Parser.htmlify(element, htmlElement);
            return htmlElement;

        }
    },
    HtmlToJson: {
        number: function($input) {
            return parseFloat($input.val());
        },
        text: function($input) {
            return $input.val();
        },
        checkbox: function($input) {
            return $input.prop("checked")

        },
        data: function($input) {
            return Parser.htmlParse($input);
        }
    },
    htmlParse: function($place) {
        var out = {};
        var children = $place.children();
        for (let i = 0; i < children.length; i++) {
            var $htmlElement = $(children[i]);
            if ($htmlElement.is("div")) {
                var propName = $htmlElement.find("span").first().text();
                var $propData = $htmlElement.find("input");
                var propType = $propData.attr("type");
                if ($propData.size() > 1) {
                    propType = "data";
                    $propData = $htmlElement;
                }
                var fromHtmlExtractor = Parser.HtmlToJson[propType];
                out[propName] = fromHtmlExtractor($propData);
            }
        }
        return out;
    },
    htmlify: function(object, $place) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                var element = object[key];
                var type = typeof element;
                var htmlElement = $("<div>").addClass("");
                htmlElement.append($("<span>").text(key));
                var parseFunction = Parser.JsonToHtml[type];
                if (parseFunction == undefined)
                    throw new Error("No Parser for Type: " + type);
                htmlElement = parseFunction(htmlElement, element);
                $place.append(htmlElement);
            }
        }
    }
}
const fillWithAttributes = (object: any, node: Element) => {
    if (node.attributes.length > 0) {
        object['attributes'] = {};
    }
    for (let i = 0; i < node.attributes.length; i++) {
        object['attributes'][node.attributes.item(i)!.nodeName.toLowerCase()] = node.attributes.item(i)!.nodeValue;
    }
};

export const parseToJson = (xml: Node, carry: { [index: string]: any } = {}): { [index: string]: any } => {
    xml.childNodes.forEach(node => {
        if (node instanceof Element) {
            const tagName = node.tagName.toLowerCase();
            if (!carry['children']) {
                carry['children'] = {};
            }
            const children = carry['children'];
            if (children[tagName]) {
                if (children[tagName] instanceof Array) {
                    children[tagName].push({});
                    fillWithAttributes(children[tagName][children[tagName].length - 1], node);
                    parseToJson(node, children[tagName][children[tagName].length - 1]);
                } else {
                    children[tagName] = [children[tagName], {}];
                    fillWithAttributes(children[tagName][1], node);
                    parseToJson(node, children[tagName][1]);
                }
            } else {
                children[tagName] = {};
                fillWithAttributes(children[tagName], node);
                parseToJson(node, children[tagName]);
            }
        } else if (node.nodeType === node.TEXT_NODE) {
            carry['text'] = node.nodeValue;
        }
    });

    return carry.children;
};
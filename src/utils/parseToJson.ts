const fillWithAttributes = (object: any, node: Element) => {
    if (node.attributes.length > 0) {
        object['attributes'] = {};
    }
    for (let i = 0; i < node.attributes.length; i++) {
        object['attributes'][node.attributes.item(i)!.nodeName] = node.attributes.item(i)!.nodeValue;
    }
};

export const parseToJson = (xml: Node, carry: { [index: string]: any } = {}): { [index: string]: any } => {
    xml.childNodes.forEach(node => {
        if (node instanceof Element) {
            const tagName = node.tagName;
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
        } else if (node.nodeType === node.TEXT_NODE || node.nodeType === node.CDATA_SECTION_NODE) {
            if (!/^\s*$/.test(node.nodeValue as string)) {
                if (!carry['text']) {
                    carry['text'] = node.nodeValue;
                } else {
                    carry['text'] += node.nodeValue;
                }
            }
        }
    });

    return carry.children;
};
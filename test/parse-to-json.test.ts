import { parseToJson } from '../src/utils/parseToJson';

const simpleStructure = document.createElement('div');
simpleStructure.innerHTML = `<span>one</span><span>two</span><span>three</span>`;

const attributeStructure = document.createElement('div');
attributeStructure.innerHTML = `<span id='info' name='info'></span><span id='info'>two</span><span>three</span>`;

const complexStructure = document.createElement('div');
complexStructure.appendChild(simpleStructure);
const complexChild = document.createElement('p');
complexChild.appendChild(attributeStructure);
complexStructure.appendChild(complexChild);


describe("Can send and parse basic rss api results", () => {
    test("Can parse basic html structure", () => {
        expect(parseToJson(simpleStructure)).toEqual({
            SPAN: [
                { text: 'one' },
                { text: 'two' },
                { text: 'three' },
            ]
        });
    });
    test("Can parse basic html structure with attributes", () => {
        expect(parseToJson(attributeStructure)).toEqual({
            SPAN: [
                { attributes: { id: 'info', name: 'info' } },
                { attributes: { id: 'info' }, text: 'two' },
                { text: 'three' },
            ]
        });
    });
    test("Can parse more complex html structure", () => {
        expect(parseToJson(complexStructure)).toEqual({
            DIV: {
                children: {
                    SPAN: [
                        { text: 'one' },
                        { text: 'two' },
                        { text: 'three' },
                    ],
                }
            },
            P: {
                children: {
                    DIV: {
                        children: {
                            SPAN: [
                                { attributes: { id: 'info', name: 'info' } },
                                { attributes: { id: 'info' }, text: 'two' },
                                { text: 'three' },
                            ]
                        }
                    }
                }
            }
        });
    });
});
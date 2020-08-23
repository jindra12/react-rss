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
            span: [
                { text: 'one' },
                { text: 'two' },
                { text: 'three' },
            ]
        });
    });
    test("Can parse basic html structure with attributes", () => {
        expect(parseToJson(attributeStructure)).toEqual({
            span: [
                { attributes: { id: 'info', name: 'info' } },
                { attributes: { id: 'info' }, text: 'two' },
                { text: 'three' },
            ]
        });
    });
    test("Can parse more complex html structure", () => {
        expect(parseToJson(complexStructure)).toEqual({
            div: {
                children: {
                    span: [
                        { text: 'one' },
                        { text: 'two' },
                        { text: 'three' },
                    ],
                }
            },
            p: {
                children: {
                    div: {
                        children: {
                            span: [
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
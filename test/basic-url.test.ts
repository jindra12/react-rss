import { apiResults } from "./apiResults";
import { getRss } from "../src/utils/getRss";
import match, { Any } from 'matchto';

global.fetch = jest.fn((url: string) => {
    if (apiResults[url]) {
        return Promise.resolve({
            status: 200,
            text: () => Promise.resolve(apiResults[url]),
        }) as any;
    }
    return Promise.resolve({
        status: 400,
        text: () => Promise.resolve({ message: "Bad request" }),
    }) as any
}) as any;

describe("Can send and parse basic rss api results", () => {
    test("http://static.userland.com/gems/backend/rssTwoExample2.xml", async () => {
        const result = await getRss(
            { input: "http://static.userland.com/gems/backend/rssTwoExample2.xml" },
            global.fetch,
            (rss, header) => {
                const newProperty = rss.newProperty?.text;
                return {
                    ...header,
                    newProperty,
                };
            },
            (rssItem, item) => {
                const newProperty = rssItem.newProperty?.text;
                return {
                    newProperty,
                    ...item,
                }
            }
        );
        expect(match(result).to({
            header: {
                copyright: 'Copyright 1997-2002 Dave Winer',
                link: 'http://www.scripting.com/',
                webMaster: 'dave@userland.com',
                ttl: '40',
                managingEditor: 'dave@userland.com',
                newProperty: 'New message!',
            },
            items: [
                {
                    title: '',
                    newProperty: 'Wowie!',
                    description: `"rssflowersalignright"With any luck we should have one or two more days of namespaces stuff here on Scripting News. It feels like it's winding down. Later in the week I'm going to a <a href="http://harvardbusinessonline.hbsp.harvard.edu/b02/en/conferences/conf_detail.jhtml?id=s775stg&pid=144XCF">conference</a> put on by the Harvard Business School. So that should change the topic a bit. The following week I'm off to Colorado for the <a href="http://www.digitalidworld.com/conference/2002/index.php">Digital ID World</a> conference. We had to go through namespaces, and it turns out that weblogs are a great way to work around mail lists that are clogged with <a href="http://www.userland.com/whatIsStopEnergy">stop energy</a>. I think we solved the problem, have reached a consensus, and will be ready to move forward shortly.`,
                },
                {
                    pubDate: 'Sun, 29 Sep 2002 19:59:01 GMT',
                }
            ],
        }, true).to(Any, (item) => console.log(item)).solve()).toBe(true);
    });
});
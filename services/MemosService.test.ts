import { MemoService } from "./MemoService";
import Knex from "knex";

const knexConfig = require("../knexfile");
const knex = Knex(knexConfig["test"]);

describe("Memo Service", () => {
    let memoService: MemoService;
    let memosId: number[];

    beforeEach(async () => {
        memoService = new MemoService(knex);
        memosId = (await knex.insert([
            {
                content: "Test Content 1",
                image: "abc.jpg"
            },
            {
                content: "Test Content Number Two"
            }
        ]).into("memos").returning("id")).map(each => each.id);
    })

    it('should get Memo from DB', async () => {
        const memos = (await memoService.getMemos()).filter(each => memosId.includes(each.id));

        expect(memos).toEqual(expect.arrayContaining(
            [
                expect.objectContaining(
                    {
                        content: "Test Content 1",
                        image: "abc.jpg"
                    }
                )
            ]
        ));
        expect(memos).toEqual(expect.arrayContaining(
            [
                expect.objectContaining(
                    {
                        content: "Test Content Number Two"
                    }
                )
            ]
        ));
    });

    it('should post Memo to DB for only once', async () => {
        const originalMemosList = await knex.select("*").from("memos");
        const newMemosList = await memoService.postMemos("Post Test", "post.jpg");
        const insertedMemo = newMemosList?.at(-1);

        expect(newMemosList?.length).toBe(originalMemosList.length + 1);
        expect(insertedMemo).toMatchObject({
            content: "Post Test",
            image: "post.jpg"
        });
    });

    it('should update Memo in DB', async () => {
        await memoService.updateMemos("Updated Content", memosId[0]);
        const updateMemo = await knex.select("*").from("memos").where("id", memosId[0]);

        expect(updateMemo.length).toBe(1);
        expect(updateMemo).toMatchObject([{ content: "Updated Content" }]);
    });

    it('should delete Memo in DB', async () => {
        await memoService.deleteMemos(memosId[1]);
        const deletedMemo = await knex.select("*").from("memos").where("id", memosId[1]);

        expect(deletedMemo.length).toBe(0);
    });

    afterEach(async () => {
        await knex("memos").whereIn("id", memosId).del();
    })

    afterAll(async () => {
        await knex.destroy();
    })
})
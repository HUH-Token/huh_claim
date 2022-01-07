describe("TestOne", () => {
    it("TestOneIt", async ()=> {
        const lockId = 0;
        const locks = []
        const myLockId = locks.filter(lock => lock === lockId);
        expect(myLockId).toStrictEqual([])
    })
})
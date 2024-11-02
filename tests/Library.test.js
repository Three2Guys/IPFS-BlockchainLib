const Library = artifacts.require("Library");

contract("Library", (accounts) => {
    let library;

    before(async () => {
        library = await Library.new();
    });

    it("should add a book", async () => {
        await library.addBook("The Great Gatsby", "F. Scott Fitzgerald", "Qm...CID");
        const book = await library.getBook(1);
        assert.equal(book[0], "The Great Gatsby", "Title does not match");
        assert.equal(book[1], "F. Scott Fitzgerald", "Author does not match");
    });
});

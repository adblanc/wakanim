const wakanim = require("../../index");

describe("calendar", () => {
  it("should return a calendar array with 7 day objects", async () => {
    const calendar = await wakanim.getCalendar(
      "04-11-2019",
      "10-11-2019",
      false
    );
    calendar.forEach(day => {
      expect(day).toHaveProperty("date");
      expect(day).toHaveProperty("episodes");
    });
    expect(calendar.length).toBe(7);
  });
});

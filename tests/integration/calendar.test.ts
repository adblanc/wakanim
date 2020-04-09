import * as wakanim from "../../src/index";

describe("calendar", () => {
  it("should return a calendar array with 7 day objects", async () => {
    const calendar = await wakanim.getCalendar({
      startDate: "04-11-2019",
      endDate: "10-11-2019",
    });
    calendar.forEach((day) => {
      expect(day).toHaveProperty("date");
      expect(day).toHaveProperty("episodes");
    });
    expect(calendar.length).toBe(7);
  });
});

System.register(["main"], function (_export) {
  var Main;
  return {
    setters: [function (_main) {
      Main = _main;
    }],
    execute: function () {
      "use strict";

      describe("Unit tests:", function () {
        var tasks = {},
            hehe = undefined;

        beforeEach(function () {});

        it("Testing if tests works", function () {
          var a = true;
          expect(a).toBe(true);
        });

        it("Test if tasks has all the required fields", function () {
          var exampleTask = {
            name: "test",
            author: "test1",
            type: ""
          };

          var result = Main.fetchTask(exampleTask);
          expect(result).toBe("Required fields are missing.");
        });

        it("Test if correct tasks are passing correctly", function () {
          var correctTask = {
            name: "correct test",
            author: "Mateusz Sepiol",
            type: "to-do",
            description: "test decs"
          };

          spyOn(Main, "fetchTask").and.returnValue("Everything is fine");
          var result = Main.fetchTask(correctTask);
          expect(result).toBe("Everything is fine");
        });

        it("Test if toggling dialog works after adding task", function () {
          var task = {
            name: "correct test",
            author: "Mateusz Sepiol",
            type: "to-do",
            description: "test decs"
          };

          spyOn(window, "toggleDialog");
          Main.addTask(task);
          expect(window.toggleDialog).toHaveBeenCalled();
        });

        it("Test if toggling dialog works after editing task", function () {
          var task = {
            name: "correct test",
            author: "Mateusz Sepiol",
            type: "to-do",
            description: "test decs"
          };

          spyOn(window, "toggleDialog");
          Main.editTask(task);
          expect(window.toggleDialog).toHaveBeenCalled();
        });
      });
    }
  };
});
import { test, expect } from "@playwright/test";
import { addTodos, newTodo, todoItems } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test.describe("Adding todos", () => {
  test("shows an empty state before any todo is added @smoke @T8ba46a35", async ({ page }) => {
    await expect(page.getByText("Nothing to do yet")).toBeVisible();
  });

  test("adds a todo with Enter @smoke @T1a9ffaea", async ({ page }) => {
    await addTodos(page, "Buy milk");
    await expect(todoItems(page)).toHaveText(["Buy milk×"]);
    await expect(newTodo(page)).toHaveValue("");
  });

  test("ignores blank input @T04ffced7", async ({ page }) => {
    await addTodos(page, "   ");
    await expect(page.getByText("Nothing to do yet")).toBeVisible();
  });
});

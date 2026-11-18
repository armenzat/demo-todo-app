import { test, expect } from "@playwright/test";
import { addTodos, todoItems } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test.describe("Managing todos", () => {
  test("completing a todo updates the counter @smoke @T48dc3485", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await expect(page.getByTestId("remaining")).toHaveText("2 items left");
    await page.getByRole("checkbox").first().check();
    await expect(page.getByTestId("remaining")).toHaveText("1 item left");
  });

  test("deletes a todo @Tfa7a4713", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await page.getByRole("button", { name: "Delete Buy milk" }).click();
    await expect(todoItems(page)).toHaveText(["Walk the dog×"]);
  });

  test("filters active and completed todos @T5cef2a4f", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await page.getByRole("checkbox").first().check();

    await page.getByRole("navigation", { name: "Filter" }).getByRole("button", { name: "Active" }).click();
    await expect(todoItems(page)).toHaveText(["Walk the dog×"]);

    await page.getByRole("navigation", { name: "Filter" }).getByRole("button", { name: "Completed" }).click();
    await expect(todoItems(page)).toHaveText(["Buy milk×"]);
  });

  test("clears completed todos @Tc0619267", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(todoItems(page)).toHaveText(["Walk the dog×"]);
  });

  test("keeps todos after a reload @smoke @Te8e88a07", async ({ page }) => {
    await addTodos(page, "Buy milk");
    await page.reload();
    await expect(todoItems(page)).toHaveText(["Buy milk×"]);
  });
});

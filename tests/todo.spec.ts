import { test, expect, type Page } from "@playwright/test";

const newTodo = (page: Page) => page.getByRole("textbox", { name: "New todo" });
const todoItems = (page: Page) => page.getByRole("list", { name: "Todos" }).getByRole("listitem");

async function addTodos(page: Page, ...titles: string[]) {
  for (const title of titles) {
    await newTodo(page).fill(title);
    await newTodo(page).press("Enter");
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test.describe("Adding todos", () => {
  test("shows an empty state before any todo is added @smoke", async ({ page }) => {
    await expect(page.getByText("Nothing to do yet")).toBeVisible();
  });

  test("adds a todo with Enter @smoke", async ({ page }) => {
    await addTodos(page, "Buy milk");
    await expect(todoItems(page)).toHaveText(["Buy milk×"]);
    await expect(newTodo(page)).toHaveValue("");
  });

  test("ignores blank input", async ({ page }) => {
    await addTodos(page, "   ");
    await expect(page.getByText("Nothing to do yet")).toBeVisible();
  });
});

test.describe("Managing todos", () => {
  test("completing a todo updates the counter @smoke", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await expect(page.getByTestId("remaining")).toHaveText("2 items left");
    await page.getByRole("checkbox").first().check();
    await expect(page.getByTestId("remaining")).toHaveText("1 item left");
  });

  test("deletes a todo", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await page.getByRole("button", { name: "Delete Buy milk" }).click();
    await expect(todoItems(page)).toHaveText(["Walk the dog×"]);
  });

  test("filters active and completed todos", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await page.getByRole("checkbox").first().check();

    await page.getByRole("navigation", { name: "Filter" }).getByRole("button", { name: "Active" }).click();
    await expect(todoItems(page)).toHaveText(["Walk the dog×"]);

    await page.getByRole("navigation", { name: "Filter" }).getByRole("button", { name: "Completed" }).click();
    await expect(todoItems(page)).toHaveText(["Buy milk×"]);
  });

  test("clears completed todos", async ({ page }) => {
    await addTodos(page, "Buy milk", "Walk the dog");
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(todoItems(page)).toHaveText(["Walk the dog×"]);
  });

  test("keeps todos after a reload @smoke", async ({ page }) => {
    await addTodos(page, "Buy milk");
    await page.reload();
    await expect(todoItems(page)).toHaveText(["Buy milk×"]);
  });
});

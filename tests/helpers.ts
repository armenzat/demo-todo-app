import type { Page } from "@playwright/test";

export const newTodo = (page: Page) => page.getByRole("textbox", { name: "New todo" });
export const todoItems = (page: Page) => page.getByRole("list", { name: "Todos" }).getByRole("listitem");

export async function addTodos(page: Page, ...titles: string[]) {
  for (const title of titles) {
    await newTodo(page).fill(title);
    await newTodo(page).press("Enter");
  }
}

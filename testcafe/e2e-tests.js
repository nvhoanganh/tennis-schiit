/* eslint-disable no-undef */
import { Selector, ClientFunction } from "testcafe";

fixture`Home page`.page`http://localhost:4200`;

const goBack = ClientFunction(function() {
  window.scrollBy(0, 150000);
});

test("show list of groups", async t => {
  // Test code
  const navbar = Selector(".active.navbar-brand");

  // title bar
  await t
    .resizeWindowToFitDevice("iphone8plus", {
      portraitOrientation: true
    })
    .expect(navbar.innerText)
    .contains("Tennis Score");

  // select group and go back
  await t.click(Selector(".group__link").withText("HSV - 0 DEGREE"));
  await t.click(".nav__back");
  // select HSV
  await t.click(Selector(".group__link").withText("HSV"));
  // select player
  await t.click(Selector(".player__name").withText("Hoang Anh"));
  // check stats
  await t.click(Selector(".css-17ohz9w").withText("Stats"));
  await t.click(Selector(".css-17ohz9w").withText("Results"));
  await t.click(Selector(".css-17ohz9w").withText("Overall"));

  // go back twice
  await t.click(".nav__back");
  await t.click(".nav__back");

  // show stats for groups
  await t.click(Selector(".css-zn31x").withText("Stats"));
  // open more menu
  await t.click(".nav__rightmore button");
  // dismiss the menu
  await t.click(".css-556rku");

  // select leaderboard tab
  await t.click(Selector(".css-zn31x").withText("Leaderboard"));
  // select more > view results
  await t.click(".header__rightmore button");
  await t.click(Selector("a").withText("View Results"));
  // view head 2 head
  await t.click(".resultcard .dropdown__button");
  await t.click(Selector("a").withText("View Head 2 Head"));
  // view other teams
  await t.click(".badge-light");
  // view details
  await t.click(".btn-primary");
  // go back to the results page
  await t.click(".nav__back");
  // view head 2 head
  await t.click(".header__rightmore button");
  await t.click(Selector("a").withText("Check Head 2 Head"));
  // selct first
  await t.click(Selector(".css-jwmyb8"));
  await t.click(Selector(".css-jwmyb8").nth(2));
  await t.click(Selector(".css-jwmyb8").nth(5));
  await t.click(Selector(".css-jwmyb8").nth(7));
  // view results
  await t.click(".btn-primary");
  await t.expect(Selector(".header__content").nth(1).innerText).contains("Results");

  await t.click(".nav__back");
});

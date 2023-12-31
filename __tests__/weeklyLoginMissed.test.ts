import { StateAccount } from "../src/service/store/state/state-account";
import { Store } from "../src/service/store";
import { test, expect } from "vitest"
import connectGmail from "./__fixtures__/connectGmail";
import connectRetailer from "./__fixtures__/connectRetailer";
import fiveReceipts from "./__fixtures__/fiveReceipts";
import mockCheckPayout from "./__mocks__/mockCheckPayout";

test("User misses a weekly login", () => {
  const store = new Store();
  const gmail = store.gmail as StateAccount;

  expect(connectGmail(gmail)).toBe("P100");

  const retailer = store.retailer as StateAccount;
  expect(connectRetailer(retailer)).toBe("P100");

  expect(fiveReceipts(store.receipt)).toBe(5);

  store.sync.add(new Date("09/05/2023"));
  store.sync.add(new Date("09/12/2023"));
  store.sync.add(new Date("09/24/2023"));
  store.sync.add(new Date("10/01/2023"));
  const count = store.sync.countWeeks(new Date("10/02/2023"));

  expect(count).toBeLessThan(4);

  expect(
    mockCheckPayout(
      count,
      store.receipt.count(),
      gmail.get().value,
      retailer.get().value
    )
  ).toBeFalsy();
});

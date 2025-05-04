import type { Account } from "@/types";
import { defineStore } from "pinia";

const writeToLocalStorage = (data: Account[]): void =>
  localStorage.setItem("accounts", JSON.stringify(data));

const readFromLocalStorage = (): Account[] | null =>
  JSON.parse(localStorage.getItem("accounts") ?? "null");

export const useAccountStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    loadStore() {
      const saved = readFromLocalStorage();
      if (saved) this.accounts = saved;
    },
    createAccount(data: Account) {
      this.accounts.push(data);
      writeToLocalStorage(this.accounts);
    },
    deleteAccount(id: number) {
      const index = this.accounts.findIndex((a) => a.id === id);
      if (index === -1)
        throw new Error(`Error deleting account with id: ${id}`);

      this.accounts.splice(index, 1);
      writeToLocalStorage(this.accounts);
    },
    updateAccount(data: Account, id: number) {
      const account = this.accounts.find((a) => a.id === id);
      if (!account) throw new Error(`Error updating account with id: ${id}`);

      Object.assign(account, data);
      writeToLocalStorage(this.accounts);
    },
  },
  getters: {},
});

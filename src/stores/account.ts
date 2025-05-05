import type { Account } from "@/types";
import { defineStore } from "pinia";

const getId = (): number => {
  const accounts = readFromLocalStorage();
  if (!accounts) return 0;

  const max = Math.max(...accounts.map((account) => account.id!));
  return max + 1;
};

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
      const id = getId();
      this.accounts.push({ ...data, id });
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

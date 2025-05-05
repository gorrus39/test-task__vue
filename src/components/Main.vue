<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { type Account } from "@/types";
import { ref } from "vue";
import FormAccount from "./FormAccount.vue";
import Flash from "./Flash.vue";

const store = useAccountStore();
store.loadStore();

const initAccount: Account = {
  id: null,
  type: "" as any,
  marks: [],
  login: "",
  password: "",
};

const newAccount = ref<Account | null>(null);
</script>

<template>
  <div class="w-full relative h-12 flex items-center justify-evenly">
    <u-button
      @click="newAccount = { ...initAccount }"
      :disabled="newAccount !== null"
      icon="i-ep:circle-plus-filled"
      class="cursor-pointer absolute left-0"
      label="Добавить запись"
    />
    <p class="text-xl font-bold w-max">Учётные записи</p>
  </div>

  <div class="flex flex-col gap-2">
    <hr />
    <Flash
      >Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель ;</Flash
    >
    <div class="flex gap-2 font-bold">
      <div class="w-50">Метки</div>
      <div class="w-50">Тип записи</div>
      <div class="w-24">Логин</div>
      <div>Пароль</div>
    </div>
    <hr />
    <FormAccount
      v-for="account in store.accounts"
      :account
      :key="account.id!"
    />

    <hr />

    <FormAccount
      v-if="newAccount !== null"
      :account="newAccount"
      @created="newAccount = null"
    />
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import {
  accountSchema,
  accountTypeVariants,
  type Account,
  type ErrorFields,
  type Marks,
} from "@/types";
import { onMounted, ref } from "vue";

const toast = useToast();
const { createAccount, updateAccount } = useAccountStore();

const props = defineProps<{
  account: Account;
}>();
const emit = defineEmits(["created"]);

const formState = ref<Account>({ ...props.account });
const errorFields = ref<ErrorFields>(new Set());

const trySubmit = async () => {
  if (!hasChanges()) return;

  const errors = validate();

  if (errors.size === 0) {
    try {
      const isEdit = typeof props.account.id === "number";
      if (isEdit) {
        updateAccount(formState.value, props.account.id!);
        toast.add({ title: "Запись успешно обновлена!" });
      } else {
        createAccount(formState.value);
        emit("created");
        toast.add({ title: "Запись успешно создана!" });
      }
    } catch (error) {
      toast.add({ title: error as string, color: "error" });
    }
  }
};

const validate = () => {
  const { error: zodError } = accountSchema.safeParse(formState.value);
  const errors: ErrorFields = new Set();

  if (zodError) {
    for (const { path } of zodError.issues) {
      errors.add(String(path[0]) as keyof Account);
    }
  }
  errorFields.value = errors;
  return errors;
};

const transformMarksToInput = (marks: Marks): string => {
  return marks.map((m) => m.text).join(" ; ");
};

const transformInputToMarks = (string: string): Marks => {
  return string.split(";").map((el) => ({ text: el.trim() }));
};

const mayUpdatePassword = (payload: "ldap" | "local") => {
  if (payload !== "ldap") return;
  if (formState.value === null) return;

  formState.value.password = null;
};

const hasChanges = () =>
  JSON.stringify(props.account) !== JSON.stringify(formState.value);

onMounted(() => validate());
</script>

<template>
  <form class="flex gap-1 items-center">
    <u-input
      :value="transformMarksToInput(formState.marks)"
      :class="{ 'ring-1 ring-red-500 rounded-md': errorFields.has('marks') }"
      @update:model-value="
        (val: string | number) => (formState.marks = transformInputToMarks(String(val)))
      "
      @blur="trySubmit"
    />

    <u-input
      v-model="formState.login"
      @blur="trySubmit"
      :class="{ 'ring-1 ring-red-500 rounded-md': errorFields.has('login') }"
    />

    <u-form-field
      name="type"
      :error="errorFields.has('type')"
      :ui="{ error: '', wrapper: '' }"
    >
      <u-select
        v-model="formState.type"
        @change="trySubmit"
        @update:model-value="mayUpdatePassword"
        :items="accountTypeVariants"
        :ui="{
          base: 'uppercase font-bold min-w-24 w-auto',
          item: 'uppercase font-bold',
        }"
      />
    </u-form-field>

    <u-input
      v-model="formState.password"
      v-if="formState.type === 'local'"
      class="flex-1"
      :class="{ 'ring-1 ring-red-500 rounded-md': errorFields.has('password') }"
      @blur="trySubmit"
    />

    <delete-action v-if="account.id" :account-id="account.id" />
  </form>
</template>

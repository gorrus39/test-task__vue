<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { ref } from "vue";

const props = defineProps<{
  accountId: number;
}>();

const { deleteAccount } = useAccountStore();
const show = ref(false);
const loading = ref(false);
const toast = useToast();

const handleDelete = () => {
  loading.value = true;
  try {
    deleteAccount(props.accountId);
    toast.add({ title: "Запись успешно удалена!" });
  } catch (error) {
    toast.add({ title: error as string, color: "error" });
  }
  show.value = false;
  loading.value = false;
};
</script>

<template>
  <u-modal :title="`Удалить учётную запись?`">
    <u-icon
      class="size-5 cursor-pointer hover:opacity-60 ms-auto"
      name="ic:baseline-delete-forever"
      @click="show = true"
    />
    <template #footer>
      <u-button
        :loading="loading"
        label="Удалить"
        color="error"
        @click="handleDelete"
      />
    </template>
  </u-modal>
</template>

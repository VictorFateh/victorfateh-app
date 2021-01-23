export interface VForm extends Vue {
  reset(): void;
  resetValidation(): void;
  validate(): boolean;
};

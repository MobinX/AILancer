export const projDesc = storage.defineItem<string>('local:projDesc', {
    defaultValue: '',
});
export const coverLetter = storage.defineItem<string>('local:coverLetter', {
    defaultValue: 'wait...',
});
export const generationState = storage.defineItem<"generating"| "generated" | "not-generating">('local:generationState', {
    defaultValue: 'not-generating',
});

export const watch = (key: string, callback: (newValue: any, oldValue: any) => void) => {
    browser.storage.onChanged.addListener((changes, namespace) => {
      for (let [storageKey, { oldValue, newValue }] of Object.entries(changes)) {
        if (storageKey === key) {
          callback(newValue, oldValue);
        }
      }
    });
  };
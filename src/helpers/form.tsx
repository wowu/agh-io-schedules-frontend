export function objectToFormData(values: any) {
  const form = new FormData();

  for (var key in values) {
    form.append(key, values[key]);
  }

  return form;
}

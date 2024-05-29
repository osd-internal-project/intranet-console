export const validatesUploadfileImage = (rule: any, value: string, callback: any) => {
  if (rule.length === 0) {
    callback("Please upload image");
  } else {
    callback();
  }
};

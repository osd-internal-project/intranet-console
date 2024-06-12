export const validatesUploadfileImage = (rule: any, value: string, callback: any) => {
  if (rule.length === 0) {
    callback("Please upload image");
  } else {
    callback();
  }
};

export const validateCheckData = (rule: any, value: string, callback: any) => {
  if (value !== null || value !== undefined || value !== "") {
    callback("Please Select Start Date");
  }
};

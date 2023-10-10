export default class FormErrors {
  static errorMessage(
    name: any,
    errors: any,
    touchedFields: any,
    isSubmitted: any,
    externalErrorMessage: any = null,
  ) {

    if (externalErrorMessage) {
      return externalErrorMessage;
    }

    if (!isSubmitted && !touchedFields[name]) {
      return null;
    }

    const fieldErrors = errors[name];
    return (
      fieldErrors?.[0]?.message ||
      fieldErrors?.message ||
      fieldErrors ||
      null
    );
  }
}

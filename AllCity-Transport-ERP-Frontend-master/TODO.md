# TODO: Fix Submit Button Highlighting for Vehicle Sale Form

## Steps to Complete

- [x] Add `isSubmitting: boolean = false;` property to SaleComponent class in sale.ts
- [x] In `onSubmit()` method, set `this.isSubmitting = true;` after form validation checks
- [x] In the subscribe `next` callback, set `this.isSubmitting = false;` before navigation
- [x] In the subscribe `error` callback, set `this.isSubmitting = false;`
- [x] Update the button's `[disabled]` attribute in sale.html to include `|| isSubmitting`
- [x] Update the button text in sale.html to show spinner and "Saving..." when `isSubmitting` is true
- [x] Test the form submission to ensure button disables during save and re-enables on completion

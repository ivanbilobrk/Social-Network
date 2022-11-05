export default function ErrorInput(count:boolean, validation:boolean, focus:boolean):boolean {
    if (count === false) return false;

    if (!focus) {
      return !validation;
    }
    return false;
  };

export {ErrorInput};
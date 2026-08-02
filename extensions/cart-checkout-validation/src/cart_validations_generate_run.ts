import type {
  CartValidationsGenerateRunInput,
  CartValidationsGenerateRunResult,
  ValidationError,
} from "../generated/api";

export function cartValidationsGenerateRun(input: CartValidationsGenerateRunInput): CartValidationsGenerateRunResult {
  console.log("input.shop.metaobject?.maxCount?.jsonValue", input.shop.metaobject?.maxCount?.jsonValue);
  const maxCount = Number(input.shop.metaobject?.maxCount?.jsonValue);

  if (isNaN(maxCount)) {
    return {operations: []};
  }

  const errors: ValidationError[] = [];


  input.cart.lines.find((line) => {
    if (line.quantity > maxCount) {
      errors.push({
        message: `Maximum quantity per line item is ${maxCount}`,
        target: "$.cart",
      });
      return true;
    }

    return false
  })


  return {
    operations: [{validationAdd: {errors}}]
  };
}

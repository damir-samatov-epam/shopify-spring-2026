#!/bin/bash
set -e

(
  cd "$(dirname "$(realpath "$0")")"

  echo "Starting bulk operation to export products and variants..."
  echo ""

  # Create CSV header
  touch products-variants.csv
  echo "product_handle,product_title,product_type,variant_sku,variant_name,variant_price" > products-variants.csv

  # The bulk operation with the--watch flag waits for completion and outputs the JSONL
  # Since variants always appear after their parent product, we can use a simple stateful approach
  # More on the Bulk Query JSONL format: https://shopify.dev/docs/api/usage/bulk-operations/queries#the-jsonl-data-format

  current_product_handle=""
  current_product_title=""
  current_product_type=""

  shopify app bulk execute --query-file gql/ExportProductsVariants.graphql --watch | while IFS= read -r line; do
    # Use a single jq call to determine type and extract all fields at once
    result=$(echo "$line" | jq -r 'if has("__parentId") | not then ["product", .handle, .title, .productType] | @tsv else "variant" end')

    if [[ $result != "variant" ]]; then
      # This is a product line - parse tab-separated values
      IFS=$'\t' read -r _ current_product_handle current_product_title current_product_type <<< "$result"
    else
      # This is a variant line - output with current product data
      echo "$line" | jq -r \
        --arg handle "$current_product_handle" \
        --arg title "$current_product_title" \
        --arg type "$current_product_type" \
        '[$handle, $title, $type, .sku, .displayName, .price] | @csv' \
        >> products-variants.csv
    fi
  done

  # Count rows (excluding header)
  ROW_COUNT=$(($(wc -l < products-variants.csv) - 1))

  echo ""
  echo "Export complete!"
  echo "Exported $ROW_COUNT product variants to products-variants.csv"
)

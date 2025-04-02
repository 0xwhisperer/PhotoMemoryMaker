import { ProductType, ProductSize, FilterType, PRODUCT_SIZES, formatPrice, calculateTotalPrice } from "@/lib/utils";

interface OrderSummaryProps {
  imageUrl: string;
  rotation: number;
  filter: FilterType;
  productType: ProductType;
  productSize: ProductSize;
  quantity: number;
  unitPrice: number;
}

export function OrderSummary({
  imageUrl,
  rotation,
  filter,
  productType,
  productSize,
  quantity,
  unitPrice,
}: OrderSummaryProps) {
  const { subtotal, shipping, tax, total } = calculateTotalPrice(
    unitPrice,
    quantity,
    true
  );

  return (
    <div className="card-dark shadow-lg overflow-hidden rounded-md sticky top-4">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-medium mb-4 text-gray-200">Order Summary</h2>
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 bg-gray-800 rounded-md w-16 h-16 overflow-hidden">
            <img
              src={imageUrl}
              alt="Product preview"
              className="w-full h-full object-cover"
              style={{ transform: `rotate(${rotation}deg)`, filter }}
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-200 capitalize">
              {`${productSize} ${productType}`}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {PRODUCT_SIZES[productType][productSize]}
            </p>
            <p className="mt-1 text-sm text-gray-400">{`Quantity: ${quantity}`}</p>
          </div>
          <div className="ml-4 text-sm font-medium text-gray-200">
            {formatPrice(subtotal)}
          </div>
        </div>

        <dl className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-400">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-200">
              {formatPrice(subtotal)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-400">Shipping</dt>
            <dd className="text-sm font-medium text-gray-200">
              {formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-400">Tax</dt>
            <dd className="text-sm font-medium text-gray-200">
              {formatPrice(tax)}
            </dd>
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-gray-800">
            <dt className="text-base font-medium text-gray-200">Order total</dt>
            <dd className="text-base font-medium text-gray-100">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

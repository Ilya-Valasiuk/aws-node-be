import { createSuccessResponse } from '../../utils/api-response';

import { CAR_PRODUCTS } from "../../mocks/products";

export const handler = async () => createSuccessResponse({ products: CAR_PRODUCTS });

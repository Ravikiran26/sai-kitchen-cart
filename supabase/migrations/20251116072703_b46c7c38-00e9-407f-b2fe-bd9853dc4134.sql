-- Add variants column to products table to support multiple sizes and prices
ALTER TABLE public.products 
ADD COLUMN variants JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the structure
COMMENT ON COLUMN public.products.variants IS 'Array of product variants with structure: [{label: string, weightGrams: number, price: number, mrp: number, stock: number}]';
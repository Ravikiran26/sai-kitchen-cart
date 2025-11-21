# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional


# -------- Variants --------
class ProductVariantBase(BaseModel):
    weight: str
    price: float


class ProductVariant(ProductVariantBase):
    id: int

    class Config:
        orm_mode = True


# -------- Products --------
class ProductBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    ingredients: Optional[str] = None
    shelf_life: Optional[str] = None


class ProductCreate(ProductBase):
    variants: List[ProductVariantBase]


class Product(ProductBase):
    id: int
    variants: List[ProductVariant]

    class Config:
        orm_mode = True


# -------- Orders --------
class OrderItemCreate(BaseModel):
    variant_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    payment_method: str          # e.g. "COD"
    items: List[OrderItemCreate]


class OrderItem(BaseModel):
    id: int
    variant_id: int
    quantity: int
    price: float

    class Config:
        orm_mode = True


class Order(BaseModel):
    id: int
    customer_name: str
    phone: str
    address: str
    payment_method: str
    items: List[OrderItem]

    class Config:
        orm_mode = True

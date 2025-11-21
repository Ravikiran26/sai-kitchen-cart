from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException
from srisaikitchen_api.auth import admin_required
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel 
from srisaikitchen_api.database import Base, engine, SessionLocal
from srisaikitchen_api import models, schemas
import os

# ❗ This will create tables in the existing MySQL DATABASE (srisaikitchen)
# Make sure the database exists first: CREATE DATABASE srisaikitchen;
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sri Sai Kitchen API")

# CORS configuration
# - In development you can set DEV_ALLOW_ALL_CORS=1 to allow all origins
# - Or set VITE_FRONTEND_ORIGINS to a comma-separated list of additional origins (e.g. http://localhost:8081)
DEV_ALLOW_ALL_CORS = os.getenv("DEV_ALLOW_ALL_CORS", "0") == "1"
extra_origins = os.getenv("VITE_FRONTEND_ORIGINS", "")

if DEV_ALLOW_ALL_CORS:
    allow_origins = ["*"]
else:
    default_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    extras = [o.strip() for o in extra_origins.split(",") if o.strip()]
    allow_origins = default_origins + extras

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- DB session dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Health check ----------
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Sri Sai Kitchen backend working"}


# ---------- 1) GET /products ----------
@app.get("/products", response_model=list[schemas.Product])
def list_products(db: Session = Depends(get_db)):
    """
    Returns all products with their variants (250g / 500g / 1kg etc.).
    """
    products = (
        db.query(models.Product)
        .options(joinedload(models.Product.variants))
        .all()
    )
    return products


# Optional: lookup product by slug (frontend convenience)
def _slugify(name: str) -> str:
    return (
        name.lower()
        .replace(" ", "-")
        .replace("/", "-")
        .replace("__", "-")
    )


@app.get("/products/slug/{slug}", response_model=schemas.Product)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """
    Attempts to find a product by a slug generated from the product name.
    Falls back to 404 if none found.
    """
    products = (
        db.query(models.Product)
        .options(joinedload(models.Product.variants))
        .all()
    )
    for p in products:
        if _slugify(p.name) == slug:
            return p
    raise HTTPException(status_code=404, detail="Product not found")


# ---------- 2) GET /products/{product_id} ----------
@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Returns a single product and its variants.
    """
    product = (
        db.query(models.Product)
        .options(joinedload(models.Product.variants))
        .filter(models.Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ---------- 3) POST /orders ----------
@app.post("/orders", response_model=schemas.Order)
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Creates an order with line items.
    Each item refers to a product_variant (weight/price).
    """
    # make sure all variants exist
    variant_ids = [item.variant_id for item in order_in.items]
    variants = (
        db.query(models.ProductVariant)
        .filter(models.ProductVariant.id.in_(variant_ids))
        .all()
    )
    variants_by_id = {v.id: v for v in variants}

    if len(variants_by_id) != len(variant_ids):
        raise HTTPException(status_code=400, detail="One or more variants not found")

    # create order
    db_order = models.Order(
        customer_name=order_in.customer_name,
        phone=order_in.phone,
        address=order_in.address,
        payment_method=order_in.payment_method,
    )
    db.add(db_order)
    db.flush()  # get order.id before creating items

    # create order items (snapshot price from variant)
    for item in order_in.items:
        variant = variants_by_id[item.variant_id]
        db_item = models.OrderItem(
            order_id=db_order.id,
            variant_id=variant.id,
            quantity=item.quantity,
            price=variant.price,
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)

    # reload with items relationship
    db_order = (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .filter(models.Order.id == db_order.id)
        .first()
    )

    return db_order
# =========================================================
# ADMIN APIS (for managing products / variants / orders)
# No authentication yet – only use from secure environment.
# =========================================================

# ------- Admin schemas (For udpate) ---------------
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    ingredients: Optional[str] = None   # ✅ allow updating ingredients
    shelf_life: Optional[str] = None    # ✅ allow updating shelf life

class VariantCreate(BaseModel):
    weight: str
    price: float


class VariantUpdate(BaseModel):
    weight: Optional[str] = None
    price: Optional[float] = None


# Create product with variants
#@app.post("/admin/products", response_model=schemas.Product, dependencies=[Depends(admin_required)])
@app.post("/admin/products", response_model=schemas.Product)
def admin_create_product(
    product_in: schemas.ProductCreate, db: Session = Depends(get_db)
):
    """
    Create a product with variants in one shot.
    {
      "name": "Mango Pickle",
      "category": "Pickles",
      "description": "...",
      "image_url": null,
      "variants": [
        {"weight": "250g", "price": 125},
        {"weight": "500g", "price": 250},
        {"weight": "1kg", "price": 500}
      ]
    }
    """
    db_product = models.Product(
        name=product_in.name,
        category=product_in.category,
        description=product_in.description,
        image_url=product_in.image_url,
        ingredients=product_in.ingredients,      # 👈 add
        shelf_life=product_in.shelf_life,    
    )
    db.add(db_product)
    db.flush()  # to get db_product.id

    for v in product_in.variants:
        db_variant = models.ProductVariant(
            product_id=db_product.id,
            weight=v.weight,
            price=v.price,
        )
        db.add(db_variant)

    db.commit()
    db.refresh(db_product)

    # reload with variants
    db_product = (
        db.query(models.Product)
        .options(joinedload(models.Product.variants))
        .filter(models.Product.id == db_product.id)
        .first()
    )
    return db_product

# Update basic product fields

#@app.patch("/admin/products/{product_id}", response_model = schemas.Product, dependencies=[Depends(admin_required)])
@app.patch("/admin/products/{product_id}", response_model = schemas.Product)
def admin_update_product(
    product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)
):
    db_product = (
        db.query(models.Product).filter(models.Product.id == product_id).first()
    )
    if not db_product:
        raise HTTPException(status_code = 404, detail = "Product not found")
    

    data = product_in.dict(exclude_unset = True)
    for field, value in data.items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)

    #reload with variants
    db_product = (
        db.query(models.Product)
        .options(joinedload(models.Product.variants))
        .filter(models.Product.id == product_id)
        .first()
    )
    return db_product


#Add a variant(e.g., new weight/price)
# @app.post(
#     "/admin/products/{product_id}/variants",
#     response_model = schemas.ProductVariant,
#     dependencies=[Depends(admin_required)],
# )
@app.post(
    "/admin/products/{product_id}/variants",
    response_model = schemas.ProductVariant)
def admin_add_variant(
    product_id: int, variant_in: VariantCreate, db: Session = Depends(get_db)
):
    product = (
        db.query(models.Product).filter(models.Product.id == product_id).first()
    )
    if not product:
        raise HTTPException(status_code = 404, detail = "Product not found")

    db_variant = models.ProductVariant(
        product_id = product_id,
        weight = variant_in.weight,
        price = variant_in.price,
    )
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)

    return db_variant



# Update an existing variant
#@app.patch("/admin/variants/{variant_id}", response_model=schemas.ProductVariant, dependencies=[Depends(admin_required)])
@app.patch("/admin/variants/{variant_id}", response_model=schemas.ProductVariant)
def admin_update_variant(
    variant_id: int, variant_in: VariantUpdate, db: Session = Depends(get_db)
):
    db_variant = (
        db.query(models.ProductVariant)
        .filter(models.ProductVariant.id == variant_id)
        .first()
    )
    if not db_variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    data = variant_in.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(db_variant, field, value)

    db.commit()
    db.refresh(db_variant)
    return db_variant

# Delete a variant
#@app.delete("/admin/variants/{variant_id}", status_code=204, dependencies=[Depends(admin_required)])
@app.delete("/admin/variants/{variant_id}", status_code=204)
def admin_delete_variant(variant_id: int, db: Session = Depends(get_db)):
    db_variant = (
        db.query(models.ProductVariant)
        .filter(models.ProductVariant.id == variant_id)
        .first()
    )
    if not db_variant:
        raise HTTPException(status_code = 404, detail = "Variant not found")
    db.delete(db_variant)
    db.commit()
    return


# Delete a product and its variants
#@app.delete("/admin/products/{product_id}", status_code=204, dependencies=[Depends(admin_required)])
@app.delete("/admin/products/{product_id}", status_code=204)
def admin_delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = (
        db.query(models.Product)
        .filter(models.Product.id == product_id)
        .first()
    )
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return

#List Orders(for admin)
#@app.get("/admin/orders", response_model=List[schemas.Order], dependencies=[Depends(admin_required)])
@app.get("/admin/orders", response_model=List[schemas.Order])
def admin_list_orders(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    orders = (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .order_by(models.Order.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return orders


























































from fastapi import APIRouter, HTTPException, Request

from src.dal.supplier import SupplierDAL

from src.sessions import sessions

router = APIRouter(
    prefix="/suppliers",
    tags=["List of Energy Suppliers"]
)

@router.get("", response_model=list[str])
def get_suppliers(request: Request):
    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(status_code=401, detail="User is not authenticated.")

    return SupplierDAL().read_suppliers()
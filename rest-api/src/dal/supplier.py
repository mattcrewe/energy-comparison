'''
source: https://www.theenergyshop.com/energy-suppliers
Only showing 'Active' suppliers
'''

class SupplierDAL:

    def __init__(self) -> None:
        self.suppliers = [
            "Affect Energy",
            "Boost Energy",
            "British Gas",
            "Co-Operative Energy",
            "E",
            "E.ON",
            "EBICo",
            "Ecotricity",
            "EDF Energy",
            "Fuse Energy",
            "Good Energy",
            "100Green",
            "M&S Energy",
            "Octopus Energy",
            "Outfox the Market",
            "Ovo Energy",
            "Sainsbury's Energy",
            "Scottish Power",
            "Shell Energy",
            "So Energy",
            "Telecom Utility Warehouse",
            "Tulo Energy",
            "Utilita Energy"
        ]

    def read_suppliers(self) -> list[str]:
        return self.suppliers
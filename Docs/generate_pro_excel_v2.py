import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule

# ============== PROFESSIONAL EXCEL GENERATOR v2.0 ==============
# Project: Crystallized Iron (Survival Shooter 3D)

def generate_pro_excel():
    wb = openpyxl.Workbook()
    
    # 1. Dashboard Sheet
    ws_dash = wb.active
    ws_dash.title = "📊 DASHBOARD"
    ws_dash["A1"] = "CRYSTALLIZED IRON - ASSET PIPELINE"
    ws_dash["A1"].font = Font(size=16, bold=True)
    ws_dash["A3"] = "HƯỚNG DẪN CỘT TRẠNG THÁI:"
    ws_dash["A4"] = "🔴 Waiting: Chưa bắt đầu"
    ws_dash["A5"] = "🟡 Progress: Đang thực hiện"
    ws_dash["A6"] = "🔵 Ready: Xong model, chờ import Unity"
    ws_dash["A7"] = "🟢 Done: Đã hoàn thành & Scripted"

    # 2. Master Asset List
    ws_master = wb.create_sheet("📦 MASTER_ASSET_LIST")
    headers = [
        "Asset ID (Slug)", "Tên Vật Phẩm", "Category", "Sub-Category", 
        "Model Status", "Texture Status", "Unity Import", 
        "Tri Count (V1)", "Collider Type", "Prefab Path", "Mục Đích / Logic"
    ]
    ws_master.append(headers)

    # Sample Data (113 items should be populated here, showing top items as example)
    items = [
        ["res_crystal_col_01", "Cột Thiết Tinh", "Resources", "Mineral", "Waiting", "Waiting", "No", "20", "Box", "Assets/Prefabs/Env/Res_Crystal_01.prefab", "Khai thác lấy Thiết Tinh Thô"],
        ["res_stone_boulder_01", "Tảng Đá Cuội", "Resources", "Mineral", "Waiting", "Waiting", "No", "80", "Mesh", "Assets/Prefabs/Env/Res_Stone_01.prefab", "Nguồn đá và sắt cơ bản"],
        ["bld_found_wood_01", "Móng Nền Gỗ", "Building", "Foundation", "Waiting", "Waiting", "No", "12", "Box", "Assets/Prefabs/Build/Found_Wood_01.prefab", "Sàn nhà gỗ sơ cấp"],
        ["wpn_gun_revolver_01", "Súng Lục Ổ Xoay", "Weapons", "Firearm", "Waiting", "Waiting", "No", "30", "Box", "Assets/Prefabs/Wpn/Gun_Revolver_01.prefab", "Súng 6 viên mid-game"],
    ]
    for item in items: ws_master.append(item)

    # 3. Balancing Stats Sheet
    ws_stats = wb.create_sheet("⚖️ BALANCING_STATS")
    stat_headers = ["Asset ID", "Name", "HP Mod", "Armor Value", "Hunger Mod", "Thirst Mod", "Weight", "Stack Limit"]
    ws_stats.append(stat_headers)
    
    # Stylings
    header_fill = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))

    for ws in [ws_master, ws_stats]:
        # Style Headers
        for cell in ws[1]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal='center')
            cell.border = border
        
        # Freezing & Auto-filter
        ws.freeze_panes = 'A2'
        ws.auto_filter.ref = ws.dimensions

    # Data Validation for Status
    dv = DataValidation(type="list", formula1='"Waiting,InProgress,Ready,Done"', allow_blank=True)
    ws_master.add_data_validation(dv)
    dv.add("E2:G200") # Apply to Status columns

    # Conditional Formatting for Status
    green_fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
    red_fill = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
    yellow_fill = PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid")

    ws_master.conditional_formatting.add("E2:G200", CellIsRule(operator='equal', formula=['"Done"'], fill=green_fill))
    ws_master.conditional_formatting.add("E2:G200", CellIsRule(operator='equal', formula=['"Waiting"'], fill=red_fill))
    ws_master.conditional_formatting.add("E2:G200", CellIsRule(operator='equal', formula=['"InProgress"'], fill=yellow_fill))

    # Save
    path = "Docs/Crystallized_Iron_Asset_Master_v2.xlsx"
    wb.save(path)
    print(f"Excel file created successfully at: {path}")

if __name__ == "__main__":
    generate_pro_excel()

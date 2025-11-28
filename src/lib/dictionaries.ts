export type Dictionary = typeof en

export const en = {
    common: {
        backToHome: "Back to Home",
        loading: "Loading...",
        success: "Success",
        error: "Error",
        save: "Save",
        cancel: "Cancel",
        actions: "Actions",
        status: "Status",
        createdAt: "Created At",
    },
    login: {
        title: "Staff Login",
        description: "Enter your credentials to access the system",
        username: "Username",
        password: "Password",
        signIn: "Sign In",
        signingIn: "Signing in...",
        invalidCredentials: "Invalid username or password",
    },
    dashboard: {
        overview: "Dashboard Overview",
        totalIncidents: "Total Incidents",
        activeCases: "Active Cases",
        resolved: "Resolved",
        incidentsByType: "Incidents by Type",
        recentActivity: "Recent Activity",
        allTimeReported: "All time reported",
        currentlyActive: "Currently active",
        successfullyResolved: "Successfully resolved",
        noRecentActivity: "No recent activity",
        menu: {
            overview: "Overview",
            incidents: "Incidents",
            assignments: "Assignments",
            map: "Map View",
            users: "Users & Units",
            resources: "Resources",
            settings: "Settings",
            logout: "Logout",
        }
    },
    report: {
        title: "Report Incident",
        description: "Report a new incident to the center",
        form: {
            topic: "Topic / Title",
            topicPlaceholder: "e.g. Flood at Village 5",
            type: "Incident Type",
            typePlaceholder: "Select incident type",
            location: "Location",
            province: "Province",
            district: "District",
            subdistrict: "Subdistrict",
            reporterName: "Reporter Name",
            reporterPhone: "Phone Number",
            submit: "Submit Report",
            submitting: "Submitting...",
        },
        types: {
            FLOOD: "Flood",
            FIRE: "Fire",
            STORM: "Storm",
            DROUGHT: "Drought",
            ACCIDENT: "Accident",
            OTHER: "Other",
        },
        success: {
            title: "Report Submitted",
            description: "Your report has been submitted successfully.",
            trackingId: "Tracking ID",
        }
    },
    users: {
        title: "User Management",
        listTitle: "Staff & Volunteers",
        addUser: "Add User",
        table: {
            name: "Name",
            username: "Username",
            role: "Role",
            organization: "Organization",
        },
        create: {
            title: "Create New User",
            description: "Add a new staff member or volunteer to the system.",
            success: "User created successfully",
        }
    },
    resources: {
        title: "Resource Management",
        listTitle: "Equipment & Supplies",
        addResource: "Add Resource",
        table: {
            name: "Name",
            type: "Type",
            capacity: "Capacity",
            status: "Status",
            organization: "Organization",
        },
        create: {
            title: "Create New Resource",
            description: "Add new equipment or supplies to the inventory.",
            success: "Resource created successfully",
        },
        types: {
            VEHICLE: "Vehicle",
            EQUIPMENT: "Equipment",
            SUPPLIES: "Supplies",
            PERSONNEL: "Personnel",
        },
        statuses: {
            AVAILABLE: "Available",
            IN_USE: "In Use",
            MAINTENANCE: "Maintenance",
        }
    }
}

export const th: Dictionary = {
    common: {
        backToHome: "กลับหน้าหลัก",
        loading: "กำลังโหลด...",
        success: "สำเร็จ",
        error: "เกิดข้อผิดพลาด",
        save: "บันทึก",
        cancel: "ยกเลิก",
        actions: "การจัดการ",
        status: "สถานะ",
        createdAt: "วันที่สร้าง",
    },
    login: {
        title: "เข้าสู่ระบบเจ้าหน้าที่",
        description: "กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ",
        username: "ชื่อผู้ใช้งาน",
        password: "รหัสผ่าน",
        signIn: "เข้าสู่ระบบ",
        signingIn: "กำลังเข้าสู่ระบบ...",
        invalidCredentials: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
    },
    dashboard: {
        overview: "ภาพรวมสถานการณ์",
        totalIncidents: "เหตุการณ์ทั้งหมด",
        activeCases: "กำลังดำเนินการ",
        resolved: "เสร็จสิ้น",
        incidentsByType: "สถิติแยกตามประเภท",
        recentActivity: "กิจกรรมล่าสุด",
        allTimeReported: "ที่ได้รับแจ้งทั้งหมด",
        currentlyActive: "กำลังดำเนินการอยู่",
        successfullyResolved: "ดำเนินการเสร็จสิ้นแล้ว",
        noRecentActivity: "ไม่มีกิจกรรมล่าสุด",
        menu: {
            overview: "ภาพรวม",
            incidents: "แจ้งเหตุ",
            assignments: "มอบหมายงาน",
            map: "แผนที่",
            users: "ผู้ใช้งานและหน่วยงาน",
            resources: "ทรัพยากร",
            settings: "ตั้งค่า",
            logout: "ออกจากระบบ",
        }
    },
    report: {
        title: "แจ้งเหตุสาธารณภัย",
        description: "รายงานเหตุการณ์ใหม่ไปยังศูนย์บัญชาการ",
        form: {
            topic: "หัวข้อ / ชื่อเหตุการณ์",
            topicPlaceholder: "เช่น น้ำท่วมหมู่ 5",
            type: "ประเภทเหตุการณ์",
            typePlaceholder: "เลือกประเภทเหตุการณ์",
            location: "สถานที่เกิดเหตุ",
            province: "จังหวัด",
            district: "อำเภอ",
            subdistrict: "ตำบล",
            reporterName: "ชื่อผู้แจ้ง",
            reporterPhone: "เบอร์โทรศัพท์",
            submit: "ส่งรายงาน",
            submitting: "กำลังส่งข้อมูล...",
        },
        types: {
            FLOOD: "น้ำท่วม",
            FIRE: "ไฟไหม้",
            STORM: "พายุ",
            DROUGHT: "ภัยแล้ง",
            ACCIDENT: "อุบัติเหตุ",
            OTHER: "อื่นๆ",
        },
        success: {
            title: "ส่งรายงานสำเร็จ",
            description: "รายงานของคุณถูกส่งเรียบร้อยแล้ว",
            trackingId: "รหัสติดตาม",
        }
    },
    users: {
        title: "จัดการผู้ใช้งาน",
        listTitle: "เจ้าหน้าที่และอาสาสมัคร",
        addUser: "เพิ่มผู้ใช้งาน",
        table: {
            name: "ชื่อ-นามสกุล",
            username: "ชื่อผู้ใช้งาน",
            role: "บทบาท",
            organization: "หน่วยงาน",
        },
        create: {
            title: "สร้างผู้ใช้งานใหม่",
            description: "เพิ่มเจ้าหน้าที่หรืออาสาสมัครใหม่เข้าสู่ระบบ",
            success: "สร้างผู้ใช้งานสำเร็จ",
        }
    },
    resources: {
        title: "จัดการทรัพยากร",
        listTitle: "อุปกรณ์และเวชภัณฑ์",
        addResource: "เพิ่มทรัพยากร",
        table: {
            name: "ชื่อรายการ",
            type: "ประเภท",
            capacity: "ความจุ/จำนวน",
            status: "สถานะ",
            organization: "หน่วยงานที่ดูแล",
        },
        create: {
            title: "เพิ่มทรัพยากรใหม่",
            description: "เพิ่มอุปกรณ์หรือเวชภัณฑ์ใหม่เข้าสู่คลัง",
            success: "สร้างทรัพยากรสำเร็จ",
        },
        types: {
            VEHICLE: "ยานพาหนะ",
            EQUIPMENT: "อุปกรณ์",
            SUPPLIES: "เสบียง/เวชภัณฑ์",
            PERSONNEL: "บุคลากร",
        },
        statuses: {
            AVAILABLE: "พร้อมใช้งาน",
            IN_USE: "กำลังใช้งาน",
            MAINTENANCE: "ซ่อมบำรุง",
        }
    }
}


export const enum EnumPermission {
    Disable = 0,
    ReadOnly = 1,
    Enable = 2,
}
export const enum EnumPeriod {
    AllDay = 1,
    SomeDay = 2,
    Monthly = 3,
}
export const enum EnumWeekDay {
    Day = 1,
    WeekOn = 2,
}
export const enum EnumTypeUpload {
    Image = 1,
    Video = 2,
}

export const enum EnumStatus {
    Draft = 23,
    Submit = 24,
}
export const enum EnumTypeLink {
    External = 1,
    Internal = 2,
}
export const enum EnumLang {
    MainLang = "1",
    MainLangCode = "th-TH",
}

export const enum EnumSubmit {
    Confirm = "C",
    Auto = "A",
    Draft = "D",
}

export const enum EnumUserType {
    UserPTT = "1",
    BSA = "2",
    third_party = "3",
}
export const options = {
    status: [
        { label: "ใช้งาน", value: "1" },
        { label: "ไม่ใช้งาน", value: "0" },
    ],
    pin: [
        { label: "Pin", value: "1" },
        { label: "Unpin", value: "0" },
    ],
    type: [
        { label: "Image", value: "1" },
        { label: "Video", value: "2" },
    ],
}


export const enum EnumDifTable {
    SDG = "76",
    Indicator = "82",
    OccupationGroup = "86",
    Occupation = "87",
    GroupType = "90",
    Agency = "79"
}


export const enum EnumStandradTable {
    BudgetType = "4",
    NatureGroupingType = "8",
    BundleType = "9",
    NatureType = "10",
    CorporateStrategyType = "11",
    AreaType = "12",
    GeographyType = "13",
    PTTProject = "14",
    StakeholdersType = "15",
    CommunityType = "16",
    Agriculture = "17",
    Product = "18"

}

export const enum BundleType {
    fomal = 21,
    Infomal = 22
}

export const enum TypeModeBtn {
    EditDraft = 1,
    EditProject = 2,
    UpdateProgress = 3,
    ViewProject = 4,
    Approve = 5,
    EditReject = 6,
}

export const enum EnumMenu {
    HomeStandard = 6,
    SDG = 21,
    /// <summary>
    /// </summary>
    Indicator = 27,
    /// <summary>
    /// </summary>
    Agency = 24,
    /// <summary>
    /// </summary>
    OccupationGroup = 31,
    /// <summary>
    /// </summary>
    Occupation = 32,
    /// <summary>
    /// </summary>
    Corporate_Strategy = 22,
    /// <summary>
    /// </summary>
    project_nature = 23,
    /// <summary>
    /// </summary>
    AgencyCooperation = 25,
    /// <summary>
    /// </summary>
    Budget = 26,
    /// <summary>
    /// </summary>
    Area = 28,
    /// <summary>
    /// </summary>
    Geography = 29,
    /// <summary>
    /// </summary>
    Community = 30,
    /// <summary>
    /// </summary>
    Agriculture = 33,
    /// <summary>
    /// </summary>
    Product = 34,
    /// <summary>
    /// </summary>
    Bundle = 35,
    /// <summary>
    /// </summary>
    Nature_Grouping = 36,
    /// <summary>
    /// </summary>
    Stakeholders = 37,
    /// <summary>
    /// </summary>
    PTT_Project = 38,
}




